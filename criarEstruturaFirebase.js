import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAJwTE_5lajcClq-RYP8OvcO6m4xsrTvZY",
    authDomain: "instrutores-2ae1b.firebaseapp.com",
    projectId: "instrutores-2ae1b",
    storageBucket: "instrutores-2ae1b.firebasestorage.app",
    messagingSenderId: "171421264705",
    appId: "1:171421264705:android:762c47a20dcf60e88f8fc0",
  };
  

// Inicializar Firebase e Firestore
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

// variáveis globais //
const paisId = "Brasil";
const estadoId = "Rio de Janeiro";
const cidadeId = "Rio de Janeiro";


const criarEstruturaFirebase = async () => {
  try {
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////// ADICIONANDO TODAS AS PALESTRAS ////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Criar coleção de palestras fixas
    const palestras = [
        { palestraId: "01", nome: { pt: "O que é Gnosis", en: "What is Gnosis", es: "Qué es Gnosis" } },
        { palestraId: "02", nome: { pt: "Personalidade, Essência e Ego", en: "Personality, Essence, and Ego", es: "Personalidad, Esencia y Ego" } },
        { palestraId: "03", nome: { pt: "Despertar da Consciência", en: "Awakening of Consciousness", es: "Despertar de la Conciencia" } },
        { palestraId: "04", nome: { pt: "O Eu Psicológico", en: "The Psychological Self", es: "El Yo Psicológico" } },
        { palestraId: "05", nome: { pt: "Luz, Calor e Som", en: "Light, Heat, and Sound", es: "Luz, Calor y Sonido" } },
        { palestraId: "06", nome: { pt: "A Máquina Humana", en: "The Human Machine", es: "La Máquina Humana" } },
        { palestraId: "07", nome: { pt: "O Mundo das Relações", en: "The World of Relations", es: "El Mundo de las Relaciones" } },
        { palestraId: "08", nome: { pt: "O Caminho e a Vida", en: "The Path and Life", es: "El Camino y la Vida" } },
        { palestraId: "09", nome: { pt: "O Nível de Ser", en: "The Level of Being", es: "El Nivel del Ser" } },
        { palestraId: "10", nome: { pt: "O Decálogo", en: "The Decalogue", es: "El Decálogo" } },
        { palestraId: "11", nome: { pt: "Educação Fundamental", en: "Fundamental Education", es: "Educación Fundamental" } },
        { palestraId: "12", nome: { pt: "A Árvore Genealógica das Religiões", en: "The Genealogical Tree of Religions", es: "El Árbol Genealógico de las Religiones" } },
        { palestraId: "13", nome: { pt: "Evolução, Involução e Revolução", en: "Evolution, Involution, and Revolution", es: "Evolución, Involución y Revolución" } },
        { palestraId: "14", nome: { pt: "O Raio da Morte", en: "The Ray of Death", es: "El Rayo de la Muerte" } },
        { palestraId: "15", nome: { pt: "Reencarnação, Retorno e Recorrência", en: "Reincarnation, Return, and Recurrence", es: "Reencarnación, Retorno y Recurrencia" } },
        { palestraId: "16", nome: { pt: "A Balança da Justiça", en: "The Scales of Justice", es: "La Balanza de la Justicia" } },
        { palestraId: "17", nome: { pt: "Os 4 Caminhos", en: "The 4 Paths", es: "Los 4 Caminos" } },
        { palestraId: "18", nome: { pt: "Diagrama Interno do Homem", en: "Internal Diagram of Man", es: "Diagrama Interno del Hombre" } },
        { palestraId: "19", nome: { pt: "A Transformação da Energia", en: "The Transformation of Energy", es: "La Transformación de la Energía" } },
        { palestraId: "20", nome: { pt: "Os Elementais", en: "The Elementals", es: "Los Elementales" } },
        { palestraId: "21", nome: { pt: "Os 4 Estados de Consciência", en: "The 4 States of Consciousness", es: "Los 4 Estados de Conciencia" } },
        { palestraId: "22", nome: { pt: "A Iniciação", en: "The Initiation", es: "La Iniciación" } },
        { palestraId: "23", nome: { pt: "A Santa Igreja Gnóstica", en: "The Holy Gnostic Church", es: "La Santa Iglesia Gnóstica" } },
    ];
    
    for (const palestra of palestras) {
      await setDoc(doc(firestore, `palestras`, palestra.palestraId), palestra);
    }
    console.log("Palestras fixas adicionadas!");

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////// ADICIONANDO Estrutura por país ////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    try {
        // Criar país
        await setDoc(doc(firestore, `paises`, paisId), { nome: paisId });
        console.log(`País '${paisId}' adicionado!`);

        // Criar estado
        const estadoPath = `paises/${paisId}/estados`;
        await setDoc(doc(firestore, estadoPath, estadoId), { nome: estadoId });
        console.log(`Estado '${estadoId}' adicionado!`);

        // Criar cidade
        const cidadePath = `paises/${paisId}/estados/${estadoId}/cidades`;
        await setDoc(doc(firestore, cidadePath, cidadeId), { nome: cidadeId });
        console.log(`Cidade '${cidadeId}' adicionada!`);
    } catch (error) {
        console.error("Erro ao criar a estrutura de país, estado e cidade:", error);
    }


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////// ADICIONANDO as turmas //////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Criar a turma
        console.log(`Criando Turma ...`);
        const turmaId = "T001";
    
        try {
            //             paises/${paisId}/estados/${estadoId}/cidades/${cidadeId}/turmas
        const turmaPath = `paises/${paisId}/estados/${estadoId}/cidades/${cidadeId}/turmas`;
        console.log(`turmaPath: '${turmaPath}'`);
        await setDoc(doc(firestore, turmaPath, turmaId), {
            local: "Tijuca", // Local da turma
            dias: "Segunda-feira e Quarta-feira", // Dias em que a turma ocorre
            horario: "19h", // Horário inicial da turma
            responsavel: "Jonas", // Nome do responsável pela turma
            tema: "Introdução à Gnosis", // Opcional: Tema de abertura
            obs: "", // Opcional: Observações adicionais
        });
        console.log(`Turma '${turmaId}' adicionada com informações completas!`);
        } catch (error) {
        console.error("Erro ao criar a turma:", error);
    }
  

      ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////// ADICIONANDO dados das turmas, vinculando com as palestras e criando campos para instrutor e data //////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    try {
        // Lista de IDs das palestras
        const palestras = [
        "01", "02", "03", "04", "05", "06", "07", "08", "09", "10",
        "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
        "21", "22", "23"
        ];

        for (const palestraId of palestras) {
        // Recuperar os dados da palestra selecionada
        const palestraRef = doc(firestore, `palestras`, palestraId);
        const palestraSnap = await getDoc(palestraRef);

        if (!palestraSnap.exists()) {
            console.error(`Palestra com ID '${palestraId}' não encontrada.`);
            continue; // Pula para a próxima palestra
        }

        const palestraData = palestraSnap.data();

        // Criar palestra dentro da turma
        await setDoc(
            //    const turmaPath = `paises/${paisId}/estados/${estadoId}/cidades/${cidadeId}/turmas`;
                     doc(firestore, `paises/${paisId}/estados/${estadoId}/cidades/${cidadeId}/turmas/${turmaId}/palestras`, palestraId),
            {
            ...palestraData, // Reutiliza os dados da palestra
            instrutor: "", // Campo para instrutor será preenchido posteriormente
            data: "", // Campo para data será preenchido posteriormente
            }
        );
        console.log(`Palestra '${palestraId}' adicionada na turma '${turmaId}' com campos para instrutor e data.`);
        }
        console.log("Todas as palestras foram adicionadas!");
    } catch (error) {
        console.error("Erro ao criar palestras dentro da turma:", error);
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////// ADICIONANDO dados de alunos e criando estrutura de presença dentro de palestras //////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    try {
        // Lista de IDs das palestras
        const palestras = [
            "01", "02", "03", "04", "05", "06", "07", "08", "09", "10",
            "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
            "21", "22", "23"
        ];
    
        // Alunos da turma
        const alunos = [
            { alunoId: "A001", nome: "Carlos Silva", whatsapp: "11987654321" },
            { alunoId: "A002", nome: "Ana Santos", whatsapp: "11998765432" },
            { alunoId: "A003", nome: "João Oliveira", whatsapp: "11976543210" },
        ];
    
        // Adicionar alunos na turma
        for (const aluno of alunos) {
            await setDoc(
                doc(
                    firestore,
                    `paises/${paisId}/estados/${estadoId}/cidades/${cidadeId}/turmas/${turmaId}/alunos`,
                    aluno.alunoId
                ),
                {
                    nome: aluno.nome,
                    whatsapp: aluno.whatsapp,
                }
            );
            console.log(`Aluno '${aluno.nome}' adicionado à turma '${turmaId}'!`);
        }
    
        // Adicionar estrutura de palestras e presenças
        for (const palestraId of palestras) {
            // Recuperar os dados da palestra
            const palestraRef = doc(firestore, `palestras`, palestraId);
            const palestraSnap = await getDoc(palestraRef);
    
            if (!palestraSnap.exists()) {
                console.error(`Palestra com ID '${palestraId}' não encontrada.`);
                continue; // Pula para a próxima palestra
            }
    
            const palestraData = palestraSnap.data();
    
            // Criar a palestra dentro da turma
            await setDoc(
                doc(firestore, `paises/${paisId}/estados/${estadoId}/cidades/${cidadeId}/turmas/${turmaId}/palestras`, palestraId),
                {
                    ...palestraData,
                    instrutor: "",
                    data: "",
                }
            );
            console.log(`Palestra '${palestraId}' adicionada na turma '${turmaId}' com campos para instrutor e data.`);
    
            // Criar a subcoleção de presenças
            for (const aluno of alunos) {
                await setDoc(
                    doc(
                        firestore,
                        `paises/${paisId}/estados/${estadoId}/cidades/${cidadeId}/turmas/${turmaId}/palestras/${palestraId}/presenca`,
                        aluno.alunoId
                    ),
                    {
                        alunoId: aluno.alunoId,
                        status: "ausente", // Presença inicial
                    }
                );
                console.log(`Presença do aluno '${aluno.alunoId}' adicionada para a palestra '${palestraId}'!`);
            }
        }
    
        console.log("Estrutura completa de palestras e presenças criada com sucesso!");
    } catch (error) {
        console.error("Erro ao criar estrutura completa:", error);
    }
    console.log("Tudo foi adicionado corretamente");
  } catch (error) {
    console.error("Erro ao criar estrutura completa:", error);
  }


};

criarEstruturaFirebase();
