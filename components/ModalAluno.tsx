import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { globalStyles } from "../styles/globalStyles";

// Interface para o Modal de Detalhes
interface ModalDetalhesAlunoProps {
  aluno: {
    id: string;
    nome: string;
    whatsapp?: string;
    status: "presente" | "ausente" | "desativado";
  } | null;
  palestraTitulo: string;
  turmaId: string;
  visibleDetalhes: boolean;
  fecharDetalhes: () => void;
  router: any;
}

// Interface para o Modal de Opções
interface ModalOpcoesAlunoProps {
  aluno: {
    id: string;
    nome: string;
    codigoPais?: string; // Adicione essa propriedade
    whatsapp?: string;
    status: "presente" | "ausente" | "desativado";
  } | null;
  palestraTitulo: string;
  turmaId: string;
  visibleOpcoes: boolean;
  fecharOpcoes: () => void;
  
  abrirWhatsApp: (
    codigoPais?: string,
    whatsapp?: string,
    alunoNome?: string,
    tipoMensagem?: "conversa" | "resumo" | "motivacao",
    palestraTitulo?: string
  ) => void;
  desativarAlunoEmTodasAulas: (alunoId: string) => Promise<void>;
}

// Modal para detalhes do aluno
export const ModalDetalhesAluno: React.FC<ModalDetalhesAlunoProps> = ({
  aluno,
  turmaId,
  visibleDetalhes,
  fecharDetalhes,
  router,
}) => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={visibleDetalhes}
    onRequestClose={fecharDetalhes}
  >
    <TouchableWithoutFeedback onPress={fecharDetalhes}>
      <View style={globalStyles.modalContainer}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={globalStyles.modalContent}>
            {aluno && (
              <>
                <Text style={globalStyles.modalTitle}>Informações do Aluno</Text>
                <Text style={globalStyles.modalText}>Nome: {aluno.nome}</Text>
                <Text style={globalStyles.modalText}>
                  WhatsApp: {aluno.whatsapp || "Não informado"}
                </Text>
                <Text style={globalStyles.modalText}>Status: {aluno.status}</Text>

                <View style={globalStyles.buttonsContainer}>
                  <TouchableOpacity
                    style={globalStyles.iconButton}
                    onPress={fecharDetalhes}
                  >
                    <MaterialIcons
                      name="arrow-back"
                      size={24}
                      color="#3498db"
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={globalStyles.buttonAluno}
                    onPress={() => {
                      if (aluno?.id) {
                        fecharDetalhes();
                        router.push({
                          pathname: "/InserirAluno",
                          params: { alunoId: aluno.id, turmaId },
                        });
                      } else {
                        console.error("Erro", "Aluno não selecionado.");
                      }
                    }}
                  >
                    <Text style={globalStyles.buttonText}>Editar Aluno</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  </Modal>
);

// Modal para opções do aluno
export const ModalOpcoesAluno: React.FC<ModalOpcoesAlunoProps> = ({
  aluno,
  palestraTitulo,
  turmaId,
  visibleOpcoes,
  fecharOpcoes,
  abrirWhatsApp,
  desativarAlunoEmTodasAulas,
}) => (
  <Modal
    transparent={true}
    animationType="slide"
    visible={visibleOpcoes}
    onRequestClose={fecharOpcoes}
  >
    <TouchableWithoutFeedback onPress={fecharOpcoes}>
      <View style={globalStyles.modalContainer}>
        <View style={globalStyles.modalContent}>
          {aluno && (
            <>
              <Text style={globalStyles.modalTitle}>
                O que deseja fazer com {aluno.nome}?
              </Text>

              <TouchableOpacity
                style={globalStyles.modalButton}
                onPress={() =>
                  abrirWhatsApp(
                    aluno.codigoPais,
                    aluno.whatsapp,
                    aluno.nome,
                    "conversa",
                    palestraTitulo
                  )
                }
              >
                <Text style={globalStyles.modalButtonText}>
                  Conversar com {aluno.nome}?
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={globalStyles.modalButton}
                onPress={() =>
                  abrirWhatsApp(
                    aluno.codigoPais,
                    aluno.whatsapp,
                    aluno.nome,
                    "resumo",
                    palestraTitulo
                  )
                }
              >
                <Text style={globalStyles.modalButtonText}>
                  Enviar resumo para {aluno.nome}?
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={globalStyles.modalButton}
                onPress={() =>
                  abrirWhatsApp(
                    aluno.codigoPais,
                    aluno.whatsapp,
                    aluno.nome,
                    "motivacao",
                    palestraTitulo
                  )
                }
              >
                <Text style={globalStyles.modalButtonText}>
                  Enviar motivação para {aluno.nome}?
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  globalStyles.modalButton,
                  globalStyles.modalButtonDanger,
                ]}
                onPress={() =>
                  Alert.alert(
                    "⚠️ DESATIVAÇÃO PERMANENTE",
                    `Você tem certeza que deseja desativar ${aluno.nome}?`,
                    [
                      { text: "Cancelar", style: "cancel" },
                      {
                        text: "Confirmar",
                        onPress: () => desativarAlunoEmTodasAulas(aluno.id),
                      },
                    ],
                    { cancelable: true }
                  )
                }
              >
                <Text style={globalStyles.modalButtonText}>
                  Desativar {aluno.nome}?
                </Text>
              </TouchableOpacity>

              {/* Botão de Voltar com ícone */}

              <TouchableOpacity
                    style={globalStyles.iconButton}
                    onPress={fecharOpcoes}
                  >
                    <MaterialIcons
                      name="arrow-back"
                      size={24}
                      color="#3498db"
                    />
                  </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  </Modal>
);
