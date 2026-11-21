// Servidor da API do PDV no Netlify (Netlify Server).
// Reaproveita o app Express de src/app.js; os arquivos estáticos de public/
// continuam sendo servidos diretamente pela CDN do Netlify.
import app from "../../src/app.js";
import "../../src/models/index.js";

export default app;
