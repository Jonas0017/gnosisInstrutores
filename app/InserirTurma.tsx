import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getDoc, getDocs, setDoc, collection, doc, updateDoc } from "firebase/firestore";
import { firestore } from "../firebaseConfig";
import { globalStyles } from "../styles/globalStyles"; // Importando o CSS
import { recuperarDadosDemograficos } from "../utils/dadosDemograficos"; // Importando a função reutilizável
import Loading from "../components/Loading"; // Importando o componente Loading
import { MaterialIcons } from "@expo/vector-icons";
import { ScrollView } from "react-native";

var novoId = "T001"; // ID inicial padrão

const InserirOuEditarTurma = () => {
  const {
    id,
    responsavelParam,
    dataAberturaParam,
    localParam,
    diasParam,
    horarioParam,
    temaParam,
    obsParam,
  } = useLocalSearchParams();

  const router = useRouter();

  // Verifica se é edição (se o ID existir)
  const isEditing = !!id;

  // Inicializa estados garantindo que os valores sejam strings
  const [responsavel, setResponsavel] = useState(responsavelParam ? String(responsavelParam) : "");


  const [local, setLocal] = useState(localParam ? String(localParam) : "");
  const [dias, setDias] = useState(diasParam ? String(diasParam) : "");
  const [horario, setHorario] = useState(horarioParam ? String(horarioParam) : "");
  const [tema, setTema] = useState(temaParam ? String(temaParam) : "");
  const [obs, setObs] = useState(obsParam ? String(obsParam) : "");
  const [loading, setLoading] = useState(false); // Estado para mostrar o loading

  const formatarDataParaBR = (dataISO: string) => {
    const [ano, mes, dia] = dataISO.split("-");
    return `${dia}-${mes}-${ano}`; // Retorna no formato DD-MM-YYYY
  };

  const formatarDataParaISO = (dataBR: string) => {
    const [dia, mes, ano] = dataBR.split("-");
    return `${ano}-${mes}-${dia}`; // Retorna no formato YYYY-MM-DD
  };

  const [dataAbertura, setDataAbertura] = useState(
    dataAberturaParam ? String(dataAberturaParam) : formatarDataParaBR(new Date().toISOString().split("T")[0])
  );


  const salvarTurma = async () => {
    if (!responsavel.trim() || !dataAbertura.trim() || !local.trim() || !dias.trim() || !horario.trim()) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios!");
      return;
    }
    try {
      setLoading(true); // Ativa o loading
      const { pais, estado, lumisial } = await recuperarDadosDemograficos();
      // Montar o caminho no Firestore
      const caminhoFirestore = `paises/${pais}/estados/${estado}/lumisial/${lumisial}`;

      if (isEditing) {
        // Atualizar turma
        const turmaDoc = doc(
          firestore,
          `${caminhoFirestore}/turmas`,
          id as string
        );
        await updateDoc(turmaDoc, {
          responsavel,
          dataAbertura: formatarDataParaISO(dataAbertura), // Convertendo para ISO antes de salvar
          local,
          dias,
          horario,
          tema,
          obs,
        });
        //Alert.alert("Sucesso", "Turma alterada com sucesso!");
      } else {
        // Verificar última turma e calcular próximo ID
        const turmasCollection = collection(
          firestore,
          `${caminhoFirestore}/turmas`
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
          responsavel,
          dataAbertura: formatarDataParaISO(dataAbertura), // Convertendo para ISO antes de salvar
          local,
          dias,
          horario,
          tema,
          obs,
        });
        //Alert.alert("Sucesso", `Turma ${novoId} adicionada com sucesso!`);
        // chama a funcao que adiciona o restante da estrutura
        addPalestras();
      }
      router.push("/ConsultarTurmas");
    } catch (error) {
      console.error("Erro ao salvar turma:", error);
      //Alert.alert("Erro", "Não foi possível salvar a turma.");
    } finally {
      setLoading(false); // Desativa o loading
    }
  };

  const addPalestras = async () => {

    const palestras = [
      "01", "02", "03", "04", "05", "06", "07", "08", "09", "10",
      "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
      "21", "22", "23"
    ];

    try {
      setLoading(true); // Ativa o loading
      const { pais, estado, lumisial } = await recuperarDadosDemograficos();
      // Montar o caminho no Firestore
      const caminhoFirestore = `paises/${pais}/estados/${estado}/lumisial/${lumisial}`;

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
          doc(firestore, `${caminhoFirestore}/turmas/${novoId}/palestras`, palestraId),
          {
            ...palestraData, // Reutiliza os dados da palestra
            instrutor: "", // Campo para instrutor será preenchido posteriormente
            data: "", // Campo para data será preenchido posteriormente
          }
        );
        console.log(`caminho que está salvando ${caminhoFirestore}/turmas/${novoId}/palestras`);
        console.log(`Palestra '${palestraId}' adicionada na turma '${novoId}' com campos para instrutor e data.`);
      }
      console.log("Todas as palestras foram adicionadas!");
    } catch (error) {
      console.error("Erro ao criar palestras dentro da turma:", error);
    } finally {
      setLoading(false); // Desativa o loading
    }
  };

  return (
    <View style={globalStyles.container}>

      {/* Exibe o componente de loading quando necessário */}
      {loading && <Loading />}

      {!loading && (
        <>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 20 }}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header com botão de voltar e título da página */}
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5, marginLeft: 5 }}>
              <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 7, marginRight: 15 }}>
                <MaterialIcons name="arrow-back" size={28} color="#3498db" />
              </TouchableOpacity>
              <Text style={globalStyles.title}>{isEditing ? "Editar Turma" : "Inserir Turma"}</Text>
            </View>
            <TextInput
              style={globalStyles.input}
              placeholder="Responsável pela Turma:*"
              value={responsavel}
              onChangeText={(text) => setResponsavel(String(text))}
            />
            {/* Campo para data de abertura */}
            <TextInput
              style={globalStyles.input}
              placeholder="Data de Abertura (DD-MM-YYYY)*"
              value={dataAbertura}
              onChangeText={(text) => setDataAbertura(text)}
            />
            <TextInput
              style={globalStyles.input}
              placeholder="Local da turma:*"
              value={local}
              onChangeText={(text) => setLocal(String(text))}
            />
            <TextInput
              style={globalStyles.input}
              placeholder="Dias da semana: (Ex.: Terça e Quinta)*"
              value={dias}
              onChangeText={(text) => setDias(String(text))}
            />
            <TextInput
              style={globalStyles.input}
              placeholder="Horário:*"
              value={horario}
              onChangeText={(text) => setHorario(String(text))}
            />
            <TextInput
              style={globalStyles.input}
              placeholder="Tema de Abertura/Curso:"
              value={tema}
              onChangeText={(text) => setTema(String(text))}
            />
            <TextInput
              style={globalStyles.input}
              placeholder="Observações:"
              value={obs}
              onChangeText={(text) => setObs(String(text))}
            />
            <Text>Os campos com "*" são obrigatórios.</Text>
            <TouchableOpacity style={globalStyles.button} onPress={salvarTurma}>
              <Text style={globalStyles.buttonText}>
                {isEditing ? "Salvar Alterações" : "Adicionar Turma"}
              </Text>
            </TouchableOpacity>
          </ScrollView>
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
*/

export default InserirOuEditarTurma;
