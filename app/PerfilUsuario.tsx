import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import { globalStyles } from "../styles/globalStyles";
import { useRouter } from "expo-router";
import Loading from "../components/Loading"; // Importando o componente Loading

const PerfilUsuario = () => {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [modalPessoalVisible, setModalPessoalVisible] = useState(false);
  const [modalDemograficoVisible, setModalDemograficoVisible] =
    useState(false);
  const [dadosDemograficos, setDadosDemograficos] = useState<any>(null);
  const [loading, setLoading] = useState(false); // Estado para mostrar o loading

  const router = useRouter();

  const carregarUsuarios = async () => {
    try {
      setLoading(true);
      const keys = await AsyncStorage.getAllKeys();
      const allUsers = [];
      for (const key of keys) {
        if (key.startsWith("dadosPessoais")) {
          const userData = await AsyncStorage.getItem(key);
          if (userData) {
            const user = JSON.parse(userData);
            allUsers.push({ key, ...user });
          }
        }
      }
      setUsuarios(allUsers);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    } finally {
      setLoading(false);
    }
  };

  const carregarDadosDemograficos = async () => {
    try {
      setLoading(true);
      const dados = await AsyncStorage.getItem("dadosDemograficos");
      if (dados) {
        setDadosDemograficos(JSON.parse(dados));
      } else {
        setDadosDemograficos(null);
        console.error("Aviso", "Nenhum dado demográfico encontrado.");
      }
    } catch (error) {
      console.error("Erro ao carregar dados demográficos:", error);
    } finally {
      setLoading(false);
    }
  };

  const removerUsuario = async (key: string) => {
    try {
      setLoading(true);
      await AsyncStorage.removeItem(key);
      Alert.alert("Sucesso", "Usuário removido com sucesso!");
      setModalPessoalVisible(false);
      carregarUsuarios();
    } catch (error) {
      console.error("Erro ao remover usuário:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarUsuarios();
    carregarDadosDemograficos();
  }, []);

  return (
    <View style={globalStyles.container}>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5, marginLeft: 5 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 7, marginRight: 15 }}>
          <MaterialIcons name="arrow-back" size={28} color="#3498db" />
        </TouchableOpacity>
        <Text style={globalStyles.title}>Configurações</Text>
      </View>

      {loading && <Loading />}

      {!loading && (
        <>
          <FlatList
            data={usuarios}
            keyExtractor={(item) => item.key}
            renderItem={({ item }) => (
              <View>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedUser(item);
                    setModalPessoalVisible(true);
                  }}
                >
                  <View style={globalStyles.itemTurmas}>
                    <Text style={globalStyles.titleTurma}>Dados Pessoais</Text>
                    <Text style={globalStyles.text}>Nome: {item.nome}</Text>
                    <Text style={globalStyles.text}>CPF: {item.cpf}</Text>
                    <Text style={globalStyles.text}>WhatsApp: {`${item.codigoPais} ${item.whatsapp}`}</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setModalDemograficoVisible(true)}>
                  <View style={globalStyles.itemTurmas}>
                    <Text style={globalStyles.titleTurma}>Dados Demográficos</Text>
                    <Text style={globalStyles.text}>País: {dadosDemograficos?.pais || "Carregando..."}</Text>
                    <Text style={globalStyles.text}>Estado: {dadosDemograficos?.estado || "Carregando..."}</Text>
                    <Text style={globalStyles.text}>Lumisial: {dadosDemograficos?.lumisial || "Carregando..."}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
            ListEmptyComponent={<Text style={globalStyles.empty}>Nenhum usuário encontrado.</Text>}
          />

          {/* Modal para Dados Pessoais */}
          {modalPessoalVisible && selectedUser && (
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalPessoalVisible}
              onRequestClose={() => setModalPessoalVisible(false)}
            >
              <TouchableWithoutFeedback onPress={() => setModalPessoalVisible(false)}>
                <View style={globalStyles.modalContainer}>
                  <TouchableWithoutFeedback>
                    <View style={globalStyles.modalContent}>
                      <Text style={globalStyles.modalTitle}>Editar Dados Pessoais</Text>

                      <Text style={globalStyles.text}>Nome: {selectedUser.nome}</Text>
                      <Text style={globalStyles.text}>CPF: {selectedUser.cpf}</Text>
                      <Text style={globalStyles.text}>WhatsApp: {`${selectedUser.codigoPais} ${selectedUser.whatsapp}`}</Text>

                      <View style={globalStyles.buttonsContainerPerfil}>
                        <TouchableOpacity onPress={() => setModalPessoalVisible(false)}>
                          <MaterialIcons name="arrow-back" size={24} color="#3498db" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => {
                            setModalPessoalVisible(false);
                            router.push({
                              pathname: "/ConfiguracaoPessoal",
                              params: {
                                nome: selectedUser.nome,
                                cpf: selectedUser.cpf,
                                codigoPais: selectedUser.codigoPais, // 🔥 Agora o código do país será enviado!
                                whatsapp: selectedUser.whatsapp,
                              },
                            });
                          }}
                        >
                          <MaterialIcons name="edit" size={24} color="#1abc9c" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          )}

          {/* Modal para Dados Demográficos */}
          {modalDemograficoVisible && dadosDemograficos && (
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalDemograficoVisible}
              onRequestClose={() => setModalDemograficoVisible(false)}
            >
              <TouchableWithoutFeedback onPress={() => setModalDemograficoVisible(false)}>
                <View style={globalStyles.modalContainer}>
                  <TouchableWithoutFeedback>
                    <View style={globalStyles.modalContent}>
                      <Text style={globalStyles.modalTitle}>Editar Dados Demográficos</Text>

                      <Text style={globalStyles.text}>País: {dadosDemograficos.pais}</Text>
                      <Text style={globalStyles.text}>Estado: {dadosDemograficos.estado}</Text>
                      <Text style={globalStyles.text}>Lumisial: {dadosDemograficos.lumisial}</Text>

                      <View style={globalStyles.buttonsContainerPerfil}>
                        <TouchableOpacity onPress={() => setModalDemograficoVisible(false)}>
                          <MaterialIcons name="arrow-back" size={24} color="#3498db" />
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => {
                            setModalDemograficoVisible(false);
                            router.push({
                              pathname: "/ConfiguracaoDemografica",
                              params: {
                                pais: dadosDemograficos?.pais || "",
                                estado: dadosDemograficos?.estado || "",
                                lumisial: dadosDemograficos?.lumisial || "",
                              },
                            });
                          }}
                        >
                          <MaterialIcons name="edit" size={24} color="#22a6b3" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          )}
        </>
      )}
    </View>
  );
};

export default PerfilUsuario;
