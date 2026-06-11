// ============================================================
// src/routes/notasRoutes.ts — Rotas do Portal de Notas
// ============================================================

import { Router, Request, Response } from "express";

export const notasRoutes = Router();

// ============================================================
// 🎯 ROTA 1: GET / — Página de login
// Ler flash, consumir (null), renderizar "index" com { flash }
// ============================================================
notasRoutes.get("/", (req, res) => {
  const flash = req.session.flash;

  req.session.flash = null;

  res.render("index", { flash });
});

// ============================================================
// 🎯 ROTA 2: POST /entrar — Salvar nome na session
// Se vazio: flash de erro + redirect /
// Se ok: session.aluno = nome, session.notas = [], flash boas-vindas
// ============================================================
notasRoutes.post("/entrar", (req, res) => {
  const { nome } = req.body;

  if (!nome || !nome.trim()) {
    req.session.flash = "Informe seu nome!";
    return res.redirect("/");
  }

  req.session.aluno = nome;
  req.session.notas = [];

  req.session.flash = `Bem-vindo, ${nome}!`;

  res.redirect("/boletim");
});
// ============================================================
// 🎯 ROTA 3: GET /boletim — Página principal (protegida!)
// Se !session.aluno: flash "Faça login!" + redirect /
// Calcular média e situação, ler/consumir flash
// Renderizar "boletim" com { aluno, notas, media, situacao, flash }
// ============================================================
notasRoutes.get("/boletim", (req: Request, res: Response) => {
  if (!req.session.aluno) {
    req.session.flash = "Faça login!";
    return res.redirect("/");
  }

  const aluno = req.session.aluno;
  const notas = req.session.notas ?? [];

  const media =
    notas.length > 0
      ? notas.reduce((total, nota) => total + nota, 0) / notas.length
      : 0;

  let situacao = "Reprovado";

  if (media >= 7) {
    situacao = "Aprovado";
  } else if (media >= 5) {
    situacao = "Recuperação";
  }

  const flash = req.session.flash;

  req.session.flash = null;

  res.render("boletim", {
    aluno,
    notas,
    media,
    situacao,
    flash
  });
});
notasRoutes.get("/boletim", (req: Request, res: Response) => {
  // 🎯 TODO 6: verificar login, calcular média/situação, renderizar
  res.redirect("/");
});

// ============================================================
// 🎯 ROTA 4: POST /nota — Adicionar nota ao array
// Validar 0-10, push em session.notas, flash "Nota X adicionada!"
// ============================================================
notasRoutes.post("/nota", (req, res) => {
  if (!req.session.aluno) {
    req.session.flash = "Faça login!";
    return res.redirect("/");
  }

  const nota = Number(req.body.nota);

  if (isNaN(nota) || nota < 0 || nota > 10) {
    req.session.flash = "A nota deve estar entre 0 e 10.";
    return res.redirect("/boletim");
  }

  req.session.notas ??= [];

  req.session.notas.push(nota);

  req.session.flash = `Nota ${nota} adicionada!`;

  res.redirect("/boletim");
});

// ============================================================
// 🎯 ROTA 5: POST /limpar — Zerar notas
// session.notas = [], flash "Notas zeradas!"
// ============================================================
notasRoutes.post("/limpar", (req, res) => {
  if (!req.session.aluno) {
    req.session.flash = "Faça login!";
    return res.redirect("/");
  }

  req.session.notas = [];

  req.session.flash = "Notas zeradas!";

  res.redirect("/boletim");
});

// ============================================================
// 🎯 ROTA 6: GET /sair — Destruir session
// req.session.destroy(() => res.redirect("/"))
// ============================================================
notasRoutes.get("/sair", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});