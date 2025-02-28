const API_URL = "http://localhost:3000/contatos";

// 🔹 Captura os elementos do filtro
const searchInput = document.getElementById("search-input");
const filterCategory = document.getElementById("filter-category");

// 🔹 Carregar contatos ao iniciar
document.addEventListener("DOMContentLoaded", () => {
    loadContacts();
});

// 🔹 Função para carregar contatos e aplicar filtros
function loadContacts() {
    fetch(API_URL)
    .then(response => response.json())
    .then(data => {
        const contactsList = document.getElementById("contacts-list");
        contactsList.innerHTML = ""; // Limpar lista

        // Pegar valores dos filtros
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategory = filterCategory.value;

        // Aplicar filtros nos contatos
        const filteredContacts = data.filter(contact => {
            const matchNameOrPhone = contact.nome.toLowerCase().includes(searchTerm) ||
                                     contact.telefone.includes(searchTerm);

            const matchCategory = selectedCategory === "" || contact.categoria === selectedCategory;

            return matchNameOrPhone && matchCategory;
        });

        // Exibir os contatos filtrados
        filteredContacts.forEach(contact => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${contact.nome}</td>
                <td>${contact.telefone}</td>
                <td>${contact.categoria}</td>
                <td>${contact.subcategoria}</td>
                <td>${contact.observacao}</td>
                <td>
                    <button class="delete" onclick="deleteContact('${contact.id}')">Excluir</button>
                </td>
            `;
            contactsList.appendChild(row);
        });
    })
    .catch(error => console.error("❌ Erro ao carregar contatos:", error));
}

// 🔹 Atualizar contatos ao digitar ou selecionar filtro
searchInput.addEventListener("input", loadContacts);
filterCategory.addEventListener("change", loadContacts);

// 🔹 Adicionar contato
document.getElementById("contact-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const data = {
        nome: document.getElementById("nome").value,
        telefone: document.getElementById("telefone").value,
        categoria: document.getElementById("categoria").value,
        subcategoria: document.getElementById("subcategoria").value,
        observacao: document.getElementById("observacao").value
    };

    fetch(API_URL, { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify(data) 
    })
    .then(response => {
        if (!response.ok) throw new Error(`Erro ao adicionar contato: ${response.statusText}`);
        return response.json();
    })
    .then(() => { 
        console.log("✅ Contato adicionado com sucesso!");
        loadContacts(); 
        document.getElementById("contact-form").reset(); 
    })
    .catch(error => console.error("❌ Erro ao adicionar contato:", error));
});

// 🔹 Excluir contato
function deleteContact(id) {
    fetch(`${API_URL}/${id}`, { method: "DELETE" })
    .then(response => {
        if (!response.ok) throw new Error(`Erro ao excluir contato: ${response.statusText}`);
        return response.json();
    })
    .then(() => {
        console.log(`🗑️ Contato ${id} excluído com sucesso.`);
        loadContacts();
    })
    .catch(error => console.error("❌ Erro ao excluir contato:", error));
}
