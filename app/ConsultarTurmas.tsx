import React, { useState, useEffect, useRef } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { firestore } from "../firebaseConfig";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { globalStyles } from "../styles/globalStyles";
import { recuperarDadosDemograficos } from "../utils/dadosDemograficos";
import Loading from "../components/Loading";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTourGuideController, TourGuideZone } from "rn-tourguide";

// Definição da estrutura dos dados
interface Turma {
  id: string;
  local: string;
  dias: string;
  horario: string;
  responsavel: string; // Instrutor
  tema: string;
  obs: string;
  dataAbertura: string; // Data de abertura (para extrair o ano)
}

const ConsultarTurmas = () => {
  const router = useRouter();
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [instrutores, setInstrutores] = useState<string[]>([]);
  const [anosPorInstrutor, setAnosPorInstrutor] = useState<{ [instrutor: string]: string[] }>({});
  const [turmasPorAno, setTurmasPorAno] = useState<{ [instrutor: string]: { [ano: string]: Turma[] } }>({});
  const [Pais, setPais] = useState(null); // Estado para armazenar o valor de Pais
  const [instrutorSelecionado, setInstrutorSelecionado] = useState<string | null>(null);
  const [anoSelecionado, setAnoSelecionado] = useState<string | null>(null);
  const [CPF, setCpf] = useState(""); // Recupando dados parao carregamento do perfil
  const [loading, setLoading] = useState(false);
  // Inicio do código tutorial
  //const { start, canStart } = useTourGuideController(); // 🔥 Pegamos o `eventEmitter`
  const [tutorialEtapa, setTutorialEtapa] = useState(1); // Estado para controlar a etapa
  const { start, eventEmitter, canStart } = useTourGuideController();

  //  const { start, canStart } = useTourGuideController(); // ✅ Obtém o controle do tour
  const homeRef = useRef(null);
  const configRef = useRef(null);
  const listaRef = useRef(null);
  const addRef = useRef(null);
  //AsyncStorage.removeItem("tutorialCompleted");
  //AsyncStorage.setItem("tutorialCompleted", "false");


  // fim do código tutorial

  const fetchTurmas = async () => {
    try {
      setLoading(true);
      const { pais, estado, lumisial } = await recuperarDadosDemograficos();
      setPais(pais); // Atualiza o estado do País
      const caminhoFirestore = `paises/${pais}/estados/${estado}/lumisial/${lumisial}/turmas`;

      const querySnapshot = await getDocs(collection(firestore, caminhoFirestore));
      const turmasData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Turma[];

      setTurmas(turmasData);

      // Organizar os dados por instrutor e ano
      const instrutoresSet = new Set<string>();
      const anosMap: { [instrutor: string]: Set<string> } = {};
      const turmasAnoMap: { [instrutor: string]: { [ano: string]: Turma[] } } = {};

      turmasData.forEach((turma) => {
        instrutoresSet.add(turma.responsavel);

        const ano = turma.dataAbertura ? turma.dataAbertura.split("-")[0] : "Desconhecido";

        if (!anosMap[turma.responsavel]) anosMap[turma.responsavel] = new Set();
        anosMap[turma.responsavel].add(ano);

        if (!turmasAnoMap[turma.responsavel]) turmasAnoMap[turma.responsavel] = {};
        if (!turmasAnoMap[turma.responsavel][ano]) turmasAnoMap[turma.responsavel][ano] = [];
        turmasAnoMap[turma.responsavel][ano].push(turma);
      });

      setInstrutores(Array.from(instrutoresSet));
      setAnosPorInstrutor(
        Object.keys(anosMap).reduce((acc, key) => {
          acc[key] = Array.from(anosMap[key]);
          return acc;
        }, {} as { [instrutor: string]: string[] })
      );
      setTurmasPorAno(turmasAnoMap);
    } catch (error) {
      console.error("Erro ao buscar turmas:", error);
    } finally {
      setLoading(false);
    }
  };

  // Chamando a função para carregar as turmas na inicialização
  useEffect(() => {
    fetchTurmas();
  }, []);

  // Iniciando tutorial
  useEffect(() => {
    const checkIfTutorialSeen = async () => {
      const etapaSalva = await AsyncStorage.getItem("tutorialEtapa");
  
      if (etapaSalva) {
        setTutorialEtapa(parseInt(etapaSalva, 10)); // 🔥 Recupera a última etapa salva
      }
  
      if (!etapaSalva && canStart && anoSelecionado === null) {
        console.log("📢 Iniciando tutorial da etapa:", etapaSalva);
        
        setTimeout(() => {
          start(parseInt(etapaSalva ?? "1", 10)); // 🔥 Usa o valor salvo, ou começa da etapa 1
        }, 500); // 🔥 Delay maior para evitar que rode antes da renderização completa
      }

    };
    //AsyncStorage.setItem("tutorialEtapa", "1".toString()); // 🔥 Salva o progresso do tutorial
    setTimeout(() => {
      //start(); // 🔥 Usa o valor salvo, ou começa da etapa 1
    }, 500);
    checkIfTutorialSeen();
  }, [canStart, anoSelecionado]);
  
  // 🔹 Usa um useEffect para iniciar o tutorial na etapa correta após atualizar o estado
  useEffect(() => {
    if (tutorialEtapa > 1 && canStart) {
      console.log("✅ Tutorial avançando para a etapa:", tutorialEtapa);
  
      setTimeout(() => {
        console.log("🚀 Chamando start() com tutorialEtapa:", tutorialEtapa);
        start(tutorialEtapa);
      }, 500); // 🔥 Delay maior para garantir que o tutorial inicia no tempo certo
    }
  }, [tutorialEtapa, canStart]);
  
  // 🔹 Reinicia o tutorial ao selecionar um instrutor, mas continua na parte correta
  const handleInstrutorSelecionado = (instrutor: string) => {
    setInstrutorSelecionado(instrutor);
    console.log("👨‍🏫 Instrutor selecionado:", instrutor);
  
    if (tutorialEtapa < 5 && canStart) {
      const novaEtapa = 5;
      AsyncStorage.setItem("tutorialEtapa", "5".toString()); // 🔥 Salva o progresso do tutorial
      setTutorialEtapa(novaEtapa);
    }
  };
  
  // 🔹 Reinicia o tutorial ao selecionar um ano, mas continua na parte correta
  const handleAnoSelecionado = (ano: string) => {
    setAnoSelecionado(ano);
    console.log("📅 Ano selecionado:", ano);
  
    if (tutorialEtapa < 6 && canStart) {
      const novaEtapa = 6;
      AsyncStorage.setItem("tutorialEtapa", "6".toString()); // 🔥 Salva o progresso do tutorial
      setTutorialEtapa(novaEtapa);
    }
  };  
  

  // Função para deletar turma
  const removerTurma = async (id: string) => {
    Alert.alert(
      "Estas disposto?",
      "Você tem certeza que deseja remover permanentemente esta turma?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Remover",
          onPress: async () => {
            try {
              setLoading(true);
              const { pais, estado, lumisial } = await recuperarDadosDemograficos();
              const caminhoFirestore = `paises/${pais}/estados/${estado}/lumisial/${lumisial}`;

              // Remove a turma do Firestore
              await deleteDoc(doc(firestore, `${caminhoFirestore}/turmas`, id));

              // Atualiza a lista de turmas chamando novamente a busca
              await fetchTurmas();

              Alert.alert("Sucesso", "Turma removida com sucesso!");
            } catch (error) {
              console.error("Erro ao remover turma:", error);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };


  // Função para remover todas as subcoleções antes de excluir a turma
  const removerSubcolecoes = async (caminhoFirestore: string) => {
    const colecoes = ["alunos", "palestras"]; // Subcoleções dentro de turmas
    for (const colecao of colecoes) {
      const colecaoRef = collection(firestore, `${caminhoFirestore}/${colecao}`);
      const querySnapshot = await getDocs(colecaoRef);
      const deletarDocumentos = querySnapshot.docs.map((docSnap) =>
        deleteDoc(doc(firestore, `${caminhoFirestore}/${colecao}`, docSnap.id))
      );
      await Promise.all(deletarDocumentos); // Aguarda a exclusão de todas as subcoleções
    }
  };



  // Função para abrir uma turma
  const abrirTurma = (item: Turma) => {
    router.push({
      pathname: "/ControleDePresenca",
      params: { turmaId: item.id },
    });
  };

  // Função para adicionar nova turma
  const adicionarNovaTurma = () => {
    router.push("/InserirTurma"); // Redireciona para a tela de criação de turma
  };

  // Função para exibir o menu de opções
  const exibirOpcoes = (item: Turma) => {
    Alert.alert(
      "Opções da Turma",
      `O que você deseja fazer com a turma?`,
      [
        {
          text: "Alterar",
          onPress: () =>
            router.push({
              pathname: "/InserirTurma",
              params: {
                id: item.id,
                responsavelParam: item.responsavel,
                dataAberturaParam: item.dataAbertura,
                localParam: item.local,
                diasParam: item.dias,
                horarioParam: item.horario,
                temaParam: item.tema,
                obsParam: item.obs,
              },
            }),
        },
        {
          text: "Remover",
          onPress: () => removerTurma(item.id),
          style: "destructive",
        },
        { text: "Cancelar", style: "cancel" },
      ]
    );
  };

  return (
    <View style={globalStyles.containerTurma}>
      {loading && <Loading />}

      {!loading && (
        <>
          <View style={globalStyles.headerContainer}>
            {/* Tutorial no botão Home */}

            <TourGuideZone zone={1} text="Aqui você volta para a tela inicial, onde poderá selecionar o Instrutor resposável pela turma!" shape={'circle'}
              style={{}}>
              <TouchableOpacity ref={homeRef} onPress={() => router.push("/ConsultarTurmas")} style={{ padding: 0, marginBottom: 32, }}>
                <MaterialIcons name="home" size={28} style={globalStyles.iconHome} />
              </TouchableOpacity>
            </TourGuideZone>
            <Text style={globalStyles.titleTurma}>GNOSIS {Pais}</Text>
            <TourGuideZone zone={2} text="Nessa engrenagem você pode visualizar e editar seus dados pessoais e demográficos." shape={'circle'} style={{}}>
              <TouchableOpacity ref={configRef}
                onPress={() => router.push({
                  pathname: "/PerfilUsuario",
                  params: {
                    cpf: CPF
                  },
                })
                }>
                <MaterialIcons name="settings" size={28} style={globalStyles.iconSettings} />
              </TouchableOpacity>
            </TourGuideZone>
          </View>

          {/* Lista de instrutores */}
          {!instrutorSelecionado && (
            <TourGuideZone zone={3} text="As turmas estão organizadas por instrutor." borderRadius={10} style={{ marginTop: 20, padding: 10, paddingTop: 0, paddingBottom: 60, }}>
              <FlatList
                data={instrutores}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity ref={listaRef}
                    style={globalStyles.itemTurmas}
                    //onPress={() => setInstrutorSelecionado(item)}
                    onPress={() => handleInstrutorSelecionado(item)}
                  >
                    <Text style={globalStyles.text}>{`Instrutor: ${item || "Desconhecido"}`}</Text>
                  </TouchableOpacity>
                )}
                refreshing={loading} // Adiciona a função de atualização
                onRefresh={fetchTurmas} // Recarrega os dados ao puxar para baixo
              />
            </TourGuideZone>

          )}

          {/* Lista de anos */}
          {instrutorSelecionado && !anoSelecionado && (

            <TourGuideZone zone={5} text="Selecionando o ano poderá visualizar as turmas." borderRadius={10} style={{ marginTop: 20, padding: 10, paddingTop: 0, paddingBottom: 60, }}>
              <FlatList
                data={anosPorInstrutor[instrutorSelecionado] || []}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={globalStyles.itemTurmas}
                    //onPress={() => setAnoSelecionado(item)}
                    onPress={() => handleAnoSelecionado(item)}
                  >
                    <Text style={globalStyles.text}>{`Ano: ${item || ""}`}</Text>
                  </TouchableOpacity>
                )}
                refreshing={loading}
                onRefresh={fetchTurmas}
              />
            </TourGuideZone>
          )}

          {/* Lista de turmas */}
          {anoSelecionado && (
            <TourGuideZone zone={6} text={"Finalmente podemos visualizar a turma selecionada! ❤️\n\nUm toque simples sobre a turma te permite visualizar os alunos.\n\nUm toque longo sobre a turma te permite alterar ou remover a turma selecionada."}

               borderRadius={10} style={{ marginTop: 20, padding: 10, paddingTop: 0, paddingBottom: 60, }}>

              <FlatList
                data={turmasPorAno[instrutorSelecionado ?? "Instrutor"]?.[anoSelecionado ?? "Ano"] || []}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={globalStyles.itemTurmas}
                    onPress={() => abrirTurma(item)}
                    onLongPress={() => exibirOpcoes(item)}
                  >
                    <Text style={globalStyles.text}>Responsável: {item.responsavel || ""}
                    </Text><Text style={globalStyles.text}>
                      Data de Abertura: {item.dataAbertura ? item.dataAbertura.split("-").reverse().join("/") : ""}
                    </Text>
                    <Text style={globalStyles.text}>Local: {item.local}</Text>
                    <Text style={globalStyles.text}>Dias da semana: {item.dias}</Text>
                    <Text style={globalStyles.text}>Horário: {item.horario || ""}</Text>
                    <Text style={globalStyles.text}>Tema de abertura: {item.tema || ""}</Text>
                    <Text style={globalStyles.text}>Observações: {item.obs || ""}</Text>
                  </TouchableOpacity>
                )}
                refreshing={loading}
                onRefresh={fetchTurmas}
              />
            </TourGuideZone>

          )}
          {(instrutorSelecionado || anoSelecionado) && (
            <TouchableOpacity
              onPress={() => {
                if (anoSelecionado) setAnoSelecionado(null);
                else setInstrutorSelecionado(null);
              }}
            >
            </TouchableOpacity>
          )}

          {/* 🔹 Botão para adicionar nova turma 🔹 */}
          <View style={{ position: "absolute", bottom: 1, right: 1, }}>
            <TourGuideZone zone={4} text="Você pode adicionar uma nova turma pressionando o botão mais." shape={'circle'} style={{
              padding: 30, bottom: 0,
              right: 10, marginLeft: 1
            }} >
              <TouchableOpacity ref={addRef} style={globalStyles.addButton} onPress={adicionarNovaTurma}>
                <AntDesign name="plus" size={24} color="#ecf0f1" />
              </TouchableOpacity>
            </TourGuideZone>
          </View>
        </>
      )}

    </View>
  );
};

export default ConsultarTurmas;
