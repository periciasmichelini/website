// artigo.js - Lógica da página de exibição de artigo (dinâmico via ID)

// Referência do DOM
const artigoContent = document.getElementById('artigoContent');

// Função para obter parâmetro da URL
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Função para formatar data (ex: "2025-03-15" -> "15 de março de 2025")
function formatarDataCompleta(dataString) {
    if (!dataString) return 'Data não informada';
    const data = new Date(dataString);
    const meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
    return `${data.getDate()} de ${meses[data.getMonth()]} de ${data.getFullYear()}`;
}

// Função para criar a estrutura visual do artigo a partir dos dados do Firestore
function renderizarArtigo(artigo) {
    // Se o artigo tiver um campo htmlUrl, buscar e injetar o HTML completo
    if (artigo.htmlUrl) {
        fetch(artigo.htmlUrl)
            .then(response => response.text())
            .then(html => {
                // Extrair apenas o conteúdo dentro de <article> ou <body> conforme necessário
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                let conteudo = doc.querySelector('article') || doc.querySelector('.artigo-wrapper') || doc.body;

                // Montar o HTML final com cabeçalho e rodapé personalizados
                const htmlCompleto = `
                    <div class="artigo-container">
                        <div class="artigo-header">
                            <span class="badge-categoria">${artigo.categoria || 'Geral'}</span>
                            <h1 class="display-5 fw-bold mt-3 mb-3">${artigo.titulo}</h1>
                            ${artigo.subtitulo ? `<h5 class="text-white-50 mb-3">${artigo.subtitulo}</h5>` : ''}
                            <div class="d-flex flex-wrap gap-3 align-items-center">
                                <div><i class="far fa-calendar-alt me-1"></i> ${formatarDataCompleta(artigo.data)}</div>
                                <div><i class="far fa-clock me-1"></i> ${artigo.tempoLeitura || 5} min de leitura</div>
                                ${artigo.hasPdf ? `<div><i class="fas fa-file-pdf me-1"></i> Disponível para download</div>` : ''}
                            </div>
                        </div>
                        <div class="artigo-body">
                            <div class="artigo-tags">
                                ${(artigo.tags || []).map(tag => `<span class="artigo-tag">#${tag}</span>`).join('')}
                            </div>
                            <div class="artigo-conteudo">
                                ${conteudo.innerHTML}
                            </div>
                            <!-- Botões de material complementar -->
                            ${(artigo.downloadmedia?.hotmartLink || artigo.pdfUrl) ? `
                            <div class="d-flex flex-wrap gap-3 my-4">
                                ${artigo.downloadmedia?.hotmartLink ? `<a href="${artigo.downloadmedia.hotmartLink}" target="_blank" class="btn-hotmart"><i class="fab fa-hotjar"></i> Comprar na Hotmart</a>` : ''}
                                ${artigo.pdfUrl ? `<a href="${artigo.pdfUrl}" target="_blank" class="btn-download"><i class="fas fa-file-pdf"></i> Download grátis (PDF)</a>` : ''}
                            </div>
                            ` : ''}
                            <!-- Autor -->
                            <div class="autor-card">
                                <div class="d-flex align-items-center gap-3">
                                    <div>
                                        <i class="fas fa-user-circle fa-3x" style="color: #d9a13b;"></i>
                                    </div>
                                    <div>
                                        <strong class="d-block">${artigo.autor || 'Eng. Paulo Eduardo Moretto Michelini'}</strong>
                                        <small class="text-muted">${artigo.autorCredenciais || 'Engenheiro Mecânico • Perito Judicial • CREA-SP 506157626-6'}</small>
                                    </div>
                                </div>
                            </div>
                            <!-- Compartilhar -->
                            <div class="share-buttons">
                                <strong class="me-2">Compartilhe:</strong>
                                <a href="https://wa.me/?text=${encodeURIComponent(window.location.href)}" target="_blank" class="share-btn share-btn-whatsapp"><i class="fab fa-whatsapp"></i> WhatsApp</a>
                                <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}" target="_blank" class="share-btn share-btn-linkedin"><i class="fab fa-linkedin"></i> LinkedIn</a>
                                <a href="mailto:?subject=${encodeURIComponent(artigo.titulo)}&body=${encodeURIComponent(window.location.href)}" class="share-btn share-btn-email"><i class="fas fa-envelope"></i> E-mail</a>
                            </div>
                        </div>
                    </div>
                `;
                artigoContent.innerHTML = htmlCompleto;
            })
            .catch(error => {
                console.error('Erro ao carregar HTML do artigo:', error);
                mostrarErro('Não foi possível carregar o conteúdo do artigo.');
            });
    } else {
        // Fallback: exibir apenas metadados
        artigoContent.innerHTML = `
            <div class="artigo-container">
                <div class="artigo-header">
                    <h1>${artigo.titulo}</h1>
                    <p>${artigo.resumo || 'Conteúdo não disponível no momento.'}</p>
                </div>
                <div class="artigo-body">
                    <p class="text-muted">O conteúdo HTML deste artigo não foi encontrado. Tente novamente mais tarde.</p>
                </div>
            </div>
        `;
    }
}

function mostrarErro(mensagem) {
    artigoContent.innerHTML = `
        <div class="text-center py-5">
            <i class="fas fa-exclamation-triangle fa-3x text-danger mb-3"></i>
            <h4 class="fw-bold">Ops! Algo deu errado.</h4>
            <p class="text-muted">${mensagem}</p>
            <a href="biblioteca.html" class="btn btn-primary-custom mt-3">Voltar para a Biblioteca</a>
        </div>
    `;
}

// Função principal: carregar artigo do Firestore pelo ID
async function carregarArtigo() {
    const artigoId = getUrlParameter('id');
    if (!artigoId) {
        mostrarErro('Nenhum artigo especificado. Use ?id=... na URL.');
        return;
    }

    // Mostrar loading
    artigoContent.innerHTML = `
        <div class="loading-container">
            <div class="loading-spinner mx-auto mb-3"></div>
            <p class="text-muted text-center">Carregando artigo...</p>
        </div>
    `;

    try {
        const doc = await db.collection('artigos').doc(artigoId).get();
        if (!doc.exists) {
            mostrarErro('Artigo não encontrado. O ID fornecido não corresponde a nenhum artigo publicado.');
            return;
        }
        const artigo = doc.data();
        renderizarArtigo(artigo);
    } catch (error) {
        console.error('Erro ao buscar artigo:', error);
        mostrarErro('Erro ao conectar ao banco de dados. Verifique sua conexão e tente novamente.');
    }
}

// BACK TO TOP (igual ao biblioteca.js)
const backToTop = document.getElementById('backToTop');
if (backToTop) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) backToTop.classList.add('show');
        else backToTop.classList.remove('show');
    });
    backToTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    if (typeof db !== 'undefined') {
        carregarArtigo();
    } else {
        console.error('Firebase não inicializado. Verifique firebase-config.js');
        mostrarErro('Problema de configuração do banco de dados. Contate o administrador.');
    }
});