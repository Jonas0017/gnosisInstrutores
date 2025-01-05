import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { collection, doc, getDocs, getDoc, updateDoc } from "firebase/firestore";
import { firestore } from "../firebaseConfig";
import { GestureHandlerRootView, PanGestureHandler, State } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";

interface Aluno {
  id: string;
  nome: string;
  status: "presente" | "ausente";
}

interface Palestra {
  id: string;
  titulo: string;
}

const ControleDePresenca = () => {
  const router = useRouter();
  const { turmaId } = useLocalSearchParams();

  const [palestraAtual, setPalestraAtual] = useState<number>(1); // Palestra inicial
  const [turma, setTurma] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(true);

  const [palestras, setPalestras] = useState<Palestra[]>([]);

  const paisId = "Brasil";
  const estadoId = "Rio de Janeiro";
  const cidadeId = "Rio de Janeiro";

  const caminhoTurma = `paises/${paisId}/estados/${estadoId}/cidades/${cidadeId}/turmas`;

  // Função para buscar palestras dinamicamente
  const fetchPalestras = async () => {
    try {
      setLoading(true);
      const palestrasCollection = collection(
        firestore,
        `${caminhoTurma}/${turmaId}/palestras`
      );
  
      const querySnapshot = await getDocs(palestrasCollection);
  
      const palestrasData = querySnapshot.docs.map((docSnapshot) => ({
        id: docSnapshot.id,
        titulo: docSnapshot.data()?.nome?.pt || `Palestra ${docSnapshot.id}`, // Ajuste para exibir apenas o título em português
      }));
  
      //console.log("Palestras carregadas:", palestrasData);
      setPalestras(palestrasData);
    } catch (error) {
      console.error("Erro ao buscar palestras:", error);
      Alert.alert("Erro", "Não foi possível carregar as palestras.");
    } finally {
      setLoading(false);
    }
  };
  
  

  const fetchPresenca = async (palestraId: string) => {
    try {
      setLoading(true);

      const presencaCollection = collection(
        firestore,
        `${caminhoTurma}/${turmaId}/palestras/${palestraId}/presenca`
      );

      const querySnapshot = await getDocs(presencaCollection);

      const alunosDataPromises = querySnapshot.docs.map(async (docSnapshot) => {
        const alunoData = docSnapshot.data();
        const alunoId = alunoData.alunoId;

        const alunoDoc = await getDoc(doc(firestore, `${caminhoTurma}/${turmaId}/alunos/${alunoId}`));
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
          status: alunoData.status || "ausente",
        };
      });

      const alunosData = await Promise.all(alunosDataPromises);
      setTurma(alunosData);
    } catch (error) {
      console.error("Erro ao buscar dados de presença:", error);
      Alert.alert("Erro", "Não foi possível carregar os dados de presença.");
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
      if (event.nativeEvent.translationX < -50 && palestraAtual < palestras.length) {
        setPalestraAtual((prev) => prev + 1);
      } else if (event.nativeEvent.translationX > 50 && palestraAtual > 1) {
        setPalestraAtual((prev) => prev - 1);
      }
    }
  };

  const toggleStatus = async (id: string, currentStatus: "presente" | "ausente") => {
    try {
      const palestraId = palestras[palestraAtual - 1].id;
      const newStatus = currentStatus === "presente" ? "ausente" : "presente";

      const alunoDoc = doc(
        firestore,
        `${caminhoTurma}/${turmaId}/palestras/${palestraId}/presenca`,
        id
      );
      await updateDoc(alunoDoc, { status: newStatus });

      setTurma((prev) =>
        prev.map((aluno) => (aluno.id === id ? { ...aluno, status: newStatus } : aluno))
      );
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      Alert.alert("Erro", "Não foi possível atualizar o status.");
    }
  };

  const renderItem = ({ item }: { item: Aluno }) => (
    <View style={styles.item}>
      <Text style={styles.nome}>{item.nome}</Text>
      <TouchableOpacity
        style={[
          styles.botao,
          item.status === "presente" && styles.presente,
          item.status === "ausente" && styles.ausente,
        ]}
        onPress={() => toggleStatus(item.id, item.status)}
      >
        <Text style={styles.textoBotao}>
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const adicionarAluno = () => {
    console.log("estou aqui botão ok ");
 
    if (!turmaId || !palestras[palestraAtual - 1]?.id) {
      Alert.alert("Erro", "Turma ou Palestra não selecionada.");
      return;
    }
    let palestraId = palestras[palestraAtual - 1].id;
    console.log("botão ok ",turmaId, palestraId);
    router.push({
      pathname: "/InserirAluno",
      params: {
        turmaId, // Passa o ID da turma
        palestraId, // Passa o ID da palestra atual
      },
    });
  };
  

  return (
    <GestureHandlerRootView style={styles.container}>
      <PanGestureHandler onHandlerStateChange={handleSwipe}>
        <View>
          <Text style={styles.titulo}>
            {palestras.length > 0 && palestras[palestraAtual - 1]
              ? palestras[palestraAtual - 1].titulo
              : "Carregando..."}
          </Text>
          {loading ? (
            <Text style={styles.loading}>Carregando...</Text>
          ) : (
            <FlatList
              data={turma}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              ListEmptyComponent={
                <Text style={styles.empty}>
                  Nenhum Aluno encontrado. Clique no "+" para adicionar.
                </Text>
              }
            />
          )}
        </View>
      </PanGestureHandler>
      {/* Botão flutuante para adicionar aluno */}
      <TouchableOpacity style={styles.addButton} onPress={adicionarAluno}>
        <AntDesign name="plus" size={24} color="#fff" />
      </TouchableOpacity>
    </GestureHandlerRootView>
    
  );
};
  

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

export default ControleDePresenca;
