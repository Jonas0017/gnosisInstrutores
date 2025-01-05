import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getDoc, getDocs, setDoc, collection, doc, updateDoc } from "firebase/firestore";
import { firestore } from "../firebaseConfig";

var novoId = "T001"; // ID inicial padrão
const InserirOuEditarTurma = () => {

  const paisId = "Brasil";
  const estadoId = "Rio de Janeiro";
  const cidadeId = "Rio de Janeiro";
  
  const {
    id,
    localParam,
    diasParam,
    horarioParam,
    responsavelParam,
    temaParam,
    obsParam,
  } = useLocalSearchParams();

  const router = useRouter();

  // Verifica se é edição (se o ID existir)
  const isEditing = !!id;

  // Inicializa estados garantindo que os valores sejam strings
  const [local, setLocal] = useState(localParam ? String(localParam) : "");
  const [dias, setDias] = useState(diasParam ? String(diasParam) : "");
  const [horario, setHorario] = useState(horarioParam ? String(horarioParam) : "");
  const [responsavel, setResponsavel] = useState(responsavelParam ? String(responsavelParam) : "");
  const [tema, setTema] = useState(temaParam ? String(temaParam) : "");
  const [obs, setObs] = useState(obsParam ? String(obsParam) : "");

  const salvarTurma = async () => {
    try {
      if (isEditing) {
        // Atualizar turma
        const turmaDoc = doc(
          firestore,
          `paises/${paisId}/estados/${estadoId}/cidades/${cidadeId}/turmas`,
          id as string
        );
        await updateDoc(turmaDoc, {
          local,
          dias: dias.split(",").map((dia) => dia.trim()), // Converte string para array
          horario,
          responsavel,
          tema,
          obs,
        });
        Alert.alert("Sucesso", "Turma alterada com sucesso!");
      } else {
        // Verificar última turma e calcular próximo ID
        const turmasCollection = collection(
          firestore,
          `paises/${paisId}/estados/${estadoId}/cidades/${cidadeId}/turmas`
        );
        const querySnapshot = await getDocs(turmasCollection);

        if (!querySnapshot.empty) {
          // Obter IDs existentes e calcular próximo
          const ids = querySnapshot.docs.map((doc) => doc.id);
          const ultimoId = ids.sort().pop(); // Obter o último ID
          if (ultimoId) {
            const numero = parseInt(ultimoId.replace("T", ""), 10) + 1;
            novoId = `T${String(numero).padStart(3, "0")}`; // Formatar com 3 dígitos
          }
        }
  
        // Inserir nova turma com ID calculado
        const novaTurmaRef = doc(turmasCollection, novoId);
        await setDoc(novaTurmaRef, {
          local,
          dias: dias.split(",").map((dia) => dia.trim()), // Converte string para array
          horario,
          responsavel,
          tema,
          obs,
        });
        Alert.alert("Sucesso", `Turma ${novoId} adicionada com sucesso!`);
        // chama a funcao que adiciona o restante da estrutura
        addPalestras();
      }
      router.push("/ConsultarTurmas");
    } catch (error) {
      console.error("Erro ao salvar turma:", error);
      Alert.alert("Erro", "Não foi possível salvar a turma.");
    }
  };  

const addPalestras = async () => {
  
  const palestras = [
    "01", "02", "03", "04", "05", "06", "07", "08", "09", "10",
    "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
    "21", "22", "23"
    ];

  try {

    // Lista de IDs das palestras
    for (const palestraId of palestras) {
    // Recuperar os dados da palestra selecionada
    const palestraRef = doc(firestore, `palestras`, palestraId);
    const palestraSnap = await getDoc(palestraRef);

    if (!palestraSnap.exists()) {
        console.error(`Palestra com ID '${palestraId}' não encontrada.`);
        continue; // Pula para a próxima palestra
    }

    const palestraData = palestraSnap.data();

    // Criar palestra dentro da turma
    await setDoc(
        //    const turmaPath = `paises/${paisId}/estados/${estadoId}/cidades/${cidadeId}/turmas`;
                 doc(firestore, `paises/${paisId}/estados/${estadoId}/cidades/${cidadeId}/turmas/${novoId}/palestras`, palestraId),
        {
        ...palestraData, // Reutiliza os dados da palestra
        instrutor: "", // Campo para instrutor será preenchido posteriormente
        data: "", // Campo para data será preenchido posteriormente
        }
    );
    console.log(`Palestra '${palestraId}' adicionada na turma '${novoId}' com campos para instrutor e data.`);
    }
      console.log("Todas as palestras foram adicionadas!");
  } catch (error) {
      console.error("Erro ao criar palestras dentro da turma:", error);
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isEditing ? "Editar Turma" : "Inserir Turma"}</Text>

      <TextInput
        style={styles.input}
        placeholder="Local da turma:"
        value={local}
        onChangeText={(text) => setLocal(String(text))}
      />
      <TextInput
        style={styles.input}
        placeholder="Dias da semana: (Ex.: Terça e Quinta)"
        value={dias}
        onChangeText={(text) => setDias(String(text))}
      />
      <TextInput
        style={styles.input}
        placeholder="Horário:"
        value={horario}
        onChangeText={(text) => setHorario(String(text))}
      />
      <TextInput
        style={styles.input}
        placeholder="Responsável pela Turma:"
        value={responsavel}
        onChangeText={(text) => setResponsavel(String(text))}
      />
      <TextInput
        style={styles.input}
        placeholder="Tema de Abertura/Curso:"
        value={tema}
        onChangeText={(text) => setTema(String(text))}
      />
      <TextInput
        style={styles.input}
        placeholder="Observações:"
        value={obs}
        onChangeText={(text) => setObs(String(text))}
      />

      <TouchableOpacity style={styles.button} onPress={salvarTurma}>
        <Text style={styles.buttonText}>
          {isEditing ? "Salvar Alterações" : "Adicionar Turma"}
        </Text>
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
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#E8EBC2",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#222",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default InserirOuEditarTurma;
