import React, { useState, useEffect, useRef } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { firestore } from "../firebaseConfig.js";
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
  const [tutorialEtapa, setTutorialEtapa] = useState(1); // Estado para controlar a etapa
  //const { start, eventEmitter, canStart, stop } = useTourGuideController();

  const {
    start: startGeral,
    stop: stopGeral,
    canStart: canStartGeral,
    eventEmitter: emitterGeral,
    TourGuideZone: GeralZone,
  } = useTourGuideController("Geral");

  const {
    start: startInstrutor,
    stop: stopInstrutor,
    canStart: canStartInstrutor,
    eventEmitter: emitterInstrutor,
    TourGuideZone: InstrutorZone,
  } = useTourGuideController("Instrutor");
  //console.log("🧪 useTourGuideController('Instrutor') -> canStart:", canStartInstrutor);

  const {
    start: startAno,
    stop: stopAno,
    canStart: canStartAno,
    eventEmitter: emitterAno,
    TourGuideZone: AnoZone,
  } = useTourGuideController("Ano");

  const {
    start: startTurma,
    stop: stopTurma,
    canStart: canStartTurma,
    eventEmitter: emitterTurma,
    TourGuideZone: TurmaZone,
  } = useTourGuideController("Turma");

  const {
    start: startPerfil,
    stop: stopPerfil,
    canStart: canStartPerfil,
    eventEmitter: emitterPerfil,
    TourGuideZone: PerfilZone,
  } = useTourGuideController("Perfil");

  const handleOnStart = () => console.log('start')
  const handleOnStop = () => console.log('stop')
  const handleOnStepChange = () => console.log(`stepChange`)

  React.useEffect(() => {
  const emissores = [
    emitterGeral,
    emitterInstrutor,
    emitterAno,
    emitterTurma,
    emitterPerfil,
  ];

  for (const emitter of emissores) {
    if (!emitter) continue;

    emitter.on('start', handleOnStart);
    emitter.on('stop', handleOnStop);
    emitter.on('stepChange', handleOnStepChange);
  }

  return () => {
    for (const emitter of emissores) {
      if (!emitter) continue;

      emitter.off('start', handleOnStart);
      emitter.off('stop', handleOnStop);
      emitter.off('stepChange', handleOnStepChange);
    }
  };
}, [
  emitterGeral,
  emitterInstrutor,
  emitterAno,
  emitterTurma,
  emitterPerfil,
]);


  const homeRef = useRef(null);
  const configRef = useRef(null);
  const listaRef = useRef(null);
  const addRef = useRef(null);

  //AsyncStorage.removeItem("tutorialCompleted");
  //AsyncStorage.setItem("tutorialCompleted", "false");

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

  /////////////////////////////////////////////////////////////////////////////////////
  //////////////////// Iniciando tutorial     /////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////

  ///////////  Geral Inicia automaticamente quando abre o app

  const [tutorialEtapaGeral, setTutorialEtapaGeral] = useState(1)

  const checkIfGeralTutorialSeen = async () => {
    try {
      stopGeral()

      const concluido = await AsyncStorage.getItem("tutorialGeralCompleted");
      const etapa = parseInt(await AsyncStorage.getItem("tutorialGeralEtapa") ?? "1", 10);
      setTutorialEtapaGeral(etapa);

      const etapaValida = etapa >= 1 && etapa <= 4;

      if (concluido !== "true" && etapaValida) {
        const esperaCanStart = setInterval(() => {
          if (canStartGeral) {
            clearInterval(esperaCanStart);
            console.log("✅ Tutorial GERAL pronto para iniciar, etapa:", etapa);
            startGeral();
            setTimeout(() => startGeral(etapa), 100);
          } else {
            //console.log("⏳ Aguardando canStartGeral ficar true...");
          }
        }, 300);
      } else {
        console.log(
          concluido === "true"
            ? "Tutorial GERAL já foi concluído."
            : `⛔ Etapa ${etapa} inválida ou não iniciada.`
        );
      }
    } catch (error) {
      console.error("❌ Erro ao verificar tutorial GERAL:", error)
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      checkIfGeralTutorialSeen();
    }, 200); // Ajuste conforme necessário

    return () => clearTimeout(timeout);
  }, []);


  // 🔹 Reinicia o tutorial ao selecionar um instrutor, mas continua na parte correta
  const handleInstrutorSelecionado = async (instrutor: string) => {
    stopInstrutor();
    setInstrutorSelecionado(instrutor);
    console.log("👨‍🏫 Instrutor selecionado:", instrutor);

    const novaEtapa = 1;
    await AsyncStorage.setItem("tutorialInstrutorEtapa", novaEtapa.toString());
    await AsyncStorage.setItem("tutorialInstrutorCompleted", "false");
    setTutorialEtapa(novaEtapa);

    // Aguarda o próximo render para garantir que o zone foi montado
    setTimeout(() => {
      let tentativas = 0;

      const tentarStart = () => {
        if (canStartInstrutor) {
          console.log("✅ canStartInstrutor = true, iniciando");
          startInstrutor();
          setTimeout(() => startInstrutor(novaEtapa), 100);
        } else if (tentativas < 10) {
          console.log("⏳ Aguardando canStartInstrutor...");
          tentativas++;
          setTimeout(tentarStart, 300);
        } else {
          console.warn("❌ Timeout: canStartInstrutor ainda false.");
        }
      };

      tentarStart();
    }, 300); // aguarda a renderização com instrutorSelecionado atualizado
  };


  const handleAnoSelecionado = async (ano: string) => {
    stopAno(); // Garante que o tutorial "Ano" está limpo

    setAnoSelecionado(ano);
    console.log("📅 Ano selecionado:", ano);

    const novaEtapa = 1; // ou 6, conforme seu fluxo geral
    await AsyncStorage.setItem("tutorialAnoEtapa", novaEtapa.toString());
    await AsyncStorage.setItem("tutorialAnoCompleted", "false");
    setTutorialEtapa(novaEtapa);
    setTimeout(() => {
      startAno();
    }, 200);
    if (canStartAno) {
      console.log("✅ Iniciando tutorial ANO na etapa:", novaEtapa);
      setTimeout(() => startAno(novaEtapa), 100);
    } else {
      console.warn("⚠️ Tutorial ANO não pôde ser iniciado: canStart = false");
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
  const resetarTutorial = async () => {
    console.log("🔄 [RESET] Iniciando reset completo de TODOS os tutoriais...");

    try {
      // 🔸 Parar todos os tutoriais
      stopGeral();
      stopInstrutor();
      stopAno();
      stopPerfil();
      stopTurma();

      // 🔸 Limpar estados visuais
      setInstrutorSelecionado(null);
      setAnoSelecionado(null);

      const novaEtapa = 1;

      // 🔸 Lista de chaves a remover/resetar
      const chaves = [
        "tutorialCompleted",
        "tutorialEtapa",
        "tutorialGeralCompleted",
        "tutorialGeralEtapa",
        "tutorialInstrutorCompleted",
        "tutorialInstrutorEtapa",
        "tutorialAnoCompleted",
        "tutorialAnoEtapa",
        "tutorialPerfilCompleted",
        "tutorialPerfilEtapa",
        "tutorialTurmaCompleted",
        "tutorialTurmaEtapa",
      ];

      // 🔸 Remove cada chave
      await Promise.all(chaves.map((chave) => AsyncStorage.removeItem(chave)));

      // 🔸 Atualiza estado local principal
      setTutorialEtapa(novaEtapa);

      setTimeout(() => {
        startGeral();
      }, 200);

      // 🔸 Inicia tutorial geral como padrão após reset (opcional)
      if (canStartGeral) {
        console.log("🚀 [RESET] Iniciando tutorial GERAL na etapa:", novaEtapa);

        setTimeout(() => startGeral(1), 100);
      } else {
        console.warn("⚠️ [RESET] Tutorial GERAL não pôde ser iniciado: canStartGeral = false");
      }

    } catch (err) {
      console.error("❌ [RESET] Erro durante reset completo dos tutoriais:", err);
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

            <GeralZone zone={1} text="Aqui você volta para a tela inicial, onde poderá selecionar o Instrutor resposável pela turma!" shape={'circle'}
              style={{}}>
              <TouchableOpacity
                onLayout={() => {
                  console.log("✅ zone 1 montado");
                  startGeral(1);
                }}
                ref={homeRef} onPress={() => router.push("/ConsultarTurmas")} style={{ padding: 0, marginBottom: 32, }}>
                <MaterialIcons name="home" size={28} style={globalStyles.iconHome} />
              </TouchableOpacity>
            </GeralZone>
            <Text style={globalStyles.titleTurma}>GNOSIS {Pais}</Text>
            <GeralZone zone={2} text="Nessa engrenagem você pode visualizar e editar seus dados pessoais e demográficos." shape={'circle'} style={{}}>
              <TouchableOpacity
                ref={configRef}
                onPress={async () => {

                  const novaEtapa = 1;

                  await AsyncStorage.setItem("tutorialPerfilEtapa", novaEtapa.toString());
                  await AsyncStorage.setItem("tutorialPerfilCompleted", "false");
                  setTutorialEtapa(novaEtapa);

                  console.log("⚙️ Navegando para PerfilUsuario com etapa:", novaEtapa);

                  router.push({
                    pathname: "/PerfilUsuario",
                    params: { cpf: CPF },
                  });
                }}
              >

                <MaterialIcons name="settings" size={28} style={globalStyles.iconSettings} />
              </TouchableOpacity>
            </GeralZone>
          </View>

          {/* Lista de instrutores */}
          {!instrutorSelecionado && (
            <GeralZone zone={3} text="As turmas estão organizadas por instrutor." borderRadius={10} style={{ marginTop: 20, padding: 10, paddingTop: 0, paddingBottom: 60, }}>
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
            </GeralZone>

          )}

          {/* Lista de anos */}
          {instrutorSelecionado && !anoSelecionado && (

            <InstrutorZone zone={1} text="Selecionando o ano poderá visualizar as turmas." borderRadius={10} style={{ marginTop: 20, padding: 10, paddingTop: 0, paddingBottom: 60, }}>
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
            </InstrutorZone>
          )}

          {/* Lista de turmas */}
          {anoSelecionado && (
            <AnoZone zone={1} text={"Finalmente podemos visualizar a turma selecionada! ❤️\n\nUm toque simples sobre a turma te permite visualizar os alunos.\n\nUm toque longo sobre a turma te permite alterar ou remover a turma selecionada."}

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
            </AnoZone>

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
            <GeralZone zone={4} text="Você pode adicionar uma nova turma pressionando o botão mais." shape={'circle'} style={{
              padding: 30, bottom: 0,
              right: 10, marginLeft: 1
            }} >
              <TouchableOpacity ref={addRef} style={globalStyles.addButton} onPress={adicionarNovaTurma}>
                <AntDesign name="plus" size={24} color="#ecf0f1" />
              </TouchableOpacity>
            </GeralZone>
          </View>
        </>
      )}
      <TouchableOpacity onPress={resetarTutorial} style={{ padding: 10, backgroundColor: '#ccc', margin: 10 }}>
        <Text>Reiniciar Tutorial</Text>
      </TouchableOpacity>

    </View>
  );
};

export default ConsultarTurmas;
