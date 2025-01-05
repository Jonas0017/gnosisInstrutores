import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { firestore } from "../firebaseConfig";
import { collection, getDocs, doc, setDoc, getDoc } from "firebase/firestore";

const InserirAluno = ({ route }: any) => {
  const paisId = "Brasil";
  const estadoId = "Rio de Janeiro";
  const cidadeId = "Rio de Janeiro";

  const router = useRouter();
  const { turmaId, palestraId } = useLocalSearchParams() || {};
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [status, setStatus] = useState<"presente" | "ausente">("presente");

  const handleAddAluno = async () => {
    if (!turmaId || !palestraId) {
      Alert.alert(
        "Erro",
        "IDs de turma e palestra são obrigatórios. Verifique as informações."
      );
      return;
    }

    if (!nome.trim() || !whatsapp.trim()) {
      Alert.alert("Erro", "Preencha todos os campos antes de continuar.");
      return;
    }

    try {
      const alunosCollection = collection(
        firestore,
        `paises/${paisId}/estados/${estadoId}/cidades/${cidadeId}/turmas/${turmaId}/alunos`
      );

      // Verificar último aluno e calcular próximo ID
      const querySnapshot = await getDocs(alunosCollection);
      let novoId = "A001"; // ID inicial padrão
      if (!querySnapshot.empty) {
        const ids = querySnapshot.docs.map((doc) => doc.id);
        const ultimoId = ids.sort().pop();
        if (ultimoId) {
          const numero = parseInt(ultimoId.replace("A", ""), 10) + 1;
          novoId = `A${String(numero).padStart(3, "0")}`;
        }
      }

      // Inserir novo aluno
      const novoAlunoRef = doc(alunosCollection, novoId);
      await setDoc(novoAlunoRef, { nome, whatsapp });

      // Atualizar presença em todas as palestras da turma
      await adicionarPresencaParaAluno(novoId);

      Alert.alert("Sucesso", `Aluno ${novoId} inserido com sucesso!`);
      setNome("");
      setWhatsapp("");
    } catch (error) {
      console.error("Erro ao inserir aluno:", error);
      Alert.alert("Erro", "Não foi possível inserir o aluno.");
    }
  };

  // Função para adicionar presença em todas as palestras da turma
  const adicionarPresencaParaAluno = async (alunoId: string) => {
    try {
      const palestrasCollection = collection(
        firestore,
        `paises/${paisId}/estados/${estadoId}/cidades/${cidadeId}/turmas/${turmaId}/palestras`
      );

      const palestrasSnapshot = await getDocs(palestrasCollection);
      if (!palestrasSnapshot.empty) {
        for (const palestraDoc of palestrasSnapshot.docs) {
          const palestraId = palestraDoc.id;
          const presencaRef = doc(
            firestore,
            `paises/${paisId}/estados/${estadoId}/cidades/${cidadeId}/turmas/${turmaId}/palestras/${palestraId}/presenca/${alunoId}`
          );
          await setDoc(presencaRef, { alunoId, status: "ausente" });
        }
        console.log(`Presenças adicionadas para o aluno '${alunoId}' em todas as palestras.`);
      }
    } catch (error) {
      console.error("Erro ao adicionar presenças:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inserir Aluno</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome do Aluno"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="WhatsApp do Aluno"
        value={whatsapp}
        onChangeText={setWhatsapp}
        keyboardType="phone-pad"
      />
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[
            styles.statusButton,
            status === "presente" && styles.activeButton,
          ]}
          onPress={() => setStatus("presente")}
        >
          <Text style={styles.buttonText}>Presente</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.statusButton,
            status === "ausente" && styles.activeButton,
          ]}
          onPress={() => setStatus("ausente")}
        >
          <Text style={styles.buttonText}>Ausente</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.submitButton} onPress={handleAddAluno}>
        <Text style={styles.submitButtonText}>Inserir Aluno</Text>
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
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  statusButton: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#f5f5f5",
    flex: 1,
    alignItems: "center",
    marginHorizontal: 5,
  },
  activeButton: {
    backgroundColor: "#4caf50",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  submitButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default InserirAluno;
