//const DATA_KEY = "ZXhwYW5kZWRfdHJhbnNhY3Rpb25fYWRtaW4xMjNfbG9naW5fdG9rZW5fOTk4Mg==";

const DATA_KEY = "ZXhwYW5kZWRfdHJhbnNhY3Rpb25fQWRtaW5AMjAyNl9sb2dpbl90b2tlbl85OTgy";

function getSecret(input) {
    // 1. Decodifica de Base64 para texto puro
    const decoded = atob(input);
    // O resultado de atob será: "expanded_transaction_admin123_login_token_9982"

    // 2. Extrai a parte que importa (sabendo que a senha está entre os termos fixos)
    // Procuramos o que está entre "transaction_" e "_login"
    const regex = /transaction_(.*?)_login/;
    const match = decoded.match(regex);

    return match ? match[1] : null;
}

function verificarSenha() {

    console.log(getSecret(DATA_KEY)); // "admin123"

    if (document.getElementById('password').value == "") {
        document.getElementById('password').value = '';

        // 1. Impede o recarregamento da página
        if (event) event.preventDefault();
    }
    else if ((document.getElementById('password').value == getSecret(DATA_KEY))) {
        sessionStorage.setItem('admin_logado', 'true');
        window.location.href = 'admin.html';
    } else {
        // Opcional: Limpa o campo de senha
        document.getElementById('password').value = '';

        // 1. Impede o recarregamento da página
        if (event) event.preventDefault();

        // 2. Mostra a DIV de erro
        //const divErro = document.getElementById('errorMessage');
        //divErro.style.display = 'flex'; // Ou block 'flex' dependendo do seu layout
        this.successMessage = document.getElementById('errorMessage');
        this.successMessage?.classList.add('show');

    }
}