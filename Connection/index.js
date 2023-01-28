const { connect } = require("mongoose");
const { CONFIG } = require("../Config/config");

const InitDBConnection = async () => {
  const DB = CONFIG.db;

  try {
    await connect(DB);
    console.log("Database connected");
  } catch (err) {
    throw err;
  }
};

module.exports = InitDBConnection;
