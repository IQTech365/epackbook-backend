const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const { PROD_DB_URL, DEV_DB_URL, STAGE_DB_URL } = process.env;

let DB_URL = PROD_DB_URL;

// switch (process.env.NODE_ENV) {
//   case "dev":
//     DB_URL = DEV_DB_URL;
//     break;
//   case "staging":
//     DB_URL = STAGE_DB_URL;
//     break;
//   case "production":
//     DB_URL = PROD_DB_URL;
//     break;
// }

const CONFIG = {
  db: DB_URL,
};

module.exports = { CONFIG };
