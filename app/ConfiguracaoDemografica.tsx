import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { collection, getDocs, DocumentData } from "firebase/firestore";
import { firestore } from "../firebaseConfig.js";
import { globalStyles } from "../styles/globalStyles"; // Importando o CSS
import Loading from "../components/Loading"; // Importando o componente Loading

type Pais = {
  id: string;
  nome: string;
};

type Estado = {
  id: string;
  nome: string;
};

const ConfiguracaoDemografica = () => {
  const router = useRouter();

  const [idioma, setIdioma] = useState("pt");
  const [pais, setPais] = useState<string>("");
  const [estado, setEstado] = useState<string>("");
  const [lumisial, setLumisial] = useState<string>("");
  const [paises, setPaises] = useState<Pais[]>([]);
  const [estados, setEstados] = useState<Estado[]>([]);
  const [loading, setLoading] = useState(false); // Estado para mostrar o loading

  // Função para carregar os países do Firestore
  const carregarPaises = async () => {
    try {
      setLoading(true); // Ativa o loading
      const querySnapshot = await getDocs(collection(firestore, "paises"));
      const listaPaises: Pais[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        nome: doc.data().nome as string,
      }));
      setPaises(listaPaises);
    } catch (error) {
      console.error("Erro ao carregar países:", error);
      //Alert.alert("Erro", "Não foi possível carregar os países.");
    } finally {
      setLoading(false); // Desativa o loading
    }
  };

  // Função para carregar os estados do país selecionado
  const carregarEstados = async (paisSelecionado: string) => {
    try {
      setLoading(true); // Ativa o loading
      const querySnapshot = await getDocs(
        collection(firestore, `paises/${paisSelecionado}/estados`)
      );
      const listaEstados: Estado[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        nome: doc.data().nome as string,
      }));
      setEstados(listaEstados);
    } catch (error) {
      console.error("Erro ao carregar estados:", error);
      //Alert.alert("Erro", "Não foi possível carregar os estados.");
    } finally {
      setLoading(false); // Desativa o loading
    }
  };

  const carregarDadosSalvos = async () => {
    try {
      const dados = await AsyncStorage.getItem("dadosDemograficos");
      if (dados) {
        const { idioma, pais, estado, lumisial } = JSON.parse(dados);
        setIdioma(idioma || "pt");
        setPais(pais || "");
        setEstado(estado || "");
        setLumisial(lumisial || "");

        // Se já houver um país salvo, carregar os estados dele
        if (pais) {
          carregarEstados(pais);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar dados demográficos salvos:", error);
    }
  };


  useEffect(() => {
    carregarPaises();
    carregarDadosSalvos(); // Recupera os dados salvos ao abrir a tela
  }, []);

  const salvarDadosDemograficos = async () => {
    if (!pais || !estado || !lumisial.trim()) {
      Alert.alert("Erro", "Todos os campos são obrigatórios.");
      return;
    }

    try {
      setLoading(true); // Ativa o loading
      const dadosDemograficos = { idioma, pais, estado, lumisial: lumisial.trim(), }; // trim Remove espaços extras
      await AsyncStorage.setItem("dadosDemograficos", JSON.stringify(dadosDemograficos));
      console.log("Sucesso", "Dados demográficos salvos!");
      router.push("/ConfiguracaoPessoal");
    } catch (error) {
      console.error("Erro ao salvar dados demográficos:", error);
      //Alert.alert("Erro", "Não foi possível salvar os dados.");
    } finally {
      setLoading(false); // Desativa o loading
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={globalStyles.container}>

            {/* Exibe o componente de loading quando necessário */}
            {loading && <Loading />}

            {!loading && (
              <>

                <Text style={globalStyles.title}>Dados Demográficos</Text>

                <Text style={globalStyles.label}>Idioma*</Text>
                <Picker
                  selectedValue={idioma}
                  onValueChange={(itemValue) => setIdioma(itemValue)}
                  style={globalStyles.inputPic}
                >
                  <Picker.Item label="Português" value="pt" />
                  <Picker.Item label="English" value="en" />
                  <Picker.Item label="Español" value="es" />
                </Picker>

                <Text style={globalStyles.label}>País*</Text>
                <Picker
                  selectedValue={pais}
                  onValueChange={(itemValue) => {
                    setPais(itemValue);
                    carregarEstados(itemValue);
                  }}
                  style={globalStyles.inputPic}
                >
                  <Picker.Item label="Selecione o País" value="" />
                  {paises.map((pais) => (
                    <Picker.Item key={pais.id} label={pais.nome} value={pais.id} />
                  ))}
                </Picker>

                <Text style={globalStyles.label}>Estado*</Text>
                <Picker
                  selectedValue={estado}
                  onValueChange={(itemValue) => setEstado(itemValue)}
                  style={globalStyles.inputPic}
                  enabled={!!pais} // Habilitar apenas quando um país for selecionado
                >
                  <Picker.Item label="Selecione o Estado" value="" />
                  {estados.map((estado) => (
                    <Picker.Item key={estado.id} label={estado.nome} value={estado.id} />
                  ))}
                </Picker>
                <Text style={globalStyles.label}>Lumisial*</Text>
                <TextInput
                  style={globalStyles.input}
                  placeholder="Lumisial"
                  value={lumisial}
                  onChangeText={(text) => setLumisial(text.trimStart())} // Remove espaços no início enquanto digita
                />
                <Text>Todos os campos são obrigatórios.</Text>
                <TouchableOpacity style={globalStyles.button} onPress={salvarDadosDemograficos}>
                  <Text style={globalStyles.buttonText}>Salvar e Continuar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
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
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
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
  button: {
    backgroundColor: "#4caf50",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
*/

export default ConfiguracaoDemografica;
