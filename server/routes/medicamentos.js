const express = require("express");
const pool = require("../db");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    let { nome, ordem, offset, limit } = req.query;


    nome = nome ? '%' + nome + '%' : '%';
    ordem = ordem && ordem.toLowerCase() === "asc" ? "ASC" : "DESC";
    offset = parseInt(offset) || 0;
    limit = parseInt(limit) || 100;

    console.log(nome, ordem, offset, limit);
    const query = `
    SELECT * FROM medicamentos
    where nome ilike  $1
    ORDER BY id ${ordem}
    LIMIT $2
    OFFSET $3
    `;

    const result = await pool.query(query, [nome, limit, offset]);

    res.json(result.rows);

  } catch (err) {
    res.status(500).json({
      error: "Erro ao listar medicamentos",
      detalhes: err.message
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await pool.query("SELECT * FROM medicamentos WHERE id = $1", [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Medicamento não encontrado" });
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar medicamento" })
  }
});


router.post("/", async (req, res) => {
  try {
    const { nome, embalagem, saldo, validade } = req.body;
    if (!nome || !embalagem || !saldo || !validade) return res.status(400).json({ error: "Campos obrigatórios: nome, embalagem, saldo, validade" });

    const result = await pool.query(
      "INSERT INTO medicamentos (nome, embalagem, saldo, validade) VALUES ($1, $2, $3, $4) RETURNING *",
      [nome, embalagem, saldo, validade]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Erro ao inserir medicamento", detalhes: err.message })
  }
})

module.exports = router;