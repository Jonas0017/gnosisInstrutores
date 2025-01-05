import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { firestore } from "../firebaseConfig"; // Certifique-se de ajustar o caminho do seu firebaseConfig
import { AntDesign } from "@expo/vector-icons"; // Ícone para o botão "+"

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
  const [loading, setLoading] = useState(true);

  const paisId = "Brasil";
  const estadoId = "Rio de Janeiro";
  const cidadeId = "Rio de Janeiro";

  // Função para buscar turmas do Firestore
useEffect(() => {
    const fetchTurmas = async () => {
      try {
        setLoading(true);

        const turmasRef = collection(
          firestore,
          // /paises/Brasil/estados/Rio de Janeiro/cidades/Rio de Janeiro/turmas/T001/palestras/01/presenca/A001
          `paises/${paisId}/estados/${estadoId}/cidades/${cidadeId}/turmas`
        );
        
        const querySnapshot = await getDocs(turmasRef);
        
        const turmasData = querySnapshot.docs.map((doc) => ({
          id: doc.id, // ID do documento
          ...doc.data(), // Dados do documento
        })) as Turma[]; // Adicione o tipo aqui
        setTurmas(turmasData);
      } catch (error) {
        console.error("Erro ao buscar turmas: ", error);
      }
    };

    fetchTurmas();
  }, []);

  // Função para lidar com a remoção de uma turma
  const removerTurma = async (id: string) => {
    try {
      await deleteDoc(doc(firestore, `paises/${paisId}/estados/${estadoId}/cidades/${cidadeId}/turmas`, id));
      Alert.alert("Sucesso", "Turma removida com sucesso!");
      setTurmas((prev) => prev.filter((turma) => turma.id !== id));
    } catch (error) {
      console.error("Erro ao remover turma: ", error);
      Alert.alert("Erro", "Não foi possível remover a turma.");
    }
  };

  // Função para exibir o menu de opções
  const exibirOpcoes = (item: Turma) => {
    Alert.alert(
      "Opções da Turma",
      `O que você deseja fazer com a turma "${item.tema}"?`,
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
      Alert.alert("Erro", "O ID da turma está vazio. Por favor, insira uma nova turma.");
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Consultar Turmas</Text>

      <FlatList
        data={turmas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => abrirTurma(item)}
            onLongPress={() => exibirOpcoes(item)}
          >
            <Text style={styles.text}>Local: {item.local}</Text>
            <Text style={styles.text}>
              Dias: {Array.isArray(item.dias) ? item.dias.join(", ") : item.dias || ""}
            </Text>
            <Text style={styles.text}>Horário: {item.horario || ""}</Text>
            <Text style={styles.text}>Responsável: {item.responsavel || ""}</Text>
            <Text style={styles.text}>Tema: {item.tema || ""}</Text>
            <Text style={styles.text}>Observações: {item.obs || ""}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>Nenhuma turma encontrada. Clique no "+" para adicionar.</Text>
        }
      />

      {/* Botão de adicionar nova turma */}
      <TouchableOpacity style={styles.addButton} onPress={adicionarNovaTurma}>
        <AntDesign name="plus" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

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

export default ConsultarTurmas;
