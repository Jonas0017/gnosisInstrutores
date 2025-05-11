import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { firestore } from "../firebaseConfig"; // Certifique-se de ajustar o caminho
import { AntDesign, MaterialIcons } from "@expo/vector-icons"; // Ícone para o botão "+"
import { globalStyles } from "../styles/globalStyles"; // Importando o CSS
import { recuperarDadosDemograficos } from "../utils/dadosDemograficos"; // Importando a função reutilizável
import Loading from "../components/Loading"; // Importando o componente Loading


// Definir o tipo dos dados da turma
interface Turma {
  id: string;
  local: string;
  dias: string;
  horario: string;
  responsavel: string;
  tema: string;
  obs: string;
}

const ConsultarTurmas = () => {
  const router = useRouter();
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [Pais, setPais] = useState(null); // Estado para armazenar o valor de Pais
  const [CPF, setCpf] = useState(""); // Recupando dados parao carregamento do perfil
  const [loading, setLoading] = useState(false); // Estado para mostrar o loading


  // Função para buscar turmas do Firestore
  useEffect(() => {
    const fetchTurmas = async () => {
      try {
        setLoading(true); // Ativa o loading
        const { pais, estado, lumisial } = await recuperarDadosDemograficos();
        // Montar o caminho no Firestore
        setPais(pais); // Atualiza o estado do País
        const caminhoFirestore = `paises/${pais}/estados/${estado}/lumisial/${lumisial}`;

        // Buscar turmas do Firestore
        const turmasRef = collection(firestore, `${caminhoFirestore}/turmas`);
        const querySnapshot = await getDocs(turmasRef);
        const turmasData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Turma[];

        setTurmas(turmasData);
      } catch (error) {
        console.error("Erro ao buscar turmas:", error);
        //Alert.alert("Erro", "Não foi possível buscar as turmas.");
      } finally {
        setLoading(false);
      }
    };
    fetchTurmas();
  }, []);

  // Função para lidar com a remoção de uma turma
  const removerTurma = async (id: string) => {
    try {
      setLoading(true); // Ativa o loading
      const { pais, estado, lumisial } = await recuperarDadosDemograficos();
      // Montar o caminho no Firestore
      const caminhoFirestore = `paises/${pais}/estados/${estado}/lumisial/${lumisial}`;

      await deleteDoc(doc(firestore, `${caminhoFirestore}/turmas`, id));
      Alert.alert("Sucesso", "Turma removida com sucesso!");
      setTurmas((prev) => prev.filter((turma) => turma.id !== id));
    } catch (error) {
      console.error("Erro ao remover turma: ", error);
      //Alert.alert("Erro", "Não foi possível remover a turma.");
    } finally {
      setLoading(false); // Desativa o loading
    }
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
                localParam: item.local,
                diasParam: item.dias,
                horarioParam: item.horario,
                responsavelParam: item.responsavel,
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

  // Função para navegar para a tela de controle de presença
  const abrirTurma = (item: Turma) => {
    if (!item.id) {
      console.error("Erro", "O ID da turma está vazio. Por favor, insira uma nova turma.");
      return;
    }

    router.push({
      pathname: "/ControleDePresenca",
      params: {
        turmaId: item.id, // Passa o ID da turma como parâmetro
      },
    });
  };

  // Função para adicionar nova turma
  const adicionarNovaTurma = () => {
    router.push("/InserirTurma");
  };

  const fetchTurmas = async () => {
    useEffect(() => {
      const fetchTurmas = async () => {
        try {
          setLoading(true); // Ativa o loading
          const { pais, estado, lumisial } = await recuperarDadosDemograficos();
          // Montar o caminho no Firestore
          const caminhoFirestore = `paises/${pais}/estados/${estado}/lumisial/${lumisial}`;

          // Buscar turmas do Firestore
          const turmasRef = collection(firestore, `${caminhoFirestore}/turmas`);
          const querySnapshot = await getDocs(turmasRef);
          const turmasData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Turma[];

          setTurmas(turmasData);
        } catch (error) {
          console.error("Erro ao buscar turmas:", error);
          //Alert.alert("Erro", "Não foi possível buscar as turmas.");
        } finally {
          setLoading(false);
        }
      };
      fetchTurmas();
    }, []);
  };


  return (
    <View style={globalStyles.containerTurma}>
      {/* Exibe o componente de loading quando necessário */}
      {loading && <Loading />}

      {!loading && (
        <>
          <View style={globalStyles.headerContainer}>
            <Text style={globalStyles.titleTurma}>GNOSIS {Pais}</Text>
            <TouchableOpacity
              onPress={() => router.push({
                pathname: "/PerfilUsuario",
                params: {
                  cpf: CPF
                },
              })
              }>
              <MaterialIcons name="settings" size={28} style={globalStyles.iconSettings} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={turmas}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={globalStyles.itemTurmas}
                onPress={() => abrirTurma(item)}
                onLongPress={() => exibirOpcoes(item)}
              >
                <Text style={globalStyles.text}>Local: {item.local}</Text>
                <Text style={globalStyles.text}>Dias da semana: {item.dias}</Text>
                <Text style={globalStyles.text}>Horário: {item.horario || ""}</Text>
                <Text style={globalStyles.text}>Responsável: {item.responsavel || ""}</Text>
                <Text style={globalStyles.text}>Tema de abertura: {item.tema || ""}</Text>
                <Text style={globalStyles.text}>Observações: {item.obs || ""}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={globalStyles.empty}>Nenhuma turma encontrada. Clique no "+" para adicionar.</Text>
            }
            refreshing={loading} // Estado de carregamento para indicar quando está atualizando
            onRefresh={() => fetchTurmas()} // Função de atualização para recarregar os dados
          />

          {/* Botão de adicionar nova turma */}
          <TouchableOpacity style={globalStyles.addButton} onPress={adicionarNovaTurma}>
            <AntDesign name="plus" size={24} color="#ecf0f1" />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

/*
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  item: {
    marginBottom: 10,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 3,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  empty: {
    fontSize: 18,
    textAlign: "center",
    color: "gray",
    marginTop: 20,
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

export default ConsultarTurmas;
