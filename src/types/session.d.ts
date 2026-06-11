import "express-session";

declare module "express-session" {
  interface SessionData {
    aluno?: string;s
    notas?: number[];
    flash?: string | null;
  }
}

export {};