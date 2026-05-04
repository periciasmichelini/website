// admin.js - Controle de abas e inicialização do painel

// Mostrar/esconder seções
function ativarSection(sectionId) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(`section-${sectionId}`).classList.add('active');
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    document.querySelector(`.nav-item[data-section="${sectionId}"]`).classList.add('active');
}

// Eventos de navegação
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        const section = item.dataset.section;
        ativarSection(section);
        if (section === 'listar') carregarListaArtigos();
        if (section === 'artigo') carregarSelectArtigos();
        if (section === 'social') carregarSelectArtigosSocial();
    });
});

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    ativarSection('dashboard');
    carregarDashboardStats();
    carregarListaArtigos();
    carregarSelectArtigos();
    carregarSelectArtigosSocial();
    document.getElementById('btnLimparForm')?.addEventListener('click', limparFormArtigo);
    document.getElementById('formArtigo')?.addEventListener('submit', salvarNovoArtigo);
});

// Dashboard
async function carregarDashboardStats() {
    try {
        const snapshot = await db.collection('artigos').get();
        const artigos = snapshot.docs.map(doc => doc.data());
        const total = artigos.length;
        const publicados = artigos.filter(a => a.status === 'publicado').length;
        const rascunhos = artigos.filter(a => a.status === 'rascunho').length;
        document.getElementById('totalArtigos').innerText = total;
        document.getElementById('publicadosCount').innerText = publicados;
        document.getElementById('rascunhosCount').innerText = rascunhos;

        // Últimos 5 artigos por data
        const ultimos = artigos.sort((a, b) => new Date(b.data) - new Date(a.data)).slice(0, 5);
        const lista = document.getElementById('ultimosArtigos');
        if (ultimos.length) {
            lista.innerHTML = ultimos.map(a => `<li class="mb-2"><i class="fas fa-file-alt me-2 text-accent"></i> <strong>${a.titulo}</strong> - ${a.dataFormatada || a.data}</li>`).join('');
        } else {
            lista.innerHTML = '<li>Nenhum artigo encontrado</li>';
        }
    } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
    }
}

// Limpar formulário de artigo
function limparFormArtigo() {
    document.getElementById('formArtigo').reset();
    document.getElementById('artigoId').disabled = false;
    document.getElementById('htmlContentEditor').value = '';
    document.getElementById('pdfExtractedInfo').innerHTML = '';
    window.currentEditId = null;
    window.textoPDFExtraido = '';
    showToast('Formulário limpo para novo artigo');
}

// Funções auxiliares
function showToast(msg, isError = false) {
    const toast = document.createElement('div');
    toast.className = `toast-notification ${isError ? 'error' : ''}`;
    toast.innerText = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    if (show) overlay.classList.add('active');
    else overlay.classList.remove('active');
}