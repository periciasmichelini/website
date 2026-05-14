// gemini.js
import * as functions from "firebase-functions";

export async function runPrompt(prompt) {
    const callable = functions.httpsCallable("runPrompt");
    callable({ prompt: "Seu texto aqui" })
        .then((result) => {
            console.log("Texto gerado:", result.data.text);
        })
        .catch((error) => {
            console.error("Erro:", error);
        });
    return result.data.text ?? "";
}

//import { GoogleGenerativeAI } from "@google/generative-ai";
//import { GoogleGenerativeAI } from "https://esm.run";
//import { GoogleGenerativeAI } from "esm.sh";
//import { GoogleGenerativeAI } from "esm.sh/generative-ai";
//import { GoogleGenerativeAI } from "@google/generative-ai";
//import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai";

//const GEMINI_API_KEY = "AIzaSyDet_w2vzBRBzw1QLOqlOszSwHv3_25pgM";
//const GEMINI_API_URL = `https://googleapis.com{GEMINI_API_KEY}`;
//const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models?key={GEMINI_API_KEY}`;


//const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Change 'gemini-1.5-pro' to 'gemini-1.5-pro-latest' or 'gemini-1.5-flash'
//const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });


// export async function MAISOLDrunPrompt(prompt) {
//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     const text = response.text();
//     return text;
// }


// export async function OLDrunPrompt(prompt) {

//     const model = genAI.getGenerativeModel({
//         model: "gemini-1.5-pro"
//     });

//     const result = await model.generateContent(prompt);

//     const response = await result.response;
//     const text = response.text();

//     return text;
// }