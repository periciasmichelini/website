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


function verificarSenha(event) {

    event?.preventDefault();

    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('errorMessage');

    const password = passwordInput.value.trim();
    const secret = getSecret(DATA_KEY);

    console.log("Senha digitada:", password);
    console.log("Senha esperada:", secret);
    alert("Login...");

    // segurança: validação do secret
    if (!secret) {

        console.error("Erro ao decodificar senha");
        alert("Erro ao decodificar senha");
        return;

    }

    // campo vazio
    if (password === "") {
        alert("campo password vazio");
        passwordInput.value = '';
        return;

    }

    // login correto
    if (password === secret) {
        alert("login correto");
        console.log("Login OK");

        sessionStorage.setItem('admin_logado', 'true');

        window.location.href = 'admin.html';

        return;

    }

    alert("Senha incorreta");
    // login inválido
    console.log("Senha incorreta");

    passwordInput.value = '';

    errorMessage?.classList.add('show');
}
window.verificarSenha = verificarSenha;