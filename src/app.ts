
// ============================================================
// src/app.ts — Portal de Notas
// ============================================================

import express from "express";
// 🎯 TODO 1: importar express-session
import session from "express-session";
import { notasRoutes } from "./routes/notasRoutes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================================
// 🎯 TODO 2: configurar express-session
app.use(
  session({
    secret: "portal-notas-senac-2026",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 60 * 1000,
      httpOnly: true,
      secure: false
    }
  })
);
// ============================================================



// ============================================================

app.set("view engine", "ejs");
app.set("views", "./src/views");
app.use(express.static("public"));

app.use(notasRoutes);

app.listen(3000, () => {
  console.log("✅ Portal de Notas rodando em http://localhost:3000");
});
