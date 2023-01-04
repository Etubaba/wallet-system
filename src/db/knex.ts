// import knex from "knex";
// import knexfile from "./knexfile";

// const db = knex(knexfile.development);

// export default db;
const environment = process.env.NODE_ENV || "development";
const config = require("./knexfile")[environment];
const knex = require("knex")(config);

module.exports = knex;
