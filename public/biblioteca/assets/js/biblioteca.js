// biblioteca.js - Lógica da página de listagem de artigos

// Referências do DOM
const artigosContainer = document.getElementById('artigosContainer');
const searchInput = document.getElementById('searchInput');
const categoriasContainer = document.getElementById('categoriasContainer');
const tagsContainer = document.getElementById('tagsContainer');

// Estado global
let artigos = [];
let categoriaAtiva = 'todas';
let termoBusca = '';

// ============================================================
// FUNÇÕES AUXILIARES
// ============================================================
function mostrarLoading() {
    artigosContainer.innerHTML = `
        <div class="text-center py-5">
            <div class="loading-spinner mx-auto mb-3"></div>
            <p class="text-muted">Carregando artigos...</p>
        </div>
    `;
}

function mostrarEmptyState() {
    artigosContainer.innerHTML = `
        <div class="empty-state">
            <i class="fas fa-book-open fa-3x text-muted mb-3"></i>
            <h4 class="fw-bold">Nenhum artigo encontrado</h4>
            <p class="text-muted">Tente buscar por outro termo ou categoria.</p>
        </div>
    `;
}

function formatarData(dataString) {
    if (!dataString) return 'Data indisponível';
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
}

// ============================================================
// RENDERIZAÇÃO DOS ARTIGOS
// ============================================================
function renderizarArtigos() {
    let artigosFiltrados = [...artigos];

    // Filtro por categoria
    if (categoriaAtiva !== 'todas') {
        artigosFiltrados = artigosFiltrados.filter(a => a.categoria === categoriaAtiva);
    }

    // Filtro por busca (título, tags, resumo)
    if (termoBusca.trim() !== '') {
        const busca = termoBusca.toLowerCase();
        artigosFiltrados = artigosFiltrados.filter(a =>
            a.titulo?.toLowerCase().includes(busca) ||
            a.resumo?.toLowerCase().includes(busca) ||
            (a.tags && a.tags.some(tag => tag.toLowerCase().includes(busca)))
        );
    }

    if (artigosFiltrados.length === 0) {
        mostrarEmptyState();
        return;
    }

    // Ordenar por data (mais recente primeiro)
    artigosFiltrados.sort((a, b) => new Date(b.data) - new Date(a.data));

    artigosContainer.innerHTML = artigosFiltrados.map(artigo => `
        <div class="artigo-card" onclick="window.location.href='artigo.html?id=${artigo.id}'">
            <div class="d-flex justify-content-between align-items-start mb-2">
                <span class="categoria-badge">${artigo.categoria || 'Geral'}</span>
                <span class="text-muted small"><i class="far fa-calendar-alt me-1"></i>${formatarData(artigo.data)}</span>
            </div>
            <h3 class="h5 fw-bold mb-2">${artigo.titulo}</h3>
            ${artigo.subtitulo ? `<p class="text-muted small mb-2">${artigo.subtitulo}</p>` : ''}
            <p class="text-muted mb-3">${artigo.resumo?.substring(0, 150) || ''}${artigo.resumo?.length > 150 ? '...' : ''}</p>
            <div class="artigo-tags">
                ${(artigo.tags || []).slice(0, 5).map(tag => `<span class="tag-badge">#${tag}</span>`).join('')}
            </div>
            <div class="d-flex justify-content-between align-items-center mt-3">
                <span class="text-muted small"><i class="far fa-clock me-1"></i> ${artigo.tempoLeitura || 5} min de leitura</span>
                <span class="btn-leia">Ler artigo <i class="fas fa-arrow-right ms-1"></i></span>
            </div>
        </div>
    `).join('');
}

// ============================================================
// FILTROS (Categorias e Tags)
// ============================================================
function renderizarFiltros() {
    if (!artigos.length) return;

    // Extrair categorias únicas
    const categorias = ['todas', ...new Set(artigos.map(a => a.categoria).filter(Boolean))];
    categoriasContainer.innerHTML = categorias.map(cat => `
        <button class="categoria-btn ${cat === categoriaAtiva ? 'active' : ''}" data-categoria="${cat}">
            ${cat === 'todas' ? 'Todas' : cat}
        </button>
    `).join('');

    // Adicionar eventos às categorias
    document.querySelectorAll('.categoria-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            categoriaAtiva = btn.dataset.categoria;
            renderizarFiltros(); // re-renderiza botões para marcar ativo
            renderizarArtigos();
        });
    });

    // Extrair tags mais populares (limitar a 15)
    const contagemTags = new Map();
    artigos.forEach(artigo => {
        (artigo.tags || []).forEach(tag => {
            const t = tag.toLowerCase();
            contagemTags.set(t, (contagemTags.get(t) || 0) + 1);
        });
    });
    const tagsPopulares = [...contagemTags.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 15)
        .map(([tag]) => tag);

    tagsContainer.innerHTML = tagsPopulares.map(tag => `
        <button class="tag-btn" data-tag="${tag}">#${tag}</button>
    `).join('');

    // Adicionar eventos às tags (filtro de busca)
    document.querySelectorAll('.tag-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tag = btn.dataset.tag;
            termoBusca = tag;
            searchInput.value = tag;
            renderizarArtigos();
        });
    });
}

// ============================================================
// CARREGAR ARTIGOS DO FIRESTORE
// ============================================================
async function carregarArtigos() {
    mostrarLoading();
    try {
        const snapshot = await db.collection('artigos')
            .where('status', '==', 'publicado')
            .orderBy('data', 'desc')
            .get();

        artigos = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        renderizarFiltros();
        renderizarArtigos();
    } catch (error) {
        console.error('Erro ao carregar artigos:', error);
        artigosContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-triangle fa-3x text-danger mb-3"></i>
                <h4 class="fw-bold">Erro ao carregar artigos</h4>
                <p class="text-muted">Verifique sua conexão ou tente novamente mais tarde.</p>
            </div>
        `;
    }
}

// ============================================================
// EVENTOS DE BUSCA
// ============================================================
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        termoBusca = e.target.value;
        renderizarArtigos();
    });
}

// ============================================================
// BACK TO TOP
// ============================================================
const backToTop = document.getElementById('backToTop');
if (backToTop) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });
    backToTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ============================================================
// INICIALIZAÇÃO
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    // Verificar se o Firebase foi carregado (window.db)
    if (typeof db !== 'undefined') {
        carregarArtigos();
    } else {
        console.error('Firebase não inicializado. Verifique firebase-config.js');
        artigosContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-database fa-3x text-danger mb-3"></i>
                <h4 class="fw-bold">Erro de configuração</h4>
                <p class="text-muted">Não foi possível conectar ao banco de dados. Contate o administrador.</p>
            </div>
        `;
    }
});