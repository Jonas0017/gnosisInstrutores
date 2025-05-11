import React, { useState, useEffect } from "react";
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
import { globalStyles } from "../styles/globalStyles"; // Importando o CSS
import Loading from "../components/Loading"; // Importando o componente Loading
import { recuperarDadosDemograficos } from "../utils/dadosDemograficos"; // Importando a função reutilizável
import { MaterialIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";

const paisesComCodigo = [
  { nome: "Afeganistão", codigo: "Afeganistão (+93)", bandeira: "🇦🇫" },
  { nome: "África do Sul", codigo: "África do Sul (+27)", bandeira: "🇿🇦" },
  { nome: "Albânia", codigo: "Albânia (+355)", bandeira: "🇦🇱" },
  { nome: "Alemanha", codigo: "Alemanha (+49)", bandeira: "🇩🇪" },
  { nome: "Andorra", codigo: "Andorra (+376)", bandeira: "🇦🇩" },
  { nome: "Angola", codigo: "Angola (+244)", bandeira: "🇦🇴" },
  { nome: "Argentina", codigo: "Argentina (+54)", bandeira: "🇦🇷" },
  { nome: "Austrália", codigo: "Austrália (+61)", bandeira: "🇦🇺" },
  { nome: "Áustria", codigo: "Áustria (+43)", bandeira: "🇦🇹" },
  { nome: "Bélgica", codigo: "Bélgica (+32)", bandeira: "🇧🇪" },
  { nome: "Bolívia", codigo: "Bolívia (+591)", bandeira: "🇧🇴" },
  { nome: "Brasil", codigo: "Brasil (+55)", bandeira: "🇧🇷" },
  { nome: "Canadá", codigo: "Canadá (+1)", bandeira: "🇨🇦" },
  { nome: "Chile", codigo: "Chile (+56)", bandeira: "🇨🇱" },
  { nome: "China", codigo: "China (+86)", bandeira: "🇨🇳" },
  { nome: "Colômbia", codigo: "Colômbia (+57)", bandeira: "🇨🇴" },
  { nome: "Coreia do Sul", codigo: "Coreia do Sul (+82)", bandeira: "🇰🇷" },
  { nome: "Costa Rica", codigo: "Costa Rica (+506)", bandeira: "🇨🇷" },
  { nome: "Dinamarca", codigo: "Dinamarca (+45)", bandeira: "🇩🇰" },
  { nome: "Egito", codigo: "Egito (+20)", bandeira: "🇪🇬" },
  { nome: "Espanha", codigo: "Espanha (+34)", bandeira: "🇪🇸" },
  { nome: "Estados Unidos", codigo: "EUA (+1)", bandeira: "🇺🇸" },
  { nome: "França", codigo: "França (+33)", bandeira: "🇫🇷" },
  { nome: "Grécia", codigo: "Grécia (+30)", bandeira: "🇬🇷" },
  { nome: "Holanda", codigo: "Holanda (+31)", bandeira: "🇳🇱" },
  { nome: "Índia", codigo: "Índia (+91)", bandeira: "🇮🇳" },
  { nome: "Inglaterra", codigo: "Inglaterra (+44)", bandeira: "🇬🇧" },
  { nome: "Irlanda", codigo: "Irlanda (+353)", bandeira: "🇮🇪" },
  { nome: "Itália", codigo: "Itália (+39)", bandeira: "🇮🇹" },
  { nome: "Japão", codigo: "Japão (+81)", bandeira: "🇯🇵" },
  { nome: "México", codigo: "México (+52)", bandeira: "🇲🇽" },
  { nome: "Moçambique", codigo: "Moçambique (+258)", bandeira: "🇲🇿" },
  { nome: "Noruega", codigo: "Noruega (+47)", bandeira: "🇳🇴" },
  { nome: "Nova Zelândia", codigo: "Nova Zelândia (+64)", bandeira: "🇳🇿" },
  { nome: "Paraguai", codigo: "Paraguai (+595)", bandeira: "🇵🇾" },
  { nome: "Peru", codigo: "Peru (+51)", bandeira: "🇵🇪" },
  { nome: "Polônia", codigo: "Polônia (+48)", bandeira: "🇵🇱" },
  { nome: "Portugal", codigo: "Portugal (+351)", bandeira: "🇵🇹" },
  { nome: "Reino Unido", codigo: "Reino Unido (+44)", bandeira: "🇬🇧" },
  { nome: "Rússia", codigo: "Rússia (+7)", bandeira: "🇷🇺" },
  { nome: "Suécia", codigo: "Suécia (+46)", bandeira: "🇸🇪" },
  { nome: "Suíça", codigo: "Suíça (+41)", bandeira: "🇨🇭" },
  { nome: "Turquia", codigo: "Turquia (+90)", bandeira: "🇹🇷" },
  { nome: "Ucrânia", codigo: "Ucrânia (+380)", bandeira: "🇺🇦" },
  { nome: "Uruguai", codigo: "Uruguai (+598)", bandeira: "🇺🇾" },
  { nome: "Venezuela", codigo: "Venezuela (+58)", bandeira: "🇻🇪" },
];


const InserirAluno = () => {
  const router = useRouter();
  const { turmaId, palestraId, alunoId } = useLocalSearchParams();
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [loading, setLoading] = useState(false); // Estado para mostrar o loading
  const [codigoPais, setCodigoPais] = useState(""); // Código padrão Brasil
  //console.log (turmaId, palestraId, alunoId);


  // Função para carregar os dados do aluno do banco de dados
  const carregarDadosAluno = async () => {
    const { pais, estado, lumisial } = await recuperarDadosDemograficos();
    // Montar o caminho no Firestore
    const caminhoFirestore = `paises/${pais}/estados/${estado}/lumisial/${lumisial}`;
    if (turmaId == "" || alunoId == "") {
      console.error(
        "Erro",
        "IDs de turma e aluno são obrigatórios para carregar os dados."
      );
      return;
    }

    try {
      setLoading(true);

      // Construir o caminho no Firestore para buscar os dados do aluno
      const alunoRef = doc(
        firestore,
        `${caminhoFirestore}/turmas/${turmaId}/alunos/${alunoId}`
      );

      const alunoSnapshot = await getDoc(alunoRef);

      if (alunoSnapshot.exists()) {
        const alunoData = alunoSnapshot.data();
        setNome(alunoData.nome || "");
        setWhatsapp(alunoData.whatsapp || "");
      } else {
        // signicia que eu preciso adicionar ele
        setNome("");
        setWhatsapp("");
        //console.log("Limpamos os campos aluno.");
      }
    } catch (error) {
      console.error("Erro ao carregar dados do aluno:", error);
      //Alert.alert("Erro", "Não foi possível carregar os dados do aluno.");
    } finally {
      setLoading(false);
    }
  };



  const handleAddAluno = async () => {
    if (!turmaId) {
      console.error(
        "Erro",
        "IDs de turma e palestra são obrigatórios. Verifique as informações."
      );
      return;
    }

    if (!nome.trim() || !whatsapp.trim()) {
      Alert.alert("Erro", "Preencha todos os campos antes de continuar.");
      return;
    }

    // Remover caracteres não numéricos e garantir que começa com o código do país
    const numeroFormatado = whatsapp.replace(/\D/g, ""); // Remove qualquer caractere que não seja número
    const whatsappCompleto = `${codigoPais.replace(/\D/g, "")}${numeroFormatado}`; // Junta o código do país ao número

    // Validação do WhatsApp
    const regexTelefone = /^\+\d{1,3}\d{8,15}$/; // Exemplo: +5511999999999
    if (!regexTelefone.test(`+${whatsappCompleto}`)) {
      Alert.alert("Erro", "Número de WhatsApp inválido. Inclua o código do país (Ex.: +5511999999999).");
      return;
    }

    try {
      setLoading(true); // Ativa o loading
      const { pais, estado, lumisial } = await recuperarDadosDemograficos();
      const caminhoFirestore = `paises/${pais}/estados/${estado}/lumisial/${lumisial}`;

      const alunosCollection = collection(
        firestore,
        `${caminhoFirestore}/turmas/${turmaId}/alunos`
      );

      if (alunoId) {
        // Atualizar aluno existente
        // converter caminho para string antes de inserir ....
        // Certificar-se de que alunoId é uma string
        const alunoIdStr = String(alunoId);

        const alunoDoc = doc(alunosCollection, alunoIdStr);
        //await setDoc(alunoDoc, { nome, whatsapp }, { merge: true }); // Merge para atualizar sem sobrescrever
        await setDoc(alunoDoc, { nome, codigoPais, whatsapp }, { merge: true });

        Alert.alert("Sucesso", "Aluno atualizado com sucesso!");
      } else {
        // Verificar último aluno e calcular próximo ID
        const querySnapshot = await getDocs(alunosCollection);
        let novoId = "A001"; // ID inicial padrão

        if (!querySnapshot.empty) {
          const ids = querySnapshot.docs.map((doc) => doc.id);
          const ultimoId = ids.sort().pop(); // Obter o último ID
          if (ultimoId) {
            const numero = parseInt(ultimoId.replace("A", ""), 10) + 1;
            novoId = `A${String(numero).padStart(3, "0")}`; // Formatar com 3 dígitos
          }
        }

        // Inserir novo aluno
        const novoAlunoRef = doc(alunosCollection, novoId);
        //await setDoc(novoAlunoRef, { nome, whatsapp });
        await setDoc(novoAlunoRef, { nome, codigoPais, whatsapp });

        // Adicionar presença para o novo aluno
        await adicionarPresencaParaAluno(novoId);

        Alert.alert("Sucesso", `Aluno ${novoId} inserido com sucesso!`);
      }

      // Redirecionar após salvar
      router.push({
        pathname: "/ControleDePresenca",
        params: { turmaId },
      });
    } catch (error) {
      console.error("Erro ao salvar aluno:", error);
      //Alert.alert("Erro", "Não foi possível salvar o aluno.");
    } finally {
      setLoading(false); // Desativa o loading
    }
  };

  // Função para adicionar presença em todas as palestras da turma
  const adicionarPresencaParaAluno = async (alunoId: string) => {

    if (!turmaId || !palestraId) {
      //console.error("IDs de turma e palestra são obrigatórios. Verifique as informações.");
      return;
    }
    try {
      setLoading(true); // Ativa o loading
      const { pais, estado, lumisial } = await recuperarDadosDemograficos();
      // Montar o caminho no Firestore
      const caminhoFirestore = `paises/${pais}/estados/${estado}/lumisial/${lumisial}`;

      const palestrasCollection = collection(
        firestore,
        `${caminhoFirestore}/turmas/${turmaId}/palestras`
      );

      const palestrasSnapshot = await getDocs(palestrasCollection);
      if (!palestrasSnapshot.empty) {
        for (const palestraDoc of palestrasSnapshot.docs) {
          const palestraId = palestraDoc.id;
          const presencaRef = doc(
            firestore,
            `${caminhoFirestore}/turmas/${turmaId}/palestras/${palestraId}/presenca/${alunoId}`
          );
          await setDoc(presencaRef, { alunoId, status: "ausente" });
        }
        console.log(`Presenças adicionadas para o aluno '${alunoId}' em todas as palestras.`);

        router.push({
          pathname: "/ControleDePresenca",
          params: {
            turmaId,
          },
        });
      }
    } catch (error) {
      console.error("Erro ao adicionar presenças:", error);
    } finally {
      setLoading(false); // Desativa o loading
    }
  };

  // Carregar dados do aluno ao montar o componente
  useEffect(() => {
    const carregarCodigoPais = async () => {
      if (!codigoPais || codigoPais === "+55") {  // Evita sobrescrever o código do país se já estiver definido
        const dadosDemograficos = await recuperarDadosDemograficos();
        if (dadosDemograficos) {
          const paisEncontrado = paisesComCodigo.find((p) => p.nome === dadosDemograficos.pais);
          if (paisEncontrado) {
            setCodigoPais(paisEncontrado.codigo);
          }
        }
      }
    };

    carregarDadosAluno();
    carregarCodigoPais();
  }, [turmaId, alunoId]);


  return (
    <View style={globalStyles.container}>
      {/* Exibe o componente de loading quando necessário */}
      {loading && <Loading />}

      {!loading && (
        <>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5, marginLeft: 5 }}>
            <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 7, marginRight: 15 }}>
              <MaterialIcons name="arrow-back" size={28} color="#3498db" />
            </TouchableOpacity>
            <Text style={globalStyles.title}>{alunoId ? "Editar Aluno" : "Inserir Aluno"}</Text>
          </View>

          <Text style={globalStyles.text}>Nome do Aluno*</Text>
          <TextInput
            style={globalStyles.input}
            placeholder="Nome do Aluno"
            value={nome}
            onChangeText={setNome}
          />
          <Text style={globalStyles.text}>WhatsApp do Aluno*</Text>
          <View style={globalStyles.inputContainerPicker}>
            {/* Bandeira e Picker */}
            <View style={globalStyles.pickerWrapper}>
              <Text style={globalStyles.flag}>
                {paisesComCodigo.find(p => p.codigo === codigoPais)?.bandeira}
              </Text>
              <Picker
                selectedValue={codigoPais}  // Mova para o Picker
                onValueChange={(value) => setCodigoPais(value)}  // Mova para o Picker
                style={globalStyles.pickerPais}
              >
                {paisesComCodigo.map((pais) => (
                  <Picker.Item key={pais.codigo} label={`${pais.bandeira} ${pais.codigo}`} value={pais.codigo} />
                ))}
              </Picker>
            </View>

            {/* Campo de telefone */}
            <TextInput
              style={globalStyles.inputTelefone}
              placeholder="(21)98999-9999"
              value={whatsapp}
              onChangeText={(text) => setWhatsapp(text)}
              keyboardType="phone-pad"
            />
          </View>
          <Text>Todos os campos são obrigatórios.</Text>
          <TouchableOpacity style={globalStyles.button} onPress={handleAddAluno}>
            <Text style={globalStyles.buttonText}>Inserir Aluno</Text>
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
*/

export default InserirAluno;