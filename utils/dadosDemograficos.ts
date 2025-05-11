import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

/**
 * Recupera os dados demográficos salvos no AsyncStorage.
 * @returns {Promise<{pais: string, estado: string, lumisial: string}>} Dados demográficos.
 */
export const recuperarDadosDemograficos = async () => {
  try {
    const dadosDemograficos = await AsyncStorage.getItem("dadosDemograficos");
    if (!dadosDemograficos) {
      Alert.alert(
        "Erro",
        "Nenhuma configuração demográfica encontrada. Complete a configuração inicial."
      );
      throw new Error("Dados demográficos não encontrados.");
    }

    return JSON.parse(dadosDemograficos);
  } catch (error) {
    console.error("Erro ao recuperar configurações demográficas:", error);
    throw error;
  }
};
