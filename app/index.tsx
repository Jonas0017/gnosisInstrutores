import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

const ControlePresenca = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Controle de Presença</Text>

      {/* Botões para Inserir e Consultar Turmas */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/ControleDePresenca")}
        >
          <Text style={styles.buttonText}>Controle de Presença</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/InserirTurma")}
        >
          <Text style={styles.buttonText}>Inserir Turma</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/ConsultarTurmas")}
        >
          <Text style={styles.buttonText}>Consultar Turmas</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  actions: {
    width: "100%",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#4CAF50", // Cor moderna
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 25, // Botões arredondados
    marginBottom: 15,
    width: "80%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Sombra para Android
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ControlePresenca;
