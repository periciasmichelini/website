// article.js

import * as prompts from './prompts.js';
import * as gemini from './gemini.js';

export async function gerarConteudo(conteudo) {

    const prompt = prompts.parserArticlePrompt(conteudo);

    const result = await gemini.runPrompt(prompt);

    console.log(result);

    return result;
    // var content = JSON.parse(conteudo);

    // var promptFinal = articlePrompt.replace("{tema}", content.);

    // try {
    //     const response = await fetch(URL, {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({
    //             contents: [{ parts: [{ text: promptFinal }] }],
    //             generationConfig: { response_mime_type: "application/json" } // Força o JSON
    //         })
    //     });

    //     const data = await response.json();
    //     // O Gemini retorna o texto dentro dessa estrutura:
    //     const rawJson = data.candidates[0].content.parts[0].text;
    //     const result = JSON.parse(rawJson);

    //     atualizarCampos(result);
    // } catch (error) {
    //     console.error("Erro na chamada da IA:", error);
    // }
}

export async function gerarFullText(conteudo) {

    const prompt = prompts.parserFullTextArticlePrompt(conteudo);

    const result = await gemini.runPrompt(prompt);

    console.log(result);
    return result;
}
