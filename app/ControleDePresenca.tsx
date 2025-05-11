import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  Linking,
  TextInput,
  Modal as RNModal,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import Checkbox from "expo-checkbox";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "../firebaseConfig.js";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { globalStyles } from "../styles/globalStyles";
import { recuperarDadosDemograficos } from "../utils/dadosDemograficos";
import { Picker } from "@react-native-picker/picker";
import Loading from "../components/Loading";
import { ModalDetalhesAluno, ModalOpcoesAluno } from "../components/ModalAluno";
import { getGreeting, getResumo, getMotivacao } from "../utils/whatsappMessages";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTourGuideController, TourGuideZone } from "rn-tourguide";

// Interfaces
interface Aluno {
  id: string;
  nome: string;
  whatsapp?: string;
  status: "presente" | "ausente" | "desativado";
  data?: string; // formato "YYYY-MM-DD" ou Timestamp
  instrutor?: string;
  reposicao?: boolean;
}

interface Palestra {
  id: string;
  titulo: string;
  data?: string; // formato "YYYY-MM-DD"
}

const ControleDePresenca = () => {

  const addRef = useRef(null);

  const {
    start: startTurma,
    stop: stopTurma,
    canStart: canStartTurma,
    eventEmitter: emitterTurma,
    TourGuideZone: TurmaZone,
  } = useTourGuideController("Turma");

  const router = useRouter();
  const { turmaId } = useLocalSearchParams();
  const turmaIdStr = turmaId as string;

  // Estados gerais
  const [demographic, setDemographic] = useState<{ pais: string; estado: string; lumisial: string } | null>(null);
  const [palestraAtual, setPalestraAtual] = useState<number>(1);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(false);
  const [palestras, setPalestras] = useState<Palestra[]>([]);
  const [alunoSelecionado, setAlunoSelecionado] = useState<Aluno | null>(null);
  const [isModalDetalhesVisible, setIsModalDetalhesVisible] = useState(false);
  const [isModalOpcoesVisible, setIsModalOpcoesVisible] = useState(false);
  const [isModalEditarStatusVisible, setIsModalEditarStatusVisible] = useState(false);
  const [instrutorLogado, setInstrutorLogado] = useState<string>("");

  // Recupera o instrutor logado a partir dos dados pessoais salvos (AsyncStorage)
  useEffect(() => {
    const getInstrutorLogado = async () => {
      try {
        const dadosPessoaisString = await AsyncStorage.getItem("dadosPessoais");
        if (dadosPessoaisString) {
          const dadosPessoais = JSON.parse(dadosPessoaisString);
          setInstrutorLogado(dadosPessoais.nome);
        }
      } catch (error) {
        console.error("Erro ao recuperar o instrutor logado:", error);
      }
    };
    getInstrutorLogado();
  }, []);

  // Recupera os dados demográficos
  useEffect(() => {
    const fetchDemographic = async () => {
      try {
        const dados = await recuperarDadosDemograficos();
        setDemographic(dados);
      } catch (error) {
        console.error("Erro ao recuperar dados demográficos:", error);
      }
    };
    fetchDemographic();
  }, []);

  // Função auxiliar para construir o caminho base no Firestore
  const getBasePath = useCallback(() => {
    if (!demographic) return "";
    return `paises/${demographic.pais}/estados/${demographic.estado}/lumisial/${demographic.lumisial}/turmas/${turmaIdStr}`;
  }, [demographic, turmaIdStr]);

  // Busca de palestras (incluindo data)
  const fetchPalestras = useCallback(async () => {
    if (!demographic) return;
    try {
      setLoading(true);
      const basePath = getBasePath();
      const palestrasCollection = collection(firestore, `${basePath}/palestras`);
      const querySnapshot = await getDocs(palestrasCollection);
      const palestrasData = querySnapshot.docs.map((docSnapshot) => ({
        id: docSnapshot.id,
        titulo: docSnapshot.data()?.nome?.pt || `Palestra ${docSnapshot.id}`,
        data: docSnapshot.data()?.data || "",
      }));
      setPalestras(palestrasData);
    } catch (error) {
      console.error("Erro ao buscar palestras:", error);
    } finally {
      setLoading(false);
    }
  }, [demographic, getBasePath]);

  // Busca de presença para a palestra atual (incluindo data, instrutor e reposição)
  const fetchPresenca = useCallback(async (palestraId: string) => {
    if (!demographic) return;
    try {
      setLoading(true);
      const basePath = getBasePath();
      const presencaCollection = collection(firestore, `${basePath}/palestras/${palestraId}/presenca`);
      const querySnapshot = await getDocs(presencaCollection);
      const alunosDataPromises = querySnapshot.docs.map(async (docSnapshot) => {
        const alunoData = docSnapshot.data();
        const alunoId = alunoData.alunoId;
        const alunoDoc = await getDoc(doc(firestore, `${basePath}/alunos/${alunoId}`));
        if (!alunoDoc.exists()) {
          return {
            id: docSnapshot.id,
            nome: "Aluno não encontrado",
            status: alunoData.status || "ausente",
          };
        }
        const alunoInfo = alunoDoc.data();
        return {
          id: docSnapshot.id,
          nome: alunoInfo?.nome || "Nome não encontrado",
          codigoPais: alunoInfo?.codigoPais || "", // Garantindo código do país
          whatsapp: alunoInfo?.whatsapp,
          status: alunoData.status || "ausente",
          data: alunoData.data || "",
          instrutor: alunoData.instrutor || "",
          reposicao: alunoData.reposicao || false,
        };
      });
      const alunosData = await Promise.all(alunosDataPromises);
      setAlunos(alunosData);
    } catch (error) {
      console.error("Erro ao buscar dados de presença:", error);
    } finally {
      setLoading(false);
    }
  }, [demographic, getBasePath]);

  useEffect(() => {
    if (turmaIdStr && demographic) {
      fetchPalestras();
    }
  }, [turmaIdStr, demographic, fetchPalestras]);

  useEffect(() => {
    const currentPalestra = palestras[palestraAtual - 1];
    if (!turmaIdStr || !currentPalestra?.id) return;
    fetchPresenca(currentPalestra.id);
  }, [palestraAtual, turmaIdStr, palestras, fetchPresenca]);

  // Modal para editar data, instrutor e marcar se a aula é reposição
  interface ModalEditarStatusProps {
    visible: boolean;
    fecharModal: () => void;
    aluno: Aluno | null;
    onSalvar: (data: string, instrutor: string, reposicao: boolean) => void;
    palestraId: string;
    basePath: string;
    instrutorPadrao: string;
  }

  const ModalEditarStatus = ({
    visible,
    fecharModal,
    aluno,
    onSalvar,
    palestraId,
    basePath,
    instrutorPadrao,
  }: ModalEditarStatusProps) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [instrutor, setInstrutor] = useState("");
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isReposicao, setIsReposicao] = useState<boolean>(false);

    useEffect(() => {
      const fetchPresenceData = async () => {
        if (aluno && palestraId && basePath) {
          try {
            const presenceDocRef = doc(
              firestore,
              `${basePath}/palestras/${palestraId}/presenca`,
              aluno.id
            );
            const presenceDoc = await getDoc(presenceDocRef);
            if (presenceDoc.exists()) {
              const data = presenceDoc.data();
              if (data.data) {
                if (typeof data.data === "string") {
                  const [year, month, day] = data.data.split("-").map(Number);
                  setSelectedDate(new Date(year, month - 1, day));
                } else if (data.data.toDate) {
                  setSelectedDate(data.data.toDate());
                } else {
                  setSelectedDate(new Date());
                }
              } else {
                setSelectedDate(new Date());
              }
              if (data.instrutor) {
                setInstrutor(data.instrutor);
              } else {
                setInstrutor(instrutorPadrao);
              }
              if (typeof data.reposicao === "boolean") {
                setIsReposicao(data.reposicao);
              } else {
                setIsReposicao(false);
              }
            } else {
              setSelectedDate(new Date());
              setInstrutor(instrutorPadrao);
              setIsReposicao(false);
            }
          } catch (error) {
            console.error("Erro ao carregar dados do modal:", error);
          }
        }
      };
      fetchPresenceData();
    }, [aluno, palestraId, basePath, instrutorPadrao]);

    const formatDateBR = (date: Date) => date.toLocaleDateString("pt-BR");

    const onChangeDate = (event: any, date?: Date) => {
      setShowDatePicker(false);
      if (date) {
        setSelectedDate(date);
      }
    };

    return (
      <RNModal
        transparent={true}
        animationType="slide"
        visible={visible}
        onRequestClose={fecharModal}
      >
        <TouchableWithoutFeedback onPress={fecharModal}>
          <View style={globalStyles.modalContainer}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={globalStyles.modalContent}>
                <Text style={globalStyles.modalTitle}>Presença</Text>
                <Text style={globalStyles.label}>Data:</Text>
                <TouchableOpacity
                  style={globalStyles.dateButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={globalStyles.dateButtonText}>
                    {formatDateBR(selectedDate)}
                  </Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display="default"
                    onChange={onChangeDate}
                  />
                )}
                <Text style={globalStyles.label}>Instrutor:</Text>
                <TextInput
                  placeholder="Instrutor"
                  style={globalStyles.input}
                  value={instrutor}
                  onChangeText={setInstrutor}
                />
                {/* Checkbox para marcar se é aula de reposição */}
                <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 10 }}>
                  <Checkbox
                    value={isReposicao}
                    onValueChange={setIsReposicao}
                    color={isReposicao ? "#4630EB" : undefined}
                  />
                  <Text style={{ marginLeft: 8, fontSize: 16 }}>Reposição</Text>
                </View>

                {/* Container para os botões Atualizar e Voltar lado a lado */}
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
                  <TouchableOpacity
                    style={[globalStyles.iconButton, { alignSelf: "center" }]}
                    onPress={fecharModal}
                  >
                    <MaterialIcons name="arrow-back" size={24} color="#3498db" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[globalStyles.button, { flex: 1, marginLeft: 15 }]}
                    onPress={() => {
                      const formattedDate = selectedDate.toISOString().slice(0, 10);
                      onSalvar(formattedDate, instrutor, isReposicao);
                      fecharModal();
                    }}
                  >

                    <Text style={globalStyles.buttonText}>Atualizar</Text>
                  </TouchableOpacity>

                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </RNModal>
    );
  };

  // Funções de modais para detalhes e opções
  const abrirModalDetalhes = (aluno: Aluno) => {
    setAlunoSelecionado(aluno);
    setIsModalDetalhesVisible(true);
  };

  const fecharModalDetalhes = () => {
    setIsModalDetalhesVisible(false);
    setAlunoSelecionado(null);
  };

  const abrirModalOpcoes = (aluno: Aluno) => {
    setAlunoSelecionado(aluno);
    setIsModalOpcoesVisible(true);
  };

  const fecharModalOpcoes = () => {
    setIsModalOpcoesVisible(false);
    setAlunoSelecionado(null);
  };

  // Função para obter a data local como string "YYYY-MM-DD"
  const getLocalDateString = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Função para alternar status; se "presente", usa data atual e instrutor logado
  const toggleStatus = async (id: string, currentStatus: "presente" | "ausente") => {
    if (!demographic) return;
    try {
      setLoading(true);
      const basePath = getBasePath();
      const currentPalestra = palestras[palestraAtual - 1];
      if (!currentPalestra) return;
      const newStatus = currentStatus === "presente" ? "ausente" : "presente";
      const novaData = newStatus === "presente" ? getLocalDateString() : "";
      const novoInstrutor = newStatus === "presente" ? instrutorLogado : "";
      const alunoDoc = doc(firestore, `${basePath}/palestras/${currentPalestra.id}/presenca`, id);
      console.log("Caminho do documento:", `${basePath}/palestras/${currentPalestra.id}/presenca/${id}`);
      await updateDoc(alunoDoc, { status: newStatus, data: novaData, instrutor: novoInstrutor });
      setAlunos((prev) =>
        prev.map((aluno) =>
          aluno.id === id ? { ...aluno, status: newStatus, data: novaData, instrutor: novoInstrutor } : aluno
        )
      );
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    } finally {
      setLoading(false);
    }
  };

  // Função para desativar o aluno em todas as aulas
  const desativarAlunoEmTodasAulas = async (alunoId: string) => {
    if (!demographic) return;
    try {
      setLoading(true);
      const basePath = getBasePath();
      const alunoDoc = doc(firestore, `${basePath}/alunos/${alunoId}`);
      await updateDoc(alunoDoc, { status: "desativado" });
      const palestrasCollection = collection(firestore, `${basePath}/palestras`);
      const palestrasSnapshot = await getDocs(palestrasCollection);
      for (const palestra of palestrasSnapshot.docs) {
        const presencaDoc = doc(firestore, `${basePath}/palestras/${palestra.id}/presenca/${alunoId}`);
        await updateDoc(presencaDoc, { status: "desativado" });
      }
      setAlunos((prev) =>
        prev.map((aluno) =>
          aluno.id === alunoId ? { ...aluno, status: "desativado" } : aluno
        )
      );
      Alert.alert("Sucesso", "Aluno desativado em todas as aulas!");
    } catch (error) {
      console.error("Erro ao desativar aluno em todas as aulas:", error);
    } finally {
      setLoading(false);
    }
  };

  // Atualiza os campos extras (data, instrutor e reposição) para um aluno
  const atualizarStatusExtras = async (alunoId: string, novaData: string, novoInstrutor: string, reposicao: boolean) => {
    if (!demographic) return;
    try {
      setLoading(true);
      const basePath = getBasePath();
      const currentPalestra = palestras[palestraAtual - 1];
      if (!currentPalestra) return;
      const statusDoc = doc(firestore, `${basePath}/palestras/${currentPalestra.id}/presenca`, alunoId);
      console.log("Caminho do documento:", statusDoc);
      await updateDoc(statusDoc, { data: novaData, instrutor: novoInstrutor, reposicao });
      setAlunos((prev) =>
        prev.map((aluno) =>
          aluno.id === alunoId ? { ...aluno, data: novaData, instrutor: novoInstrutor, reposicao } : aluno
        )
      );
    } catch (error) {
      console.error("Erro ao atualizar data/instrutor:", error);
    } finally {
      setLoading(false);
    }
  };

  const adicionarAluno = () => {
    const currentPalestra = palestras[palestraAtual - 1];
    if (!currentPalestra) return;
    if (!alunoSelecionado) {
      router.push({
        pathname: "/InserirAluno",
        params: { turmaId: turmaIdStr, palestraId: currentPalestra.id },
      });
    } else {
      router.push({
        pathname: "/InserirAluno",
        params: { turmaId: turmaIdStr, alunoId: alunoSelecionado.id },
      });
    }
  };

  // Função para abrir o WhatsApp – utilizando os métodos importados
  const abrirWhatsApp = (
    codigoPais?: string,
    whatsapp?: string,
    alunoNome?: string,
    tipoMensagem?: "conversa" | "resumo" | "motivacao",
    palestraTitulo?: string
  ) => {
    if (!whatsapp) {
      console.error("Erro: Número de WhatsApp não disponível.");
      return;
    }

    const numeroFormatado = whatsapp.replace(/\D/g, ""); // Remove caracteres não numéricos
    const codigoPaisFormatado = codigoPais?.replace(/\D/g, "") || "55"; // Garante código do país limpo
    const numeroCompleto = `+${codigoPaisFormatado}${numeroFormatado}`;


    //const numeroFormatado = whatsapp.replace(/[^0-9]/g, "");
    let mensagem = getGreeting(alunoNome || "Aluno");
    switch (tipoMensagem) {
      case "conversa":
        mensagem += "\nGostaria de conversar com você sobre a aula.";
        break;
      case "resumo":
        mensagem += `\nAqui está o resumo da aula "${palestraTitulo}":\n${getResumo(palestraTitulo || "")}`;
        break;
      case "motivacao":
        mensagem += `\n${getMotivacao(palestraTitulo || "")}`;
        break;
      default:
        mensagem += "\nGostaria de conversar com você sobre a aula.";
    }
    console.log(`📩 Enviando mensagem para ${numeroCompleto}: ${mensagem}`);
    const url = `whatsapp://send?phone=${numeroCompleto}&text=${encodeURIComponent(mensagem)}`;

    //console.log(`📩 Enviando mensagem: ${mensagem}`);
    //const url = `whatsapp://send?phone=${numeroFormatado}&text=${encodeURIComponent(mensagem)}`;
    Linking.openURL(url)
      .then(() => console.log("WhatsApp aberto com sucesso!"))
      .catch((err) => console.error("Erro ao abrir o WhatsApp:", err));
  };

  // Abre o modal de edição de data/instrutor e define o aluno selecionado
  const abrirModalEditarStatusParaAluno = (aluno: Aluno) => {
    setAlunoSelecionado(aluno);
    setIsModalEditarStatusVisible(true);
  };

  const fecharModalEditarStatus = () => {
    setIsModalEditarStatusVisible(false);
  };

  // Função para converter string de data "YYYY-MM-DD" em objeto Date (local)
  const parseLocalDate = (dateString: string): Date => {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  // Renderiza cada item (aluno) na lista – exibe data e status
  const renderItem = ({ item }: { item: Aluno }) => {
    const currentPalestra = palestras[palestraAtual - 1];
    const dataExibida =
      item.data && item.data !== ""
        ? parseLocalDate(item.data).toLocaleDateString("pt-BR")
        : currentPalestra?.data && currentPalestra.data !== ""
          ? parseLocalDate(currentPalestra.data).toLocaleDateString("pt-BR")
          : "Ausente";
    return (
      <TouchableOpacity
        style={[
          globalStyles.item,
          item.status === "desativado" && globalStyles.desativado,
        ]}
        onPress={() => abrirModalDetalhes(item)}
        onLongPress={() => abrirModalOpcoes(item)}
      >
        <Text style={globalStyles.nome}>{item.nome}</Text>
        <View style={globalStyles.statusContainer}>
          <TouchableOpacity
            style={globalStyles.statusToggle}
            disabled={item.status === "desativado"}
            onPress={() =>
              item.status !== "desativado" && toggleStatus(item.id, item.status)
            }
          >
            {item.status === "presente" ? (
              <AntDesign name="checkcircle" size={20} color="green" />
            ) : (
              <AntDesign name="closecircle" size={20} color="red" />
            )}
            <Text style={globalStyles.dateText}>{dataExibida}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => abrirModalEditarStatusParaAluno(item)}
            style={globalStyles.editButton}
          >
            <AntDesign name="edit" size={16} color="#333" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <GestureHandlerRootView style={globalStyles.container}>
      {loading && <Loading />}
      {!loading && (
        <>
          <View style={{ flex: 1 }}>
            <View style={globalStyles.headerContainer}>
              <TouchableOpacity onPress={() => router.push("/ConsultarTurmas")}>
                <MaterialIcons name="home" size={28} style={globalStyles.iconHome} />
              </TouchableOpacity>
              <Picker
                selectedValue={palestraAtual}
                onValueChange={(itemValue) => setPalestraAtual(itemValue)}
                style={globalStyles.picker}
              >
                {palestras.map((palestra, index) => (
                  <Picker.Item
                    key={palestra.id}
                    label={palestra.titulo}
                    value={index + 1}
                  />
                ))}
              </Picker>
            </View>
            <FlatList
              data={alunos}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              ListEmptyComponent={
                <Text style={globalStyles.empty}>Nenhum aluno encontrado.</Text>
              }
              refreshing={loading}
              onRefresh={() => {
                const currentPalestra = palestras[palestraAtual - 1];
                if (currentPalestra?.id) {
                  fetchPresenca(currentPalestra.id);
                }
              }}
            />
          </View>
          <View style={{ position: "absolute", bottom: 1, right: 1, }}>
            <TurmaZone zone={4} text="Você pode adicionar uma nova turma pressionando o botão mais." shape={'circle'} style={{
              padding: 30, bottom: 0,
              right: 10, marginLeft: 1
            }} >
              <TouchableOpacity ref={addRef} style={globalStyles.addButton} onPress={adicionarAluno}>
                <AntDesign name="plus" size={24} color="#ecf0f1" />
              </TouchableOpacity>
            </TurmaZone>
          </View>
          {/* Modal de detalhes do aluno */}
          <ModalDetalhesAluno
            aluno={alunoSelecionado}
            palestraTitulo={palestras[palestraAtual - 1]?.titulo || "Palestra"}
            turmaId={turmaIdStr}
            visibleDetalhes={isModalDetalhesVisible}
            fecharDetalhes={fecharModalDetalhes}
            router={router}
          />
          {/* Modal de opções do aluno */}
          <ModalOpcoesAluno
            aluno={alunoSelecionado}
            palestraTitulo={palestras[palestraAtual - 1]?.titulo || "Palestra"}
            turmaId={turmaIdStr}
            visibleOpcoes={isModalOpcoesVisible}
            fecharOpcoes={fecharModalOpcoes}
            abrirWhatsApp={abrirWhatsApp}
            desativarAlunoEmTodasAulas={desativarAlunoEmTodasAulas}
          />
          {/* Modal para editar data/instrutor – passando também palestraId, basePath e instrutorPadrao */}
          <ModalEditarStatus
            visible={isModalEditarStatusVisible}
            fecharModal={fecharModalEditarStatus}
            aluno={alunoSelecionado}
            onSalvar={(novaData, novoInstrutor, reposicao) => {
              if (alunoSelecionado) {
                atualizarStatusExtras(alunoSelecionado.id, novaData, novoInstrutor, reposicao);
                console.log(alunoSelecionado.id, novaData, novoInstrutor, reposicao);
              }
            }}
            palestraId={palestras[palestraAtual - 1]?.id || ""}
            basePath={getBasePath()}
            instrutorPadrao={instrutorLogado}
          />
        </>
      )}
    </GestureHandlerRootView>
  );
};

export default ControleDePresenca;
