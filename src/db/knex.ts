// import knex from "knex";

// const db = knex(knexfile.development);

// export default db;
const environment = process.env.NODE_ENV || "development";
const config = require("../../knexfile")[environment];
export const knex = require("knex")(config);

module.exports = knex;
