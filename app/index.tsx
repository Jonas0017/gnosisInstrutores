import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../firebaseConfig"; // Ajuste o caminho se necessário
import { globalStyles } from "../styles/globalStyles";
import Loading from "../components/Loading";
import * as LocalAuthentication from "expo-local-authentication";
import { MaterialIcons } from "@expo/vector-icons";
//import HighlightWrapper from "../components/HighlightWrapper"; // Importa o HighlightWrapper

const Login = () => {
  const router = useRouter();
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [Pais, setPais] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const verificarConfiguracaoInicial = async () => {
      try {
        setLoading(true);
        const dadosDemograficos = await AsyncStorage.getItem("dadosDemograficos");
        if (!dadosDemograficos) {
          router.push("/ConfiguracaoDemografica");
        } else {
          const { pais } = JSON.parse(dadosDemograficos) as { pais: string };
          setPais(pais);
        }
      } catch (error) {
        console.error("Erro ao verificar configuração inicial:", error);
      } finally {
        setLoading(false);
      }
    };
    verificarConfiguracaoInicial();
  }, []);

  const handleBiometricAuth = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      if (!compatible) {
        Alert.alert("Erro", "Dispositivo sem suporte para autenticação biométrica.");
        return;
      }

      const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (!enrolled) {
        Alert.alert("Erro", "Nenhuma identificação biométrica cadastrada.");
        return;
      }

      const authResult = await LocalAuthentication.authenticateAsync({
        promptMessage: "Autentique-se para acesso rápido",
        fallbackLabel: "Usar senha",
      });

      if (authResult.success) {
        router.push("/ConsultarTurmas");
      } else {
        Alert.alert("Falha", "Autenticação não realizada.");
      }
    } catch (error) {
      console.error("Erro na autenticação biométrica:", error);
    }
  };

  const handleLogin = async () => {
    if (!cpf || !senha) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    try {
      setLoading(true);
      const dadosDemograficos = await AsyncStorage.getItem("dadosDemograficos");
      if (!dadosDemograficos) {
        console.error("Erro", "Configurações demográficas não encontradas.");
        router.push("/ConfiguracaoDemografica");
        return;
      }
      const { pais, estado, lumisial } = JSON.parse(dadosDemograficos);
      const caminhoFirestore = `paises/${pais}/estados/${estado}/lumisial/${lumisial}/instrutor/${cpf}`;
      const usuarioDoc = await getDoc(doc(firestore, caminhoFirestore));

      if (!usuarioDoc.exists()) {
        Alert.alert("Erro", "Usuário não encontrado.");
        return;
      }

      const usuario = usuarioDoc.data();
      if (usuario.senha === senha) {
        router.push("/ConsultarTurmas");
      } else {
        Alert.alert("Erro", "CPF ou senha inválidos.");
      }
    } catch (error) {
      console.error("Erro ao realizar login:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEsqueciSenha = () => {
    router.push("/RecuperarSenha");
  };

  return (
    <View style={globalStyles.containerLogin}>
      {loading && <Loading />}
      {!loading && (
        <>
          <Image
            source={require("../assets/images/icon.png")}
            style={globalStyles.icon}
            resizeMode="contain"
          />

          <Text style={globalStyles.title}>GNOSIS {Pais}</Text>

          <TextInput
            style={globalStyles.input}
            placeholder="CPF"
            value={cpf}
            onChangeText={setCpf}
            keyboardType="numeric"
          />

          {/* Campo de Senha com Ícone de Olho */}
          <View style={globalStyles.inputContainer}>
            <TextInput
              style={globalStyles.inputSenhaLogin}
              placeholder="Senha"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry={!mostrarSenha}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
              <MaterialIcons
                name={mostrarSenha ? "visibility" : "visibility-off"}
                size={24}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={globalStyles.button} onPress={handleLogin}>
            <Text style={globalStyles.buttonText}>Entrar</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleEsqueciSenha}>
            <Text style={globalStyles.forgotPassword}>Esqueci minha senha</Text>
          </TouchableOpacity>

          {/* Ícone para autenticação biométrica */}
          <TouchableOpacity
            style={{ marginTop: 20, alignSelf: "center" }}
            onPress={handleBiometricAuth}
          >
            <MaterialIcons name="fingerprint" size={48} color="#3498db" />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};


export default Login;
