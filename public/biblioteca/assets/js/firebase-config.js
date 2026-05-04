// firebase-config.js - Configuração do Firebase (SUBSTITUA COM SEUS DADOS)

const firebaseConfig = {
    apiKey: "AIzaSyCnHbLlrsRxs8DHZx6c4kZujB4iHRxgx7k",
    authDomain: "website-michelini-pericias.firebaseapp.com",
    projectId: "website-michelini-pericias",
    storageBucket: "website-michelini-pericias.firebasestorage.app",
    messagingSenderId: "734652862355",
    appId: "1:734652862355:web:cc8200428a32b6b4a4e266",
    measurementId: "G-26ELVBP6DM"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

// Configurar persistência offline (opcional)
db.enablePersistence().catch((err) => {
    console.warn('Erro ao ativar persistência offline:', err);
});