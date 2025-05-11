import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { collection, query, where, getDocs, updateDoc } from "firebase/firestore";
import { firestore } from "../firebaseConfig"; // Certifique-se de que o Firebase Firestore está configurado
import { globalStyles } from "../styles/globalStyles"; // Estilos globais (opcional)
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import Loading from "../components/Loading"; // Importando o componente Loading


const RecuperarSenha = () => {
  const [cpf, setCpf] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false); // Estado para mostrar o loading

  const handleRecuperarSenha = async () => {
    if (!cpf || !whatsapp || !senha || !confirmarSenha) {
      console.error("Erro", "Todos os campos são obrigatórios.");
      return;
    }

    // Validação do CPF
    const validarCPF = (cpf: string): boolean => {
      cpf = cpf.replace(/[^\d]+/g, ""); // Remove caracteres não numéricos
      if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
      let soma = 0,
        resto;
      for (let i = 1; i <= 9; i++) soma += parseInt(cpf[i - 1]) * (11 - i);
      resto = (soma * 10) % 11;
      if (resto === 10 || resto === 11) resto = 0;
      if (resto !== parseInt(cpf[9])) return false;
      soma = 0;
      for (let i = 1; i <= 10; i++) soma += parseInt(cpf[i - 1]) * (12 - i);
      resto = (soma * 10) % 11;
      if (resto === 10 || resto === 11) resto = 0;
      if (resto !== parseInt(cpf[10])) return false;
      return true;
    };

    if (!validarCPF(cpf)) {
      Alert.alert("Erro", "CPF inválido. Verifique o número digitado.");
      return;
    }

    const regexTelefone = /^\+\d{1,3}\d{8,15}$/; // Exemplo: +5511999999999
    if (!regexTelefone.test(whatsapp)) {
      Alert.alert("Erro", "Número de WhatsApp inválido. Inclua o código do país (Ex.: +5511999999999).");
      return;
    }

    if (senha.length < 6) {
      Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert("Erro", "As senhas não coincidem. Por favor, tente novamente.");
      return;
    }

    setLoading(true);

    try {
      setLoading(true); // Ativa o loading
      const configDemografica = await AsyncStorage.getItem("dadosDemograficos");
      if (!configDemografica) {
        console.error("Erro", "Configurações demográficas não encontradas.");
        return;
      }
      const { pais, estado, lumisial } = JSON.parse(configDemografica);

      const usuariosCollection = collection(
        firestore,
        `paises/${pais}/estados/${estado}/lumisial/${lumisial}/instrutor`
      );
      const consulta = query(
        usuariosCollection,
        where("cpf", "==", cpf),
        where("whatsapp", "==", whatsapp)
      );
      const resultado = await getDocs(consulta);

      if (resultado.empty) {
        Alert.alert("Erro", "Nenhum usuário encontrado com as informações fornecidas.");
        return;
      }

      const usuarioDoc = resultado.docs[0];
      const usuarioRef = usuarioDoc.ref;

      await updateDoc(usuarioRef, { senha });

      Alert.alert("Sucesso", "Senha atualizada com sucesso!");
      router.push("/");
    } catch (error) {
      console.error("Erro ao recuperar senha:", error);
      //Alert.alert("Erro", "Ocorreu um erro ao tentar recuperar a senha.");
    } finally {
      setLoading(false); // Desativa o loading
    }
  };

  const senhaValida = senha.length >= 6;
  const confirmacaoValida = senha === confirmarSenha && senhaValida;

  return (
    <View style={globalStyles.container}>
      {/* Exibe o componente de loading quando necessário */}
      {loading && <Loading />}

      {!loading && (
        <>
          <Text style={globalStyles.title}>Recuperação de Senha</Text>
          <Text style={globalStyles.description}>
            Insira seu CPF, WhatsApp e uma nova senha para redefinição.
          </Text>
          <TextInput
            style={globalStyles.input}
            placeholder="CPF"
            value={cpf}
            onChangeText={setCpf}
            keyboardType="numeric"
            maxLength={11}
          />
          <TextInput
            style={globalStyles.input}
            placeholder="WhatsApp (Ex.: +5511999999999)"
            value={whatsapp}
            onChangeText={setWhatsapp}
            keyboardType="phone-pad"
          />
          <TextInput
            style={[
              globalStyles.input,
              senhaValida ? globalStyles.inputValid : senha.length > 0 ? globalStyles.inputInvalid : null,
            ]}
            placeholder="Senha (mínimo 6 dígitos)"
            value={senha}
            onChangeText={(text) => setSenha(text.toLowerCase())} // Converte a entrada para minúsculas
            secureTextEntry
            autoCapitalize="none" // Desativa a capitalização automática
          />
          <TextInput
            style={[
              globalStyles.input,
              confirmacaoValida ? globalStyles.inputValid : confirmarSenha.length > 0 ? globalStyles.inputInvalid : null,
            ]}
            placeholder="Confirmar Senha"
            value={confirmarSenha}
            onChangeText={(text) => setConfirmarSenha(text.toLowerCase())} // Converte a entrada para minúsculas
            secureTextEntry
            autoCapitalize="none" // Desativa a capitalização automática
          />
          <TouchableOpacity
            style={[globalStyles.button, loading && globalStyles.buttonDisabled]}
            onPress={handleRecuperarSenha}
            disabled={loading}
          >
            <Text style={globalStyles.buttonText}>{loading ? "Processando..." : "Recuperar Senha"}</Text>
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
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#555",
  },
  input: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 20,
  },
  inputValid: {
    borderColor: "#4caf50",
    shadowColor: "#4caf50",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  inputInvalid: {
    borderColor: "#ff5252",
    shadowColor: "#ff5252",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  button: {
    backgroundColor: "#3498db",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#87CEEB",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
*/

export default RecuperarSenha;
