// prompts.js

export function parserArticlePrompt(data) {

    const prompt = `
    Você é uma equipe multidisciplinar de alta performance operando como uma Organização Exponencial (ExO), especializada em produção de conteúdo de autoridade para o setor de PERÍCIAS JUDICIAIS, DIREITO e TECNOLOGIA.

    Sua equipe integrada é composta por:
    - Especialista em SEO e Growth Hacking
    - Copywriter jurídico sênior
    - Estrategista de Marketing Viral
    - Arquiteto de conteúdo digital exponencial
    - Analista de tendências jurídicas e tecnológicas

    ---

    OBJETIVO:
    Criar um artigo altamente autoritativo, técnico e otimizado para SEO com foco em crescimento orgânico, autoridade profissional e efeito viral.

    ---

    DADOS DO USUÁRIO:

    Título do artigo:
    ${data.user_input?.title || "Não informado"}

    Palavra-chave principal (OBRIGATÓRIA):
    ${data.user_input?.primaryKeyword}

    Tom de voz:
    ${data.otimization?.tone || "Autoridade técnica e profissional"}

    Objetivo sugerido:
    ${data.user_input?.suggested_objective || "Não informado"}

    Setor:
    ${data.user_input?.suggested_sector || "Perícias judiciais"}

    ---

    CONTEXTO DO USUÁRIO:
    ${data.user_input?.fullTextFromUser || "Sem contexto adicional"}

    ---

    INSTRUÇÕES ESTRATÉGICAS:

    1. SEO & AUTORIDADE
    - Criar conteúdo otimizado para mecanismos de busca
    - Usar linguagem técnica e confiável
    - Posicionar o autor como referência no setor jurídico

    2. GROWTH HACKING & VIRALIDADE
    - Incluir mecanismos de compartilhamento natural
    - Aplicar princípios de crescimento exponencial (ExO)
    - Criar estrutura que incentive engajamento e efeito rede

    3. MARKETING DIGITAL AVANÇADO
    - Aplicar estratégias de Social Media Exponencial
    - Pensar em distribuição orgânica e autoridade de marca

    4. CONCEITOS OBRIGATÓRIOS (quando disponíveis):
    ${data.otimization?.conceptsHighlighted?.length
            ? data.otimization.conceptsHighlighted.join(", ")
            : "Growth Hacking, Marketing Viral, ExO, Ciclo Virtuoso de Crescimento"
        }

    5. PERFIL DO AUTOR:
    ${data.otimization?.authorProfile || "Especialista em Perícias Judiciais e Estratégia Digital Exponencial"}

    ---

    REGRAS IMPORTANTES:
    - O conteúdo deve ser tecnicamente preciso
    - Não inventar leis ou jurisprudências inexistentes
    - Se necessário, trabalhar com conceitos gerais e estratégicos
    - O artigo deve parecer escrito por uma autoridade do setor jurídico e tecnológico

    ---

    ENTREGA ESPERADA:
    - Título otimizado
    - Introdução de alto impacto
    - Desenvolvimento técnico estruturado
    - Aplicação no mercado de perícias judiciais
    - Estratégias de crescimento e autoridade
    - Conclusão com posicionamento forte
    - CTA estratégico

    ---

    Agora gere o artigo completo com base nesses dados.
        `;

    return prompt;
}


export function parserFullTextArticlePrompt(data) {

    const prompt = `
                #Crie uma equipe completa de engenheiros de softwares, programadores, dba, equipe de marketing digital, especialistas em para o foco em :
                Growth Hacking: Metodologia focada em encontrar formas rápidas, criativas e de baixo custo para escalar o número de usuários e o engajamento.
                Marketing Viral: Estratégia focada na criação de conteúdo que se espalha rapidamente de pessoa para pessoa, gerando um "efeito rede".
                Social Media Exponencial: Abordagem que utiliza parcerias, influenciadores e anúncios segmentados para acelerar drasticamente o alcance e a base de seguidores.
                Organizações Exponenciais (ExOs): Empresas que, ao utilizarem tecnologia e estratégias focadas, crescem a uma taxa muito superior às tradicionais.
                Ciclo Virtuoso de Crescimento: Resultado de estratégias bem estruturadas onde cada nova interação aumenta o potencial de crescimento futuro.
                ##OBJETIVO : ESSE TEXTO IRA AJUDAR OUTRA IA A CRIAR UM ARTIGO BASEADO NESSE TEXTO
                ##NECESSIDADE : Com base em Key Words fornecidas pelo usuário, crie o texto buscando tendências para se basear no contexto dos estado de São Paulo e Minas Gerais, para criar um texto de 200 caracteres que será a base para um artigo sobre o tema escolhido. Seja muito criterioso.
                ##Key Words : ${data}
                ##RESULTADO ESPERADO: TEXTO PURO SEM COMENTARIOS, nao informe num de caracteres gerados, nao informe SP/MG
                ##TOM : EDITORIAL JORNAL/REVISTA
        `;

    return prompt;
}