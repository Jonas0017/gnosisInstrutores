import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useLocalSearchParams } from "expo-router";
import { doc, setDoc } from "firebase/firestore";
import { firestore } from "../firebaseConfig";
import { globalStyles } from "../styles/globalStyles";
import Loading from "../components/Loading";
import { MaterialIcons } from "@expo/vector-icons"; // Ícones para mostrar/ocultar senha
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

const ConfiguracaoPessoal = () => {
  const router = useRouter();

  const { nome: initialNome = "", cpf: initialCpf = "", whatsapp: initialWhatsapp = "", codigoPais: initialCodigoPais = "" } = useLocalSearchParams() || {};

  //const { nome: initialNome = "", cpf: initialCpf = "", whatsapp: initialWhatsapp = "" } = useLocalSearchParams() || {};
  const [nome, setNome] = useState(String(initialNome));
  const [cpf, setCpf] = useState(String(initialCpf));
  const [codigoPais, setCodigoPais] = useState(initialCodigoPais); // Código padrão Brasil
  const [whatsapp, setWhatsapp] = useState(String(initialWhatsapp));
  const [loading, setLoading] = useState(false);

  // Obtém a bandeira correspondente ao código do país selecionado
  const bandeiraSelecionada = paisesComCodigo.find((p) => p.codigo === codigoPais)?.bandeira || "🌍";

  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  // Estados para alternar a visibilidade das senhas
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [confirmarSenhaVisivel, setConfirmarSenhaVisivel] = useState(false);

  const salvarDadosPessoais = async () => {
    if (!nome || !cpf || !whatsapp || !senha || !confirmarSenha) {
      Alert.alert("Erro", "Todos os campos são obrigatórios.");
      return;
    }

    if (senha.length < 6) {
      Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    try {
      setLoading(true);
      const configDemografica = await AsyncStorage.getItem("dadosDemograficos");
      if (!configDemografica) {
        console.error("Erro", "Configurações demográficas não encontradas.");
        return;
      }
      const { pais, estado, lumisial } = JSON.parse(configDemografica);

      const caminhoFirestore = `paises/${pais}/estados/${estado}/lumisial/${lumisial}/instrutor`;
      //const dadosPessoais = { nome, cpf, whatsapp, senha };
      const dadosPessoais = { nome, cpf, codigoPais, whatsapp, senha };

      await setDoc(doc(firestore, caminhoFirestore, cpf), dadosPessoais);
      await AsyncStorage.setItem("dadosPessoais", JSON.stringify(dadosPessoais));

      console.log("Sucesso", "Dados pessoais salvos com sucesso!");
      router.push("/");
    } catch (error) {
      console.error("Erro ao salvar dados pessoais:", error);
    } finally {
      setLoading(false);
    }
  };

  const senhaValida = senha.length >= 6;
  const confirmacaoValida = senha === confirmarSenha && senhaValida;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={globalStyles.container}>
            {loading && <Loading />}

            {!loading && (
              <>
                <Text style={globalStyles.title}>Dados Pessoais</Text>
                <Text style={globalStyles.text}>Nome Completo*</Text>
                <TextInput
                  style={globalStyles.input}
                  placeholder="Nome Completo"
                  value={nome}
                  onChangeText={setNome}
                />
                <Text style={globalStyles.text}>CPF*</Text>
                <TextInput
                  style={globalStyles.input}
                  placeholder="CPF"
                  value={cpf}
                  onChangeText={setCpf}
                  keyboardType="numeric"
                />

                <Text style={globalStyles.text}>WhatsApp*</Text>
                <View style={globalStyles.inputContainerPicker}>
                  {/* Bandeira e Picker */}
                  <View style={globalStyles.pickerWrapper}>
                    <Text style={globalStyles.flag}>{bandeiraSelecionada}</Text>
                    <Picker
                      selectedValue={codigoPais}
                      onValueChange={(value) => setCodigoPais(value)}
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
                    placeholder="(21) 99999-9999"
                    keyboardType="phone-pad"
                    value={whatsapp}
                    onChangeText={(text) => {
                      // Remove espaços e caracteres não numéricos para garantir um formato correto
                      const numeroFormatado = text.replace(/\D/g, "");
                      setWhatsapp(numeroFormatado);
                    }}
                  />
                </View>

                {/* Campo de Senha */}
                <Text style={globalStyles.text}>Senha*</Text>
                <View style={globalStyles.inputContainerSenha}>
                  <TextInput
                    style={[
                      globalStyles.inputSenha,
                      senhaValida ? globalStyles.inputValid : senha.length > 0 ? globalStyles.inputInvalid : null,
                    ]}
                    placeholder="Senha (mínimo 6 dígitos)"
                    value={senha}
                    onChangeText={setSenha}
                    secureTextEntry={!senhaVisivel}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity onPress={() => setSenhaVisivel(!senhaVisivel)} style={globalStyles.iconSenha}>
                    <MaterialIcons name={senhaVisivel ? "visibility" : "visibility-off"} size={24} color="#666" />
                  </TouchableOpacity>
                </View>

                <Text style={globalStyles.text}>Confirmar Senha*</Text>
                {/* Campo de Confirmação de Senha */}
                <View style={globalStyles.inputContainerSenha}>
                  <TextInput
                    style={[
                      globalStyles.inputSenha,
                      confirmacaoValida ? globalStyles.inputValid : confirmarSenha.length > 0 ? globalStyles.inputInvalid : null,
                    ]}
                    placeholder="Confirmar Senha"
                    value={confirmarSenha}
                    onChangeText={setConfirmarSenha}
                    secureTextEntry={!confirmarSenhaVisivel}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity onPress={() => setConfirmarSenhaVisivel(!confirmarSenhaVisivel)} style={globalStyles.iconSenha}>
                    <MaterialIcons name={confirmarSenhaVisivel ? "visibility" : "visibility-off"} size={24} color="#666" />
                  </TouchableOpacity>
                </View>
                
                <Text>Todos os campos são obrigatórios.</Text>
                <TouchableOpacity style={globalStyles.button} onPress={salvarDadosPessoais}>
                  <Text style={globalStyles.buttonText}>Salvar e Finalizar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default ConfiguracaoPessoal;
