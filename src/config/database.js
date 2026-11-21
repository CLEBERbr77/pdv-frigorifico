const { Sequelize } = require("sequelize");
const { parse } = require("pg-connection-string");
require("dotenv").config();

// No Netlify, o banco é o Netlify Database (Postgres gerenciado). A string de
// conexão é fornecida automaticamente pela plataforma. Fora do Netlify
// (desenvolvimento local com `npm run dev`) continuam valendo as variáveis DB_*.
function obterConexaoNetlify() {
  try {
    const { getConnectionString } = require("@netlify/database");
    return getConnectionString();
  } catch {
    return null;
  }
}

function aplicarConexaoNetlify(config) {
  const url = obterConexaoNetlify();
  if (!url) return false;

  const dados = parse(url);
  config.host = dados.host;
  config.port = dados.port || 5432;
  config.username = dados.user;
  config.password = dados.password;
  config.database = dados.database;
  config.dialectOptions = {
    ...(config.dialectOptions || {}),
    ssl: dados.ssl || false,
  };
  return true;
}

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    logging: false,
    pool: { max: 5, idle: 10000 },
  },
);

// Lê a string de conexão a cada nova conexão, para sempre usar credenciais atuais.
sequelize.beforeConnect((config) => {
  aplicarConexaoNetlify(config);
});

module.exports = sequelize;
