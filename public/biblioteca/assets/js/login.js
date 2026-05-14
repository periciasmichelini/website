// ===============================
// VALIDATION CONSTANTS
// ===============================
// Regex simples para validar formato de e-mail
const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** 
* Explicação da Regex:
* (?=.*[A-Z])      -> Pelo menos uma letra maiúscula
* (?=.*[0-9])      -> Pelo menos um número
* (?=.*[!@#$%^&*]) -> Pelo menos um caractere especial
* .{8,}            -> Mínimo de 8 caracteres (opcional, ajuste conforme necessário)
**/
const regexSenha = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{6,}$/;





// ===============================
// "Senha criptografada simples"
// ===============================
const ENCRYPTED_PASSWORD = "QWRtaW5AMjAyNg==";
const ENCRYPTED_EMAIL = "YWRtaW5AZ21haWwuY29t";

// ===============================
// LOGIN FUNCTION
// ===============================
function VerifyLogin(event) {

    event.preventDefault();

    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const errorBox = document.getElementById("errorBox");

    // reset UI
    errorBox.classList.add("d-none");
    email.classList.remove("is-invalid");
    password.classList.remove("is-invalid");

    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();

    let hasError = false;

    // validação HTML5 visual
    if (!emailValue) {
        email.classList.add("is-invalid");
        hasError = true;
    }

    if (!passwordValue) {
        password.classList.add("is-invalid");
        hasError = true;
    }

    if (hasError) return;

    // validação login
    const decodedEmail = atob(ENCRYPTED_EMAIL);
    const decodedPassword = atob(ENCRYPTED_PASSWORD);

    //var emailEncriptado = btoa("admin@gmail.com");
    //console.log(emailEncriptado);

    if ((emailValue === decodedEmail) && (passwordValue === decodedPassword)) {

        sessionStorage.setItem("admin_logado", "true");

        window.location.href = "admin.html";

    } else {
        let msg = "Email ou senha inválidos. Tente novamente.";
        console.error(msg);

        document.getElementById("password").value = "";
        errorBox.textContent = msg;
        errorBox.classList.remove("d-none");

    }
}

// bind do form
// document.getElementById("loginForm")
//     .addEventListener("submit", VerifyLogin);