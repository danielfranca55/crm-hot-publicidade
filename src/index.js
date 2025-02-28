const express = require("express");
const cors = require("cors");
const axios = require("axios");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");

const app = express();
const PORT = 3000;
const USERS_DB = "database/users.json"; // Banco de usuários

app.use(express.json());
app.use(cors());
app.use(express.static("public")); // Servir frontend

const JSON_SERVER_URL = "http://127.0.0.1:3001/contatos"; // Banco de contatos

// 📝 Rota para registrar usuários
app.post("/register", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Usuário e senha são obrigatórios." });
    }

    const usersData = JSON.parse(fs.readFileSync(USERS_DB, "utf-8"));

    if (usersData.usuarios.find(user => user.username === username)) {
        return res.status(400).json({ error: "Usuário já existe." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { id: Date.now().toString(), username, password: hashedPassword };

    usersData.usuarios.push(newUser);
    fs.writeFileSync(USERS_DB, JSON.stringify(usersData, null, 2));

    res.json({ message: "Usuário cadastrado com sucesso!" });
});

// 🔑 Rota para login de usuários (sem token)
app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const usersData = JSON.parse(fs.readFileSync(USERS_DB, "utf-8"));

    const user = usersData.usuarios.find(user => user.username === username);

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: "Usuário ou senha inválidos." });
    }

    res.json({ message: "Login bem-sucedido!", user: { id: user.id, username: user.username } });
});

// 🟢 Rotas de Contatos (sem autenticação)
app.get("/contatos", async (req, res) => {
    try {
        const response = await axios.get(JSON_SERVER_URL);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar contatos." });
    }
});

app.post("/contatos", async (req, res) => {
    try {
        const response = await axios.post(JSON_SERVER_URL, req.body);
        res.status(201).json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Erro ao criar contato." });
    }
});

app.put("/contatos/:id", async (req, res) => {
    try {
        const response = await axios.put(`${JSON_SERVER_URL}/${req.params.id}`, req.body);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Erro ao atualizar contato." });
    }
});

app.delete("/contatos/:id", async (req, res) => {
    try {
        await axios.delete(`${JSON_SERVER_URL}/${req.params.id}`);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: "Erro ao excluir contato." });
    }
});

// 📂 Rota para servir o frontend
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 🚀 Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
