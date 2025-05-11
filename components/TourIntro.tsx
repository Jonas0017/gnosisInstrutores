import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useRef, useEffect, useState } from "react";
import { View, Text, Image, Animated, TouchableOpacity, StyleSheet } from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";

//AsyncStorage.removeItem("tourCompleted").then(() => console.log("Tour resetado!"));


interface TourIntroProps {
    onFinish: () => void;
}

const slides = [
    {
        key: "1",
        title: "Configuração Inicial",
        text: "Os dados demográficos são necessários para organizar e segmentar as turmas.",
        image: require("../assets/tutorial/001dadosDemograficos.jpeg"),
        backgroundColor: "#3498db",
    },
    {
        key: "2",
        title: "Cadastro Pessoal",
        text: "Da mesma forma, os dados pessoais, incluindo CPF e WhatsApp.",
        image: require("../assets/tutorial/002dadosPessoais.jpeg"),
        backgroundColor: "#3498db",
    },
    {
        key: "3",
        title: "Login",
        text: "Nosso login protege os dados sensíveis das turmas e alunos.",
        image: require("../assets/tutorial/003login.jpeg"),
        backgroundColor: "#3498db",
    },
    {
        key: "4",
        title: "Lista de Turmas",
        text: "As turmas estão organizadas por instrutor.",
        image: require("../assets/tutorial/004listaTurmas.jpeg"),
        backgroundColor: "#3498db",
    },
    {
        key: "5",
        title: "Lista de Turmas",
        text: "Você pode adicionar uma nova turma pressionando o botão mais.",
        image: require("../assets/tutorial/005listaTurmas.jpeg"),
        backgroundColor: "#3498db",
    },
    {
        key: "6",
        title: "Lista de Turmas",
        text: "Ou editar os dados pessoais e demográficos clicando na engrenagem.",
        image: require("../assets/tutorial/006listaTurmas.jpeg"),
        backgroundColor: "#3498db",
    },
    {
        key: "7",
        title: "Configurações",
        text: "Ajuste suas informações pessoais e dados demográficos, essa tela abre ao clicar na engrenagem da tela anterior.",
        image: require("../assets/tutorial/configuracoes.jpeg"),
        backgroundColor: "#3498db",
    },
    {
        key: "8",
        title: "Editando o perfil",
        text: "Um clique simples sobre as configurações pessoais ou demográficas lhe permite editá-las.",
        image: require("../assets/tutorial/editarDadosPessoais.jpeg"),
        backgroundColor: "#3498db",
    },
    {
        key: "9",
        title: "Lista de Turmas",
        text: "Toque no nome do instrutor desejado para acessar suas turmas.",
        image: require("../assets/tutorial/007listaTurmas.jpeg"),
        backgroundColor: "#3498db",
    },
    {
        key: "10",
        title: "Lista de Turmas",
        text: "Você deve selecionar o ano que deseja para visualizar as turmas.",
        image: require("../assets/tutorial/00502listaTurmas.jpeg"),
        backgroundColor: "#3498db",
    },
    {
        key: "11",
        title: "Lista de Turmas",
        text: "Agora sim podemos visualizar as turmas.",
        image: require("../assets/tutorial/00603listaTurmas.jpeg"),
        backgroundColor: "#3498db",
    },
    {
        key: "12",
        title: "Alterar ou Remover Turma",
        text: "Um toque longo sobre a turma te permite alterar ou remover a turma selecionada.",
        image: require("../assets/tutorial/removerTurma.jpeg"),
        backgroundColor: "#3498db",
    },
    {
        key: "13",
        title: "Lista de Turmas",
        text: "Um toque simples sobre a turma te permite visualizar seus alunos.",
        image: require("../assets/tutorial/00603listaTurmasTc.jpeg"),
        backgroundColor: "#3498db",
    },
    {
        key: "14",
        title: "Alunos",
        text: "Os alunos dessa turma estarão listados aqui.",
        image: require("../assets/tutorial/alunos.jpeg"),
        backgroundColor: "#3498db",
    },
    {
        key: "15",
        title: "Alunos",
        text: "Para adicionar um novo aluno você deve clicar no botão mais.",
        image: require("../assets/tutorial/alunosMais.jpeg"),
        backgroundColor: "#3498db",
    },
    {
        key: "16",
        title: "Alunos",
        text: "A presença do aluno pode ser facilmente inserida clicando sobre o botão ausente.",
        image: require("../assets/tutorial/alunosPresenca.jpeg"),
        backgroundColor: "#3498db",
    },
    // mostrar a presença funcionando
    {
        key: "17",
        title: "Alunos",
        text: "Para editar os status do aluno podemos selecionar o ícone de edição.",
        image: require("../assets/tutorial/alunosEditPresenca.jpeg"),
        backgroundColor: "#3498db",
    },
    {
        key: "18",
        title: "Status do Aluno",
        text: "Esse ponto é muito importante para adicionar reposições e para alterar quem deu a aula nesse dia.",
        image: require("../assets/tutorial/presencaAluno.jpeg"),
        backgroundColor: "#3498db",
    },

    {
        key: "19",
        title: "Status do Aluno",
        text: "Caso necessário também é possível ajustar a data da aula para cada aluno.",
        image: require("../assets/tutorial/presencaAlunoData.jpeg"),
        backgroundColor: "#3498db",
    },


    {
        key: "20",
        title: "Editar Aluno",
        text: "Um clique simples sobre o aluno te permite editá-lo.",
        image: require("../assets/tutorial/editarAluno.jpeg"),
        backgroundColor: "#3498db",
    },
    ///
    {
        key: "21",
        title: "Alunos",
        text: "Um clique longo sobre o aluno te permite visualizar um menu avançado com infinitas possibilidades.",
        image: require("../assets/tutorial/alunosCLong.jpeg"),
        backgroundColor: "#3498db",
    },
    {
        key: "22",
        title: "Funções do Aluno",
        text: "Tais como, o envio de mensagens personalizadas, resumos, etc.",
        image: require("../assets/tutorial/funcoesAlunos.jpeg"),
        backgroundColor: "#3498db",
    },
    {
        key: "23",
        title: "⚠️ Fique atento! ⚠️",
        text: "A função desativar aluno desabilita o mesmo em todas as aulas.",
        image: require("../assets/tutorial/funcoesAlunosRemover.jpeg"),
        backgroundColor: "#3498db",
    },
    {
        key: "24",
        title: "Alunos",
        text: "Por fim, você pode eleger a palestra rapidamente acessando o menu superior.",
        image: require("../assets/tutorial/alunosPalestras.jpeg"),
        backgroundColor: "#3498db",
    },
    {
        key: "25",
        title: "Lista de Palestras",
        text: "Escolha a palestra correspondente e aproveite sua experiência!",
        image: require("../assets/tutorial/palestras.jpeg"),
        backgroundColor: "#3498db",
    },

];

