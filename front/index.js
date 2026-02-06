const api = 'http://localhost:3000/medicamentos';

const listagem = document.getElementById('listagem');

const btnCarregar = document.getElementById('btnCarregar');
btnCarregar.addEventListener('click', carregarMedicamentos);

const btnInserir = document.getElementById('btnInserir');
btnInserir.addEventListener('click', inserirMedicamento);

const btnPaginacao = document.getElementById("btnPaginacao");
const btnPaginacaoMenos = document.getElementById("btnPaginacaoMenos");

btnCarregar.addEventListener("click", () => atualizarMedicamentos("inicio"));
//btnSalvar.addEventListener("click", inserirMunicipio);
//btnAlterar.addEventListener("click", alterarMunicipio);
btnPaginacao.addEventListener("click", () => atualizarMedicamentos("mais"));
btnPaginacaoMenos.addEventListener("click", () => atualizarMedicamentos("menos"));

async function carregarMedicamentos() {

    try {
        const resposta = await fetch(api);
        const medicamentos = await resposta.json();
        listagem.innerHTML = '';
        console.log(medicamentos);
        console.log(Array.isArray(medicamentos));
        medicamentos.forEach(medicamento => {
            const li = document.createElement('li');
            li.textContent = medicamento.nome;
            listagem.appendChild(li);
        });
    } catch (error) {
        console.log("Erro ao carregar medicamentos:", error);
    }
}

async function inserirMedicamento() {
    const nome = document.getElementById('campoNome').value;
    const embalagem = document.getElementById('campoEmbalagem').value;
    const saldo = document.getElementById('campoSaldo').value;
    const validade = document.getElementById('campoValidade').value;

    const medicamento = {
        nome,
        embalagem,
        saldo,
        validade
    };

    try {
        const resposta = await fetch(api, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(medicamento)
        });

        if (!resposta.ok) {
            throw new Error("Erro ao inserir medicamento");
        }
        carregarMedicamentos();
    } catch (error) {
        console.log("Erro ao inserir medicamento:", error);
    }
}

async function atualizarMedicamentos(acao = "") {

    if (acao === "inicio") {
        offset = 0;
    }

    if (acao === "mais") {
        offset += limit;
    }

    if (acao === "menos") {
        offset -= limit;
        if (offset < 0) offset = 0;
    }

    try {
        const resposta = await fetch(`${API}/?limit=${limit}&offset=${offset}`);
        const dados = await resposta.json();

        listagem.innerHTML = "";

        dados.forEach(m => criarCard(m));

    } catch (erro) {
        console.error("Erro ao carregar:", erro.message);
    }
}

function criarCard(m) {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
        <h3>${m.nome} (${m.embalagem})</h3>
        <p>Saldo: ${m.saldo}</p>
        <p>Validade: ${m.validade}</p>
        <button class="btn-editar" onclick="modalEdicao(${m.id})">Editar</button>
        <button class="btn-delete" onclick="deletar(${m.id})">Deletar</button>
    `;

    listagem.appendChild(card);
}