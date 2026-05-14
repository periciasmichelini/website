/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { setGlobalOptions } = require("firebase-functions");
const { onRequest } = require("firebase-functions/https");
const logger = require("firebase-functions/logger");

const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { GoogleGenAI } = require("@google/generative-ai");

// O SDK lê diretamente da variável de ambiente carregada do arquivo .env
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Removido o argumento { secrets: [...] }
exports.gerarTextoGemini = onCall(async (request) => {
    const prompt = request.data.prompt;
    if (!prompt) {
        throw new HttpsError("invalid-argument", "O campo 'prompt' é obrigatório.");
    }

    try {
        const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
        const response = await model.generateContent(prompt);

        return { resultado: response.text };
    } catch (error) {
        console.error("Erro no Gemini:", error);
        throw new HttpsError("internal", "Falha ao processar a inteligência artificial.");
    }
});

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10 });

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