const TourIntro: React.FC<TourIntroProps> = ({ onFinish }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const sliderRef = useRef<AppIntroSlider>(null);

    const handleSlideChange = (index: number) => {
        setActiveIndex(index);
    };

    const goToSlide = (index: number) => {
        if (sliderRef.current) {
            setTimeout(() => {
                sliderRef.current?.goToSlide(index, true);
                setActiveIndex(index);
            }, 100); // Pequeno delay para evitar cliques ignorados
        }
    };

    // **Componente do Dot Animado**
    const Dot = ({ isActive }: { isActive: boolean }) => {
        const scaleAnim = new Animated.Value(isActive ? 1.3 : 1);

        useEffect(() => {
            Animated.timing(scaleAnim, {
                toValue: isActive ? 1.3 : 1,
                duration: 200,
                useNativeDriver: true,
            }).start();
        }, [isActive]);

        return (
            <Animated.View
                style={[
                    styles.dot,
                    isActive && styles.activeDot,
                    { transform: [{ scale: scaleAnim }] },
                ]}
            />
        );
    };
    // **Componente de Paginação Atualizado**
    const renderPagination = (activeIndex: number, goToSlide: (index: number) => void) => {
        return (
            <View style={styles.paginationContainer}>
                {/* Botão "Voltar" */}
                {activeIndex > 0 ? (
                    <TouchableOpacity style={styles.button} onPress={() => goToSlide(activeIndex - 1)}>
                        <Text style={styles.buttonText}>Voltar</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.buttonPlaceholder} />
                )}

                {/* Dots da Paginação com Animação */}
                <View style={styles.dotsContainer}>
                    {slides.map((_, index) => {
                        if (Math.abs(activeIndex - index) > 2) return null;
                        return <Dot key={index} isActive={activeIndex === index} />;
                    })}
                </View>

                {/* Botão "Próximo" ou "Concluir" */}
                {activeIndex === slides.length - 1 ? (
                    <TouchableOpacity style={styles.button} onPress={onFinish}>
                        <Text style={styles.buttonText}>Concluir</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.button} onPress={() => goToSlide(activeIndex + 1)}>
                        <Text style={styles.buttonText}>Próximo</Text>
                    </TouchableOpacity>
                )}

            </View>
        );
    };

    const renderItem = ({ item }: { item: typeof slides[number] }) => (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: item.backgroundColor }}>
            <Image source={item.image} style={{ width: 250, height: 450, resizeMode: "contain" }} />
            <Text style={{ fontSize: 22, fontWeight: "bold", color: "#fff", marginTop: 20 }}>{item.title}</Text>
            <Text style={{ fontSize: 16, color: "#fff", textAlign: "center", marginTop: 10, paddingHorizontal: 20 }}>
                {item.text}
            </Text>
        </View>
    );

    return (
        <View style={{ flex: 1 }}>
            <AppIntroSlider
                ref={sliderRef}
                renderItem={renderItem}
                data={slides}
                onSlideChange={handleSlideChange}
                onDone={onFinish}
                showPrevButton={true}
                renderPagination={(index) => renderPagination(index, (i) => sliderRef.current?.goToSlide(i))}
            />
        </View>
    );
};

// **Estilos**
const styles = StyleSheet.create({
    paginationContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        position: "absolute",
        bottom: 30,
        width: "100%",
        paddingHorizontal: 20,
    },
    button: {
        padding: 12,
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        minWidth: 80,
    },
    buttonPlaceholder: {
        width: 80, // Para manter alinhamento quando não há botão "Voltar"
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#fff",
    },
    dotsContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 4,
        marginHorizontal: 4,
        backgroundColor: "#bbb", // Cinza por padrão
    },
    activeDot: {
        width: 10, // Maior que os outros
        height: 10,
        borderRadius: 6,
        backgroundColor: "#fff", // Ativo fica branco
    },
});

export default TourIntro;