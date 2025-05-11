///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////      para criar a estrutura inicial entre na pasta e digite o seguinte código .... //////////////////////////////
/////////////////      node criarEstruturaFirebase.js                                                //////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.FIREBASE_API_KEY,
  authDomain: Constants.expoConfig?.extra?.FIREBASE_AUTH_DOMAIN,
  projectId: Constants.expoConfig?.extra?.FIREBASE_PROJECT_ID,
  storageBucket: Constants.expoConfig?.extra?.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: Constants.expoConfig?.extra?.FIREBASE_MESSAGING_SENDER_ID,
  appId: Constants.expoConfig?.extra?.FIREBASE_APP_ID,
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

    const dados = [
        { estado: "Baden-Württemberg", pais: "Alemania" },
        { estado: "Bayern", pais: "Alemania" },
        { estado: "Berlin", pais: "Alemania" },
        { estado: "Deutschland", pais: "Alemania" },
        { estado: "Hamburg", pais: "Alemania" },
        { estado: "Hessen", pais: "Alemania" },
        { estado: "Niedersachsen", pais: "Alemania" },
        { estado: "Nordrhein-Westfalen", pais: "Alemania" },
        { estado: "Luanda", pais: "Angola" },
        { estado: "Bonaire", pais: "Antillas Holandesas" },
        { estado: "BUENOS AIRES (Capital Federal)", pais: "Argentina" },
        { estado: "BUENOS AIRES (Gran Bs. As.) 19374", pais: "Argentina" },
        { estado: "BUENOS AIRES (Pcia de Bs. As.)", pais: "Argentina" },
        { estado: "CATAMARCA", pais: "Argentina" },
        { estado: "CHACO", pais: "Argentina" },
        { estado: "CHUBUT", pais: "Argentina" },
        { estado: "CORDOBA", pais: "Argentina" },
        { estado: "CORRIENTES", pais: "Argentina" },
        { estado: "ENTRE RIOS", pais: "Argentina" },
        { estado: "FORMOSA", pais: "Argentina" },
        { estado: "JUJUY", pais: "Argentina" },
        { estado: "LA PAMPA", pais: "Argentina" },
        { estado: "LA RIOJA", pais: "Argentina" },
        { estado: "MENDOZA", pais: "Argentina" },
        { estado: "MISIONES", pais: "Argentina" },
        { estado: "NEUQUEN", pais: "Argentina" },
        { estado: "RIO NEGRO", pais: "Argentina" },
        { estado: "SALTA", pais: "Argentina" },
        { estado: "SAN JUAN", pais: "Argentina" },
        { estado: "SAN LUIS", pais: "Argentina" },
        { estado: "SANTA CRUZ", pais: "Argentina" },
        { estado: "SANTA FE", pais: "Argentina" },
        { estado: "SANTIAGO DEL ESTERO", pais: "Argentina" },
        { estado: "TIERRA DEL FUEGO", pais: "Argentina" },
        { estado: "TUCUMAN", pais: "Argentina" },
        { estado: "Oranjestad", pais: "Aruba" },
        { estado: "Sydney", pais: "Australia" },
        { estado: "Distrito de Daca", pais: "Bangladesh" },
        { estado: "Bruselas-Capital", pais: "Belgica" },
        { estado: "Beni", pais: "Bolivia" },
        { estado: "Cercado", pais: "Bolivia" },
        { estado: "Chuquisaca", pais: "Bolivia" },
        { estado: "Cochabamba", pais: "Bolivia" },
        { estado: "La Paz", pais: "Bolivia" },
        { estado: "Oruro", pais: "Bolivia" },
        { estado: "Potosí", pais: "Bolivia" },
        { estado: "Santa Cruz", pais: "Bolivia" },
        { estado: "Tarija", pais: "Bolivia" },
        { estado: "Tupiza", pais: "Bolivia" },
        { estado: "Acre", pais: "Brasil" },
        { estado: "Alagoas", pais: "Brasil" },
        { estado: "Amapá", pais: "Brasil" },
        { estado: "Amazonas", pais: "Brasil" },
        { estado: "Bahia", pais: "Brasil" },
        { estado: "Ceará", pais: "Brasil" },
        { estado: "Distrito Federal", pais: "Brasil" },
        { estado: "Espírito Santo", pais: "Brasil" },
        { estado: "Goiás", pais: "Brasil" },
        { estado: "Maranhão", pais: "Brasil" },
        { estado: "Mato Grosso", pais: "Brasil" },
        { estado: "Mato Grosso do Sul", pais: "Brasil" },
        { estado: "Minas Gerais", pais: "Brasil" },
        { estado: "Paraná", pais: "Brasil" },
        { estado: "Paraíba", pais: "Brasil" },
        { estado: "Pará", pais: "Brasil" },
        { estado: "Pernambuco", pais: "Brasil" },
        { estado: "Piauí", pais: "Brasil" },
        { estado: "Rio de Janeiro", pais: "Brasil" },
        { estado: "Rio Grande do Norte", pais: "Brasil" },
        { estado: "Rio Grande do Sul", pais: "Brasil" },
        { estado: "Rondônia", pais: "Brasil" },
        { estado: "Roraima", pais: "Brasil" },
        { estado: "Santa Catarina", pais: "Brasil" },
        { estado: "Sergipe", pais: "Brasil" },
        { estado: "São Paulo", pais: "Brasil" },
        { estado: "Tocantins", pais: "Brasil" },
        { estado: "Timbu", pais: "Bután" },
        { estado: "Columbia Britanica", pais: "Canadá" },
        { estado: "Ontario", pais: "Canadá" },
        { estado: "Quebec", pais: "Canadá" },
        { estado: "Antofagasta", pais: "Chile" },
        { estado: "Arica", pais: "Chile" },
        { estado: "Atacama", pais: "Chile" },
        { estado: "Aysén del General Carlos Ibáñez del Campo", pais: "Chile" },
        { estado: "Bio Bio", pais: "Chile" },
        { estado: "BioBio", pais: "Chile" },
        { estado: "Cautín", pais: "Chile" },
        { estado: "Chile", pais: "Chile" },
        { estado: "chillan", pais: "Chile" },
        { estado: "Chiloé", pais: "Chile" },
        { estado: "Colchagua", pais: "Chile" },
        { estado: "Concepción", pais: "Chile" },
        { estado: "coquimbo", pais: "Chile" },
        { estado: "Cordillera", pais: "Chile" },
        { estado: "Diguillín", pais: "Chile" },
        { estado: "Elqui", pais: "Chile" },
        { estado: "La Araucanía", pais: "Chile" },
        { estado: "Linares", pais: "Chile" },
        { estado: "los lagos", pais: "Chile" },
        { estado: "Los Ríos", pais: "Chile" },
        { estado: "Magallanes", pais: "Chile" },
        { estado: "Magallanes y la Antártica Chilena", pais: "Chile" },
        { estado: "Maipo", pais: "Chile" },
        { estado: "Marga-Marga", pais: "Chile" },
        { estado: "Maule", pais: "Chile" },
        { estado: "Melipilla", pais: "Chile" },
        { estado: "Metropilitana", pais: "Chile" },
        { estado: "O'Higgins", pais: "Chile" },
        { estado: "Provincia de Copiapó", pais: "Chile" },
        { estado: "Provincia de Santiago", pais: "Chile" },
        { estado: "Región de Los Rios", pais: "Chile" },
        { estado: "Santiago", pais: "Chile" },
        { estado: "Santiago centro", pais: "Chile" },
        { estado: "Talca", pais: "Chile" },
        { estado: "Tarapaca", pais: "Chile" },
        { estado: "Valdivia", pais: "Chile" },
        { estado: "Valparaíso", pais: "Chile" },
        { estado: "Youtube", pais: "Chile" },
        { estado: "Ñuble", pais: "Chile" },
        { estado: "Amazonas", pais: "Colombia" },
        { estado: "Antioquia", pais: "Colombia" },
        { estado: "Arauca", pais: "Colombia" },
        { estado: "Atlántico", pais: "Colombia" },
        { estado: "Bello - Antioquia", pais: "Colombia" },
        { estado: "Bolivar", pais: "Colombia" },
        { estado: "Bolívar CO", pais: "Colombia" },
        { estado: "Boyacá", pais: "Colombia" },
        { estado: "Caldas", pais: "Colombia" },
        { estado: "Caldas, Riosucio", pais: "Colombia" },
        { estado: "Caquetá", pais: "Colombia" },
        { estado: "Casanare", pais: "Colombia" },
        { estado: "Cauca", pais: "Colombia" },
        { estado: "Cesar", pais: "Colombia" },
        { estado: "Choco", pais: "Colombia" },
        { estado: "Colombia", pais: "Colombia" },
        { estado: "Costa Norte", pais: "Colombia" },
        { estado: "Costa Sur", pais: "Colombia" },
        { estado: "Cundinamarca", pais: "Colombia" },
        { estado: "Córdoba", pais: "Colombia" },
        { estado: "Guajira", pais: "Colombia" },
        { estado: "Guaviare", pais: "Colombia" },
        { estado: "Huila", pais: "Colombia" },
        { estado: "La Guajira", pais: "Colombia" },
        { estado: "Magdalena", pais: "Colombia" },
        { estado: "Meta", pais: "Colombia" },
        { estado: "Nariño", pais: "Colombia" },
        { estado: "Norte De Santander", pais: "Colombia" },
        { estado: "Putumayo", pais: "Colombia" },
        { estado: "Quindio", pais: "Colombia" },
        { estado: "Risaralda", pais: "Colombia" },
        { estado: "San Andres Isla", pais: "Colombia" },
        { estado: "San Gil - Santander", pais: "Colombia" },
        { estado: "Santander", pais: "Colombia" },
        { estado: "Saravena - Arauca", pais: "Colombia" },
        { estado: "Sucre", pais: "Colombia" },
        { estado: "Tolima", pais: "Colombia" },
        { estado: "Valle del Cauca", pais: "Colombia" },
        { estado: "Alajuela", pais: "Costa Rica" },
        { estado: "Cartago", pais: "Costa Rica" },
        { estado: "Guanacaste", pais: "Costa Rica" },
        { estado: "Guápiles", pais: "Costa Rica" },
        { estado: "Heredia", pais: "Costa Rica" },
        { estado: "Limon", pais: "Costa Rica" },
        { estado: "Puntarenas", pais: "Costa Rica" },
        { estado: "San José", pais: "Costa Rica" },
        { estado: "Curaçao", pais: "Curaçao" },
        { estado: "Capital", pais: "Dinamarca" },
        { estado: "Azuay", pais: "Ecuador" },
        { estado: "Bolivar", pais: "Ecuador" },
        { estado: "Carchi", pais: "Ecuador" },
        { estado: "Cañar", pais: "Ecuador" },
        { estado: "Chimborazo", pais: "Ecuador" },
        { estado: "comunidad palestina", pais: "Ecuador" },
        { estado: "Cotopaxi", pais: "Ecuador" },
        { estado: "Ecuador", pais: "Ecuador" },
        { estado: "El Oro", pais: "Ecuador" },
        { estado: "Esmeraldas", pais: "Ecuador" },
        { estado: "Francisco de Orellana", pais: "Ecuador" },
        { estado: "Guayas", pais: "Ecuador" },
        { estado: "Imbabura", pais: "Ecuador" },
        { estado: "Loja", pais: "Ecuador" },
        { estado: "Los Ríos", pais: "Ecuador" },
        { estado: "Manabí", pais: "Ecuador" },
        { estado: "Morona Santiago", pais: "Ecuador" },
        { estado: "Napo", pais: "Ecuador" },
        { estado: "Orellana", pais: "Ecuador" },
        { estado: "Pastaza", pais: "Ecuador" },
        { estado: "Pichincha", pais: "Ecuador" },
        { estado: "Provincia de Morona Santiago", pais: "Ecuador" },
        { estado: "Santa Elena", pais: "Ecuador" },
        { estado: "Shitig", pais: "Ecuador" },
        { estado: "Sucumbíos", pais: "Ecuador" },
        { estado: "Tsáchilas", pais: "Ecuador" },
        { estado: "Tungurahua", pais: "Ecuador" },
        { estado: "Yunganza", pais: "Ecuador" },
        { estado: "Zamora Chinchipe", pais: "Ecuador" },
        { estado: "Alexandria", pais: "Egipto" },
        { estado: "Cairo", pais: "Egipto" },
        { estado: "AHUACHAPAN", pais: "El Salvador" },
        { estado: "CUSCATLAN", pais: "El Salvador" },
        { estado: "LA LIBERTAD", pais: "El Salvador" },
        { estado: "LA UNION", pais: "El Salvador" },
        { estado: "MORAZAN", pais: "El Salvador" },
        { estado: "SAN MIGUEL", pais: "El Salvador" },
        { estado: "SAN SALVADOR", pais: "El Salvador" },
        { estado: "SANTA ANA", pais: "El Salvador" },
        { estado: "SONSONATE", pais: "El Salvador" },
        { estado: "USULUTAN", pais: "El Salvador" },
        { estado: "Edinburgh", pais: "Escocia" },
        { estado: "Albacete", pais: "España" },
        { estado: "Alicante", pais: "España" },
        { estado: "Almería", pais: "España" },
        { estado: "Andalucía", pais: "España" },
        { estado: "Asturias", pais: "España" },
        { estado: "Barcelona", pais: "España" },
        { estado: "Castilla", pais: "España" },
        { estado: "Cataluña", pais: "España" },
        { estado: "Cádiz", pais: "España" },
        { estado: "Fuerteventura, Canarias", pais: "España" },
        { estado: "Galicia", pais: "España" },
        { estado: "Granada-", pais: "España" },
        { estado: "Huesca", pais: "España" },
        { estado: "La Coruña", pais: "España" },
        { estado: "Las Palmas de Gran Canaria", pais: "España" },
        { estado: "Las Palmas de Gran Canarias", pais: "España" },
        { estado: "Las Palmas, Gran Canaria", pais: "España" },
        { estado: "Las palmas, Lanzarote", pais: "España" },
        { estado: "Lleida", pais: "España" },
        { estado: "Madrid", pais: "España" },
        { estado: "Malaga", pais: "España" },
        { estado: "Mallorca", pais: "España" },
        { estado: "Murcia", pais: "España" },
        { estado: "Navarra", pais: "España" },
        { estado: "País Vasco", pais: "España" },
        { estado: "Pontevedra", pais: "España" },
        { estado: "Principado de Asturias", pais: "España" },
        { estado: "SANT JOAN DESPI", pais: "España" },
        { estado: "Santa Cruz de Tenerife", pais: "España" },
        { estado: "Tarragona", pais: "España" },
        { estado: "Valencia", pais: "España" },
        { estado: "Vizcaya", pais: "España" },
        { estado: "Zamora", pais: "España" },
        { estado: "Zaragoza", pais: "España" },
        { estado: "Broward/N. Miami", pais: "Estados Unidos" },
        { estado: "California", pais: "Estados Unidos" },
        { estado: "Carolina del Norte", pais: "Estados Unidos" },
        { estado: "Colorado", pais: "Estados Unidos" },
        { estado: "Connecticut", pais: "Estados Unidos" },
        { estado: "Florida", pais: "Estados Unidos" },
        { estado: "Georgia", pais: "Estados Unidos" },
        { estado: "Illinois", pais: "Estados Unidos" },
        { estado: "Kansas", pais: "Estados Unidos" },
        { estado: "Maryland", pais: "Estados Unidos" },
        { estado: "Massachusetts", pais: "Estados Unidos" },
        { estado: "New Jersey", pais: "Estados Unidos" },
        { estado: "New York", pais: "Estados Unidos" },
        { estado: "Pennsylvania", pais: "Estados Unidos" },
        { estado: "Rhode Island", pais: "Estados Unidos" },
        { estado: "Texas", pais: "Estados Unidos" },
        { estado: "Utah", pais: "Estados Unidos" },
        { estado: "Auvergne", pais: "Francia" },
        { estado: "Auvergne Rhônes-Alpes", pais: "Francia" },
        { estado: "Haute-Garonne", pais: "Francia" },
        { estado: "Ile de France", pais: "Francia" },
        { estado: "Lorraine", pais: "Francia" },
        { estado: "Lyon", pais: "Francia" },
        { estado: "Nord", pais: "Francia" },
        { estado: "París", pais: "Francia" },
        { estado: "Pas-de-Calais", pais: "Francia" },
        { estado: "Provence-Alpes-Côte dAzur", pais: "Francia" },
        { estado: "Yvelines", pais: "Francia" },
        { estado: "Estuario", pais: "Gabón" },
        { estado: "Atica", pais: "Grecia" },
        { estado: "Guadeloupe", pais: "Guadeloupe" },
        { estado: "Ciudad de Guatemala", pais: "Guatemala" },
        { estado: "Escuintla", pais: "Guatemala" },
        { estado: "Jutiapa", pais: "Guatemala" },
        { estado: "Mazatenango, Guatemala", pais: "Guatemala" },
        { estado: "Mixco ,Guatemala", pais: "Guatemala" },
        { estado: "Quetzaltenango", pais: "Guatemala" },
        { estado: "Villa nueva", pais: "Guatemala" },
        { estado: "Zona 2 ciudad de Guatemala", pais: "Guatemala" },
        { estado: "Atlantida", pais: "Honduras" },
        { estado: "Choluteca", pais: "Honduras" },
        { estado: "Colón", pais: "Honduras" },
        { estado: "Comayagua", pais: "Honduras" },
        { estado: "Comayagua, Comayagua", pais: "Honduras" },
        { estado: "Copan", pais: "Honduras" },
        { estado: "Cortes", pais: "Honduras" },
        { estado: "Francisco Morazán", pais: "Honduras" },
        { estado: "Honduras", pais: "Honduras" },
        { estado: "La Ceiba", pais: "Honduras" },
        { estado: "La Esperanza, Intibucá", pais: "Honduras" },
        { estado: "Lempira", pais: "Honduras" },
        { estado: "Ocotepeque", pais: "Honduras" },
        { estado: "San Juan", pais: "Honduras" },
        { estado: "Santa Barbara", pais: "Honduras" },
        { estado: "Central Hungary", pais: "Hungría" },
        { estado: "Delhi", pais: "India" },
        { estado: "Dheli", pais: "India" },
        { estado: "Goa", pais: "India" },
        { estado: "Maharashtra", pais: "India" },
        { estado: "Uttar Pradesh", pais: "India" },
        { estado: "Leinster", pais: "Irlanda" },
        { estado: "Munster", pais: "Irlanda" },
        { estado: "Biella", pais: "Italia" },
        { estado: "Bologna", pais: "Italia" },
        { estado: "Cuneo", pais: "Italia" },
        { estado: "Emilia - Romaña", pais: "Italia" },
        { estado: "Ferrere D’Asti", pais: "Italia" },
        { estado: "Italia", pais: "Italia" },
        { estado: "Lacio", pais: "Italia" },
        { estado: "Lazio", pais: "Italia" },
        { estado: "Piamonte", pais: "Italia" },
        { estado: "Piemonte", pais: "Italia" },
        { estado: "Toscana", pais: "Italia" },
        { estado: "Japão", pais: "Japón" },
        { estado: "Kanto", pais: "Japón" },
        { estado: "Prefectura de ?ita", pais: "Japón" },
        { estado: "Beirut", pais: "Líbano" },
        { estado: "Aguascalientes", pais: "Mexico" },
        { estado: "Baja California Norte", pais: "Mexico" },
        { estado: "CDMX", pais: "Mexico" },
        { estado: "Celaya", pais: "Mexico" },
        { estado: "Chihuahua", pais: "Mexico" },
        { estado: "Coahuila", pais: "Mexico" },
        { estado: "Colima", pais: "Mexico" },
        { estado: "Estado de México", pais: "Mexico" },
        { estado: "Guanajuato", pais: "Mexico" },
        { estado: "Guerrero", pais: "Mexico" },
        { estado: "Heróica Cárdenas, Tabasco", pais: "Mexico" },
        { estado: "Hidalgo", pais: "Mexico" },
        { estado: "Irapuato Guanajuato", pais: "Mexico" },
        { estado: "Jalisco", pais: "Mexico" },
        { estado: "Michoacan, Mexico", pais: "Mexico" },
        { estado: "Michoacán", pais: "Mexico" },
        { estado: "Monasterio", pais: "Mexico" },
        { estado: "Monclova Coahuila", pais: "Mexico" },
        { estado: "Nayarit", pais: "Mexico" },
        { estado: "Nuevo Leon", pais: "Mexico" },
        { estado: "Puebla", pais: "Mexico" },
        { estado: "Pátzcuaro, Michoacán", pais: "Mexico" },
        { estado: "Querétaro", pais: "Mexico" },
        { estado: "Quintana Roo", pais: "Mexico" },
        { estado: "Río Verde, San Luis Potosí", pais: "Mexico" },
        { estado: "San Luis Potosí", pais: "Mexico" },
        { estado: "Sonora", pais: "Mexico" },
        { estado: "Tabasco", pais: "Mexico" },
        { estado: "Tlaxcala", pais: "Mexico" },
        { estado: "Veracruz", pais: "Mexico" },
        { estado: "Villahermosa Tabasco", pais: "Mexico" },
        { estado: "Maputo", pais: "Mozambique" },
        { estado: "ESTELI", pais: "Nicaragua" },
        { estado: "Granada", pais: "Nicaragua" },
        { estado: "León", pais: "Nicaragua" },
        { estado: "Managua", pais: "Nicaragua" },
        { estado: "Masaya", pais: "Nicaragua" },
        { estado: "Matagalpa", pais: "Nicaragua" },
        { estado: "Estado", pais: "Pais" },
        { estado: "Holanda Meridional", pais: "Países Bajos" },
        { estado: "Sindh", pais: "Pakistán" },
        { estado: "Coclé", pais: "Panama" },
        { estado: "La Chorrera, Arraijan", pais: "Panama" },
        { estado: "Panamá", pais: "Panama" },
        { estado: "Panamá Oeste", pais: "Panama" },
        { estado: "Panana Oeste", pais: "Panama" },
        { estado: "Veraguas", pais: "Panama" },
        { estado: "Amambay", pais: "Paraguay" },
        { estado: "Asunción", pais: "Paraguay" },
        { estado: "Caaguazu", pais: "Paraguay" },
        { estado: "Central", pais: "Paraguay" },
        { estado: "Ciudad del Este", pais: "Paraguay" },
        { estado: "Ciudad del Este, Alto Paraná", pais: "Paraguay" },
        { estado: "Concepción", pais: "Paraguay" },
        { estado: "Cordillera", pais: "Paraguay" },
        { estado: "Coronel Oviedo", pais: "Paraguay" },
        { estado: "Encarnación", pais: "Paraguay" },
        { estado: "Hernandarias, Alto Paraná", pais: "Paraguay" },
        { estado: "Itauguá", pais: "Paraguay" },
        { estado: "Lambaré, Paraguay", pais: "Paraguay" },
        { estado: "Minga Guazú, Alto Paraná", pais: "Paraguay" },
        { estado: "Paraguarí", pais: "Paraguay" },
        { estado: "Presidente Franco, Alto Paraná", pais: "Paraguay" },
        { estado: "San Lorenzo", pais: "Paraguay" },
        { estado: "Santa Rita", pais: "Paraguay" },
        { estado: "Villarica", pais: "Paraguay" },
        { estado: "Amazonas", pais: "Perú" },
        { estado: "Apurímac", pais: "Perú" },
        { estado: "Arequipa", pais: "Perú" },
        { estado: "Ayacucho", pais: "Perú" },
        { estado: "Cajamarca", pais: "Perú" },
        { estado: "Callao", pais: "Perú" },
        { estado: "Chanchamayo", pais: "Perú" },
        { estado: "Chincheros", pais: "Perú" },
        { estado: "Cusco", pais: "Perú" },
        { estado: "Gobierno Regional de Lima", pais: "Perú" },
        { estado: "Huamanga", pais: "Perú" },
        { estado: "Huancavelica", pais: "Perú" },
        { estado: "Huancayo", pais: "Perú" },
        { estado: "Huánuco", pais: "Perú" },
        { estado: "Ica", pais: "Perú" },
        { estado: "Iquitos", pais: "Perú" },
        { estado: "Junín", pais: "Perú" },
        { estado: "La Libertad", pais: "Perú" },
        { estado: "Lambayeque", pais: "Perú" },
        { estado: "Lima", pais: "Perú" },
        { estado: "Lima (departamento)", pais: "Perú" },
        { estado: "Lima Metropolitana", pais: "Perú" },
        { estado: "Loreto", pais: "Perú" },
        { estado: "Luya", pais: "Perú" },
        { estado: "Madre de Dios", pais: "Perú" },
        { estado: "Moquegua", pais: "Perú" },
        { estado: "Municipalidad Metropolitana de Lima", pais: "Perú" },
        { estado: "Pasco", pais: "Perú" },
        { estado: "Piura", pais: "Perú" },
        { estado: "Provincia del Cuzco", pais: "Perú" },
        { estado: "Puno", pais: "Perú" },
        { estado: "San Martín", pais: "Perú" },
        { estado: "Tacna", pais: "Perú" },
        { estado: "TRUJILLO", pais: "Perú" },
        { estado: "Tumbes", pais: "Perú" },
        { estado: "Ucayali", pais: "Perú" },
        { estado: "Áncash", pais: "Perú" },
        { estado: "Ilha da Madeira", pais: "Portugal" },
        { estado: "Portugal", pais: "Portugal" },
        { estado: "Arecibo", pais: "Puerto Rico" },
        { estado: "Cabo Rojo", pais: "Puerto Rico" },
        { estado: "Corozal", pais: "Puerto Rico" },
        { estado: "Mayagüez", pais: "Puerto Rico" },
        { estado: "Ponce", pais: "Puerto Rico" },
        { estado: "Puerto Rico", pais: "Puerto Rico" },
        { estado: "Quebradillas", pais: "Puerto Rico" },
        { estado: "Sabana Grande", pais: "Puerto Rico" },
        { estado: "San German", pais: "Puerto Rico" },
        { estado: "San Juan", pais: "Puerto Rico" },
        { estado: "Azua", pais: "Republica Dominicana" },
        { estado: "Barahona", pais: "Republica Dominicana" },
        { estado: "Distrito Nacional, Santo Domingo", pais: "Republica Dominicana" },
        { estado: "Duarte", pais: "Republica Dominicana" },
        { estado: "Espaillat", pais: "Republica Dominicana" },
        { estado: "La Altagracia", pais: "Republica Dominicana" },
        { estado: "La Romana", pais: "Republica Dominicana" },
        { estado: "La Vega", pais: "Republica Dominicana" },
        { estado: "María Trinidad Sánchez", pais: "Republica Dominicana" },
        { estado: "Monseñor Nouel", pais: "Republica Dominicana" },
        { estado: "Monte Cristi", pais: "Republica Dominicana" },
        { estado: "Monte Plata", pais: "Republica Dominicana" },
        { estado: "Peravia", pais: "Republica Dominicana" },
        { estado: "Puerto Plata", pais: "Republica Dominicana" },
        { estado: "San Cristóbal", pais: "Republica Dominicana" },
        { estado: "San Juan", pais: "Republica Dominicana" },
        { estado: "Santiago", pais: "Republica Dominicana" },
        { estado: "Santo Domingo", pais: "Republica Dominicana" },
        { estado: "Sánchez Ramírez", pais: "Republica Dominicana" },
        { estado: "Valverde", pais: "Republica Dominicana" },
        { estado: "Verón Punta Cana", pais: "Republica Dominicana" },
        { estado: "Bucarest", pais: "Rumania" },
        { estado: "Rusia", pais: "Rusia" },
        { estado: "Victoria", pais: "Seychelles" },
        { estado: "Estocolmo", pais: "Suecia" },
        { estado: "Berna", pais: "Suiza" },
        { estado: "Genève", pais: "Suiza" },
        { estado: "Ginebra", pais: "Suiza" },
        { estado: "Riddes", pais: "Suiza" },
        { estado: "Valais", pais: "Suiza" },
        { estado: "Vaud", pais: "Suiza" },
        { estado: "Zürich", pais: "Suiza" },
        { estado: "Lome", pais: "Togo" },
        { estado: "Bursa", pais: "Turquía" },
        { estado: "El Gran Londres", pais: "United Kingdom" },
        { estado: "Glasgow", pais: "United Kingdom" },
        { estado: "Hamphsire", pais: "United Kingdom" },
        { estado: "Perthshire y Kinross", pais: "United Kingdom" },
        { estado: "west midlands", pais: "United Kingdom" },
        { estado: "Artigas", pais: "Uruguay" },
        { estado: "Canelones", pais: "Uruguay" },
        { estado: "Cerro Largo", pais: "Uruguay" },
        { estado: "Colonia", pais: "Uruguay" },
        { estado: "Durazno", pais: "Uruguay" },
        { estado: "FLORES", pais: "Uruguay" },
        { estado: "Florida", pais: "Uruguay" },
        { estado: "Lavalleja", pais: "Uruguay" },
        { estado: "Maldonado", pais: "Uruguay" },
        { estado: "Montevideo", pais: "Uruguay" },
        { estado: "PAYSANDÚ", pais: "Uruguay" },
        { estado: "Rivera", pais: "Uruguay" },
        { estado: "Rocha", pais: "Uruguay" },
        { estado: "Río Negro", pais: "Uruguay" },
        { estado: "Salto", pais: "Uruguay" },
        { estado: "San José", pais: "Uruguay" },
        { estado: "Soriano", pais: "Uruguay" },
        { estado: "Tacuarembó", pais: "Uruguay" },
        { estado: "Treinta y Tres", pais: "Uruguay" },
        { estado: "Amazonas", pais: "Venezuela" },
        { estado: "Anzoátegui", pais: "Venezuela" },
        { estado: "Apure", pais: "Venezuela" },
        { estado: "Aragua", pais: "Venezuela" },
        { estado: "Barinas", pais: "Venezuela" },
        { estado: "Bolívar", pais: "Venezuela" },
        { estado: "Carabobo", pais: "Venezuela" },
        { estado: "Caracas", pais: "Venezuela" },
        { estado: "Cojedes", pais: "Venezuela" },
        { estado: "Delta Amacuro", pais: "Venezuela" },
        { estado: "Distrito Capital", pais: "Venezuela" },
        { estado: "ESTADO MIRANDA", pais: "Venezuela" },
        { estado: "Falcón", pais: "Venezuela" },
        { estado: "Guárico", pais: "Venezuela" },
        { estado: "Lara", pais: "Venezuela" },
        { estado: "Margarita", pais: "Venezuela" },
        { estado: "Miranda", pais: "Venezuela" },
        { estado: "Monagas", pais: "Venezuela" },
        { estado: "Mérida", pais: "Venezuela" },
        { estado: "Nueva Esparta", pais: "Venezuela" },
        { estado: "Portuguesa", pais: "Venezuela" },
        { estado: "Sucre", pais: "Venezuela" },
        { estado: "Trujillo", pais: "Venezuela" },
        { estado: "Táchira", pais: "Venezuela" },
        { estado: "Yaracuy", pais: "Venezuela" },
        { estado: "Zulia", pais: "Venezuela" },
        // Adicione os demais itens aqui
      ];
    
      try {
        for (const { estado, pais } of dados) {
          // Criar ou atualizar país
          await setDoc(doc(firestore, `paises`, pais), { nome: pais });
          console.log(`País '${pais}' adicionado ou atualizado.`);
    
          // Criar ou atualizar estado
          const estadoPath = `paises/${pais}/estados`;
          await setDoc(doc(firestore, estadoPath, estado), { nome: estado });
          console.log(`Estado '${estado}' adicionado ou atualizado no país '${pais}'.`);
        }
    
        console.log("Todos os países e estados foram inseridos com sucesso!");
      } catch (error) {
        console.error("Erro ao inserir países e estados:", error);
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
