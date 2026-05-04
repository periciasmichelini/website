// Configuração do Firebase
// const firebaseConfig = {
//     apiKey: "SUA_API_KEY",
//     authDomain: "SEU_PROJETO.firebaseapp.com",
//     projectId: "SEU_PROJETO",
//     storageBucket: "SEU_PROJETO.appspot.com",
//     messagingSenderId: "SEU_SENDER_ID",
//     appId: "SEU_APP_ID"
// };

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// Coleções
const ARTIGOS_COLLECTION = 'artigos';
const SOCIAL_COLLECTION = 'socialmedia';

// Serviços
const ArtigosService = {
    // Listar todos os artigos
    async listar() {
        const snapshot = await db.collection(ARTIGOS_COLLECTION)
            .orderBy('dataCriacao', 'desc')
            .get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    // Buscar um artigo por ID
    async buscar(id) {
        const doc = await db.collection(ARTIGOS_COLLECTION).doc(id).get();
        return { id: doc.id, ...doc.data() };
    },

    // Criar novo artigo
    async criar(artigo, arquivoHTML) {
        // Upload do arquivo HTML para Storage
        const storageRef = storage.ref(`artigos/${artigo.id}.html`);
        await storageRef.putString(arquivoHTML, 'data_url');

        // Salvar metadados no Firestore
        const docRef = await db.collection(ARTIGOS_COLLECTION).add({
            ...artigo,
            dataCriacao: firebase.firestore.FieldValue.serverTimestamp(),
            arquivoURL: await storageRef.getDownloadURL()
        });

        return docRef.id;
    },

    // Atualizar artigo
    async atualizar(id, artigo, arquivoHTML = null) {
        if (arquivoHTML) {
            const storageRef = storage.ref(`artigos/${id}.html`);
            await storageRef.putString(arquivoHTML, 'data_url');
            artigo.arquivoURL = await storageRef.getDownloadURL();
        }

        artigo.dataAtualizacao = firebase.firestore.FieldValue.serverTimestamp();
        await db.collection(ARTIGOS_COLLECTION).doc(id).update(artigo);
    },

    // Excluir artigo
    async excluir(id) {
        // Excluir do Storage
        const storageRef = storage.ref(`artigos/${id}.html`);
        await storageRef.delete().catch(() => { });

        // Excluir do Firestore
        await db.collection(ARTIGOS_COLLECTION).doc(id).delete();
    }
};

const SocialMediaService = {
    async get() {
        const doc = await db.collection(SOCIAL_COLLECTION).doc('config').get();
        return doc.exists ? doc.data() : {};
    },

    async update(data) {
        await db.collection(SOCIAL_COLLECTION).doc('config').set(data, { merge: true });
    }
};