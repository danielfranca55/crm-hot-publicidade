

// 🔹 Login do usuário
document.getElementById("login-form")?.addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.ok) {
        localStorage.setItem("username", data.user.username); // Salvar nome de usuário ao invés de token
        window.location.href = "index.html";
    } else {
        alert("Erro ao fazer login: " + data.error);
    }
});

// 🔹 Cadastro do usuário
document.getElementById("register-form")?.addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("new-username").value;
    const password = document.getElementById("new-password").value;

    const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.ok) {
        alert("Usuário cadastrado com sucesso!");
        window.location.href = "login.html";
    } else {
        alert("Erro ao cadastrar: " + data.error);
    }
});

// 🔹 Verificar se o usuário está logado
function checkAuth() {
    const username = localStorage.getItem("username");
    if (!username) {
        window.location.href = "login.html";
    }
}

// 🔹 Logout do usuário
function logout() {
    localStorage.removeItem("username");
    window.location.href = "login.html";
}
