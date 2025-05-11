import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking, TouchableWithoutFeedback, Keyboard, ScrollView,
} from "react-native";
import { useRouter, useLocalSearchParams, } from "expo-router";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "../firebaseConfig";
import {
  GestureHandlerRootView,
  PanGestureHandler,
  State,
} from "react-native-gesture-handler";
import { AntDesign, MaterialIcons, } from "@expo/vector-icons";
import { globalStyles } from "../styles/globalStyles"; // Importando o CSS
import { recuperarDadosDemograficos } from "../utils/dadosDemograficos"; // Importando a função reutilizável
import { Modal } from "react-native";
import { Picker } from "@react-native-picker/picker";
import Loading from "../components/Loading"; // Importando o componente Loading

interface Aluno {
  id: string;
  nome: string;
  whatsapp?: string; // Propriedade opcional
  status: "presente" | "ausente" | "desativado"; // Adicionado "desativado"
}

interface Palestra {
  id: string;
  titulo: string;
}

const ControleDePresenca = () => {
  const [alunoSelecionado, setAlunoSelecionado] = useState<Aluno | null>(null);
  const fecharModal = () => setAlunoSelecionado(null);

  const router = useRouter();
  const { turmaId } = useLocalSearchParams();

  const [palestraAtual, setPalestraAtual] = useState<number>(1); // Palestra inicial
  const [turma, setTurma] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(false); // Estado para mostrar o loading
  const [palestras, setPalestras] = useState<Palestra[]>([]);

  const fetchPalestras = async () => {
    try {
      setLoading(true); // Ativa o loading
      const { pais, estado, lumisial } = await recuperarDadosDemograficos();
      const caminhoFirestore = `paises/${pais}/estados/${estado}/lumisial/${lumisial}/turmas`;

      const palestrasCollection = collection(
        firestore,
        `${caminhoFirestore}/${turmaId}/palestras`
      );

      const querySnapshot = await getDocs(palestrasCollection);

      const palestrasData = querySnapshot.docs.map((docSnapshot) => ({
        id: docSnapshot.id,
        titulo: docSnapshot.data()?.nome?.pt || `Palestra ${docSnapshot.id}`,
      }));

      setPalestras(palestrasData);
    } catch (error) {
      console.error("Erro ao buscar palestras:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPresenca = async (palestraId: string) => {
    try {
      setLoading(true); // Ativa o loading
      const { pais, estado, lumisial } = await recuperarDadosDemograficos();
      const caminhoFirestore = `paises/${pais}/estados/${estado}/lumisial/${lumisial}/turmas`;
      setLoading(true);

      const presencaCollection = collection(
        firestore,
        `${caminhoFirestore}/${turmaId}/palestras/${palestraId}/presenca`
      );

      const querySnapshot = await getDocs(presencaCollection);

      const alunosDataPromises = querySnapshot.docs.map(async (docSnapshot) => {
        const alunoData = docSnapshot.data();
        const alunoId = alunoData.alunoId;

        const alunoDoc = await getDoc(
          doc(firestore, `${caminhoFirestore}/${turmaId}/alunos/${alunoId}`)
        );
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
          whatsapp: alunoInfo?.whatsapp,
          status: alunoData.status || "ausente",
        };
      });

      const alunosData = await Promise.all(alunosDataPromises);
      setTurma(alunosData);
    } catch (error) {
      console.error("Erro ao buscar dados de presença:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPalestras();
  }, [turmaId]);

  useEffect(() => {
    if (!turmaId || !palestras[palestraAtual - 1]?.id) return;
    fetchPresenca(palestras[palestraAtual - 1].id);
  }, [palestraAtual, turmaId, palestras]);

  const handleSwipe = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      if (
        event.nativeEvent.translationX < -50 &&
        palestraAtual < palestras.length
      ) {
        setPalestraAtual((prev) => prev + 1);
      } else if (event.nativeEvent.translationX > 50 && palestraAtual > 1) {
        setPalestraAtual((prev) => prev - 1);
      }
    }
  };

  const toggleStatus = async (
    id: string,
    currentStatus: "presente" | "ausente"
  ) => {
    try {
      setLoading(true); // Ativa o loading
      const { pais, estado, lumisial } = await recuperarDadosDemograficos();
      const caminhoFirestore = `paises/${pais}/estados/${estado}/lumisial/${lumisial}/turmas`;
      const palestraId = palestras[palestraAtual - 1].id;
      const newStatus = currentStatus === "presente" ? "ausente" : "presente";

      const alunoDoc = doc(
        firestore,
        `${caminhoFirestore}/${turmaId}/palestras/${palestraId}/presenca`,
        id
      );
      await updateDoc(alunoDoc, { status: newStatus });

      setTurma((prev) =>
        prev.map((aluno) => (aluno.id === id ? { ...aluno, status: newStatus } : aluno))
      );
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    } finally {
      setLoading(false); // Desativa o loading
    }
  };

  const abrirWhatsApp = (whatsapp?: string) => {
    if (!whatsapp) {
      console.error("Erro", "Número de WhatsApp não disponível.");
      return;
    }
    const url = `https://wa.me/${whatsapp}`;
    Linking.openURL(url).catch((err) =>
      console.error("Erro ao abrir o WhatsApp:", err)
    );
  };

  const desativarAlunoEmTodasAulas = async (alunoId: string) => {
    try {
      setLoading(true); // Ativa o loading
      const { pais, estado, lumisial } = await recuperarDadosDemograficos();
      const caminhoFirestore = `paises/${pais}/estados/${estado}/lumisial/${lumisial}/turmas`;

      // Atualizar status no documento do aluno
      const alunoDoc = doc(firestore, `${caminhoFirestore}/${turmaId}/alunos/${alunoId}`);
      await updateDoc(alunoDoc, { status: "desativado" });

      // Atualizar status em todas as palestras
      const palestrasCollection = collection(
        firestore,
        `${caminhoFirestore}/${turmaId}/palestras`
      );
      const palestrasSnapshot = await getDocs(palestrasCollection);

      for (const palestra of palestrasSnapshot.docs) {
        const presencaDoc = doc(
          firestore,
          `${caminhoFirestore}/${turmaId}/palestras/${palestra.id}/presenca/${alunoId}`
        );
        await updateDoc(presencaDoc, { status: "desativado" });
      }

      // Atualizar a lista localmente
      setTurma((prev) =>
        prev.map((aluno) =>
          aluno.id === alunoId ? { ...aluno, status: "desativado" } : aluno
        )
      );

      Alert.alert("Sucesso", "Aluno desativado em todas as aulas!");
    } catch (error) {
      console.error("Erro ao desativar aluno em todas as aulas:", error);
      //Alert.alert("Erro", "Não foi possível desativar o aluno.");
    } finally {
      setLoading(false); // Desativa o loading
    }
  };

  const renderItem = ({ item }: { item: Aluno }) => (
    <TouchableOpacity
      style={[
        globalStyles.item,
        item.status === "desativado" && globalStyles.desativado,
      ]}
      onPress={() => setAlunoSelecionado(item)} // Exibir modal com informações do aluno
      onLongPress={() =>
        Alert.alert(
          "Opções avançadas",
          `O que você deseja fazer com o aluno ${item.nome}?`,
          [
            {
              text: `📨 Enviar motivação para ${item.nome}`,
              onPress: () => abrirWhatsApp(item.whatsapp),
            },
            {
              text: `📨 Enviar resumo para ${item.nome}`,
              onPress: () => abrirWhatsApp(item.whatsapp),
            },
            {
              text: `📨 Conversar com ${item.nome}`,
              onPress: () => abrirWhatsApp(item.whatsapp),
            },
            {
              text: "Desativar aluno 😢",
              onPress: () =>
                Alert.alert(
                  "⚠️ DESATIVAÇÃO PERMANENTE",
                  `Você tem certeza que deseja desativar ${item.nome}?`,
                  [
                    { text: "Cancelar", style: "cancel" },
                    {
                      text: "Confirmar",
                      onPress: () => desativarAlunoEmTodasAulas(item.id),
                    },
                  ],
                  { cancelable: true }
                ),
            },
            { text: "Voltar", style: "cancel" },
          ],
          { cancelable: true }
        )
      }


    >
      <Text style={globalStyles.nome}>{item.nome}</Text>
      <TouchableOpacity
        style={[
          globalStyles.botao,
          item.status === "presente" && globalStyles.presente,
          item.status === "ausente" && globalStyles.ausente,
          item.status === "desativado" && globalStyles.desativadoBotao,
        ]}
        disabled={item.status === "desativado"}
        onPress={() =>
          item.status !== "desativado" && toggleStatus(item.id, item.status)
        }
      >
        <Text style={globalStyles.textoBotao}>
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const adicionarAluno = () => {
    if (!alunoSelecionado) {
      router.push({
        pathname: "/InserirAluno",
        params: {
          turmaId,
          palestraId: palestras[palestraAtual - 1].id,
        },
      });
      return;
    }
    router.push({
      pathname: "/InserirAluno",
      params: {
        turmaId,
        alunoId: alunoSelecionado.id ,
      },
    });
  };

  const InformacoesAluno = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={!!alunoSelecionado}
      onRequestClose={fecharModal}
    >
      <TouchableWithoutFeedback onPress={fecharModal}>
        <View style={globalStyles.modalContainer}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={globalStyles.modalContent}>
              {alunoSelecionado && (
                <>
                  <Text style={globalStyles.modalTitle}>Informações do Aluno</Text>
                  <Text style={globalStyles.modalText}>Nome: {alunoSelecionado.nome}</Text>
                  <Text style={globalStyles.modalText}>
                    WhatsApp: {alunoSelecionado.whatsapp || "Não informado"}
                  </Text>
                  <Text style={globalStyles.modalText}>
                    Status: {alunoSelecionado.status}
                  </Text>

                  <View style={globalStyles.buttonsContainer}>
                    {/* Botão de voltar com ícone */}
                    <TouchableOpacity
                      style={globalStyles.iconButton}
                      onPress={fecharModal}
                    >
                      <MaterialIcons name="arrow-back" size={24} color="#3498db" />
                    </TouchableOpacity>

                    {/* Botão de editar aluno */}
                    <TouchableOpacity
                      style={globalStyles.buttonAluno}
                      onPress={() => {
                        if (alunoSelecionado?.id) {
                          fecharModal();
                          router.push({
                            pathname: "/InserirAluno",
                            params: { alunoId: alunoSelecionado.id, turmaId },
                          });
                        } else {
                          console.error("Erro", "Aluno não selecionado.");
                        }
                      }}
                    >
                      <Text style={globalStyles.buttonText}>Editar Aluno</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  return (
    <GestureHandlerRootView style={globalStyles.container}>
            {/* Exibe o componente de loading quando necessário */}
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
              <Picker.Item key={palestra.id} label={palestra.titulo} value={index + 1} />
            ))}
          </Picker>
        </View>
        {loading ? (
          <Text style={globalStyles.loading}>Carregando...</Text>
        ) : (
          <FlatList
            data={turma}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            ListEmptyComponent={
              <Text style={globalStyles.empty}>
                Nenhum aluno encontrado.
              </Text>
            }
            refreshing={loading}
            onRefresh={() => {
              if (palestras[palestraAtual - 1]?.id) {
                fetchPresenca(palestras[palestraAtual - 1].id);
              }
            }}
          />
        )}
      </View>

      <TouchableOpacity style={globalStyles.addButton} onPress={adicionarAluno}>
        <AntDesign name="plus" size={24} color="#ecf0f1" />
      </TouchableOpacity>

      <InformacoesAluno />
      </>
      )}
    </GestureHandlerRootView>

  );
};

/*
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  nome: {
    fontSize: 18,
  },
  botao: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  presente: {
    backgroundColor: "#4caf50",
  },
  ausente: {
    backgroundColor: "#ff9800",
  },
  textoBotao: {
    color: "#fff",
    fontWeight: "bold",
  },
  loading: {
    fontSize: 18,
    textAlign: "center",
    color: "blue",
  },
  empty: {
    fontSize: 18,
    textAlign: "center",
    color: "gray",
    marginTop: 20,
  },

  text: {
    fontSize: 16,
    marginBottom: 5,
  },

  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#4caf50",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  
});
*/

export default ControleDePresenca;
