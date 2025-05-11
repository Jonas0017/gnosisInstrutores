import { Picker } from "@react-native-picker/picker";
import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 10,
  },
  containerTurma: {
    flex: 1,
    padding: 20,
    marginTop: 15,
  },
  containerLogin: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#ecf0f1",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#2c3e50",
    marginBottom: 10,
  },
  input: {
    height: 55,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
    backgroundColor: "#fff",
    fontSize: 16,
  },

  /* Adicione esses estilos ao seu globalStyles */

inputContainer: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#fff",
  borderRadius: 8,
  borderWidth: 1,
  borderColor: "#ccc",
  paddingHorizontal: 10,
  marginBottom: 12,
},
inputContainerPicker: {
  flexDirection: "row",
  alignItems: "center",
  borderWidth: 1,
  backgroundColor: "#fff",
  borderColor: "#ccc",
  borderRadius: 8,
  paddingHorizontal: 10,
  height: 55,
  marginBottom: 10,
},

pickerWrapper: {
  flexDirection: "row",
  alignItems: "center",
  borderRadius: 8,
  paddingLeft: 10, // Garante espaçamento interno
  marginRight: -92,
  flex: 0, // Faz com que ele ocupe apenas o necessário
},

flag: {
  fontSize: 20, // Ajusta o tamanho da bandeira
  marginRight: 5, // Dá espaço entre a bandeira e o picker
},

pickerPais: {
  flex: 0.28, // Ajusta para melhor proporção entre picker e input
  fontSize: 16,
  textAlign: "left",
},

inputTelefone: {
  flex: 1.4, // Reduz um pouco para equilibrar com o Picker
  fontSize: 16,
  paddingHorizontal: 10, // Adiciona um pequeno padding para não colar na borda
  
},

inputContainerSenha: {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 10,
},

inputSenhaLogin: {
  height: 55,
  flex: 1,
  paddingVertical: 15,
  fontSize: 16,
},

inputSenha: {
  height: 55,
  padding: 10,
  fontSize: 16,
  flex: 1,
  paddingLeft: 10,

  borderWidth: 1,
  borderRadius: 8,

},

iconSenha: {
  padding: 10,
},

  button: {
    backgroundColor: "#3498db",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#ecf0f1",
    fontSize: 16,
    fontWeight: "bold",
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    paddingBottom: 9,
    paddingTop: 9,
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  itemTurmas: {
    marginBottom: 10,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#333",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  nome: {
    fontSize: 18,
  },
  botao: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  presente: {
    backgroundColor: "#3498db",
  },
  ausente: {
    backgroundColor: "#f39c12",
  },
  textoBotao: {
    color: "#ecf0f1",
    fontWeight: "bold",
  },
  loading: {
    fontSize: 18,
    textAlign: "center",
    color: "#3498db",
  },
  empty: {
    fontSize: 18,
    textAlign: "center",
    color: "gray",
    marginTop: 20,
    backgroundColor: "#ecf0f1",
  },

  text: {
    color: "#2c3e50",
    fontSize: 16,
    marginBottom: 5,
  },

  addButton: {
    position: "absolute",
    bottom: 30,
    backgroundColor: "#3498db",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    padding: 0,
  },

  icon: {
    width: 150, // Largura do ícone
    height: 150, // Altura do ícone
    alignSelf: "center",
    marginBottom: 20,
  },

  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },

  buttonsContainerPerfil: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },

    // Container para exibir o status (ícone, data e botão de edição) em uma linha
    statusContainer: {
      flexDirection: "row",
      alignItems: "center",
      padding: 12,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: "#ccc",
      backgroundColor: "#ecf0f1",
    },

      // Área que alterna o status (ícone e data), ficará à esquerda dentro do statusContainer
  statusToggle: {
    flexDirection: "row",
    alignItems: "center",
  },

  statusButton: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#ecf0f1",
    flex: 1,
    alignItems: "center",
    marginHorizontal: 5,
    
  },

    // Estilo para o botão que exibe a data no modal de edição
    dateButton: {
      backgroundColor: "#f1f1f1",
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 4,
      marginBottom: 12,
    },
    // Estilo para o texto exibido no botão de data
    dateButtonText: {
      fontSize: 16,
      color: "#333",
      textAlign: "center",
    },
  // Estilo para o texto que exibe a data
  dateText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#333",
  },

  // Estilo para o botão de edição (ícone de lápis)
  editButton: {
    marginLeft: "auto",
    paddingHorizontal: 8,
  },

  activeButton: {
    backgroundColor: "#3498db",
  },
  statusButtonText: {
    color: "#2c3e50",
  },

  forgotPassword: {
    color: "#2980b9",
    fontSize: 16,
    marginTop: 20,
    textAlign: "center",
  },

  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#2c3e50",
  },

  inputPic: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
  },

  desativado: {
    backgroundColor: "#d3d3d3", // Cor de fundo cinza
    opacity: 0.5, // Transparência
  },

  desativadoBotao: {
    backgroundColor: "#a9a9a9", // Cor do botão para alunos desativados
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "stretch",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 45,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 5,
  },
  
    // Estilos dos botões do modal
    modalButton: {
      backgroundColor: "#3498db", // Azul
      padding: 12,
      borderRadius: 8,
      marginVertical: 5,
      width: "100%",
      alignItems: "center",
    },
  
    modalButtonText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 16,
    },
  
    modalButtonDanger: {
      backgroundColor: "#e74c3c", // Vermelho
    },
  
    modalCloseButton: {
      backgroundColor: "#95a5a6", // Cinza
      padding: 12,
      borderRadius: 8,
      marginTop: 10,
      width: "100%",
      alignItems: "center",
    },
  
    modalCloseButtonText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 16,
    },


  iconButton: {
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonAluno: {
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3498db",
    padding: 16,
    borderRadius: 30,
    
  },
  headerContainer: {
    flexDirection: "row", // Organiza o conteúdo em linha
    alignItems: "center", // Alinha verticalmente no centro
    justifyContent: "space-between", // Para posicionar o título à esquerda e a engrenagem à direita
    paddingHorizontal: 15, // Espaçamento horizontal
    paddingVertical: 10, // Espaçamento vertical
    marginTop: -28,
    marginBottom: -12,
  },
  iconHome: {
    color: "#3498db", // Cor do ícone
  },
  picker: {
    flex: 1, // Ajusta o tamanho do Picker para ocupar o espaço disponível
    height: 60, // Define a altura do Picker
    borderRadius: 8, // Bordas arredondadas
    paddingHorizontal: 10, // Espaçamento interno horizontal
    borderWidth: 1, // Espessura da borda
    borderColor: "#ccc", // Cor da borda
    color: "#2c3e50", // Cor do texto
  },

  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#2c3e50",
  },

  buttonDisabled: {
    backgroundColor: "#87CEEB",
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

  iconSettings: {
    alignItems: "flex-start", // Espaçamento à direita da engrenagem
    color: "#3498db", // Cor do ícone
    padding: 0,
    marginBottom: 32,
  },

  titleTurma: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
    padding: 0,
    marginBottom: 32,
  },

  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#ecf0f1",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  lottie: {
    width: 150,
    height: 150,
  },

});
