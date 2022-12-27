const path = require("path");

let env_path = null;

switch (process.env.NODE_ENV) {
  case "dev":
    env_path = path.join(process.cwd(), "Config", ".env.develop");
    break;
  case "staging":
    env_path = path.join(process.cwd(), "Config", ".env.staging");
    break;
  case "production":
    env_path = path.join(process.cwd(), "Config", ".env.production");
    break;
}

require("dotenv").config({ path: env_path });

const { DB_URL } = process.env;

const CONFIG = {
  db: DB_URL,
};

module.exports = { CONFIG };
