import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { CopilotStep, walkthroughable, useCopilot } from "react-native-copilot";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";

// Criamos componentes `walkthroughable` para destacar elementos
const WalkthroughTouchable = walkthroughable(View);
const WalkthroughText = walkthroughable(Text);

const TutorialTurmas = () => {
  const { start } = useCopilot(); // ✅ Obtém o método `start` corretamente

  useEffect(() => {
    const checkIfTutorialSeen = async () => {
      const tutorialSeen = await AsyncStorage.getItem("tutorialCompleted");
      if (!tutorialSeen) {
        await AsyncStorage.setItem("tutorialCompleted", "true");
        start(); // ✅ Inicia automaticamente na primeira vez
      }
    };
    checkIfTutorialSeen();
  }, []);

  return (
    <View style={styles.overlay}>
      {/* Tutorial no botão Home */}
      <CopilotStep text="Aqui você volta para a tela inicial!" order={1} name="home">
        <WalkthroughTouchable>
          <MaterialIcons name="home" size={28} style={styles.icon} />
        </WalkthroughTouchable>
      </CopilotStep>

      {/* Tutorial no botão de configurações */}
      <CopilotStep text="Aqui você acessa seu perfil e configurações." order={2} name="config">
        <WalkthroughTouchable>
          <MaterialIcons name="settings" size={28} style={styles.icon} />
        </WalkthroughTouchable>
      </CopilotStep>

      {/* Tutorial na lista de turmas */}
      <CopilotStep text="Toque para selecionar um instrutor." order={3} name="lista">
        <WalkthroughTouchable>
          <Text style={styles.text}>Instrutor: Nome do Instrutor</Text>
        </WalkthroughTouchable>
      </CopilotStep>

      {/* Tutorial no botão de adicionar turma */}
      <CopilotStep text="Clique aqui para criar uma nova turma!" order={4} name="adicionar">
        <WalkthroughTouchable>
          <AntDesign name="plus" size={24} color="#ecf0f1" style={styles.addButton} />
        </WalkthroughTouchable>
      </CopilotStep>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  text: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 10,
  },
  icon: {
    fontSize: 28,
    color: "#fff",
  },
  addButton: {
    fontSize: 28,
    backgroundColor: "#3498db",
    padding: 15,
    borderRadius: 30,
    color: "#fff",
  },
});

export default TutorialTurmas;
