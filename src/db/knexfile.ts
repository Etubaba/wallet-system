// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

module.exports = {
  production: {
    client: "mysql2",
    connection: {
      host: "containers-us-west-34.railway.app",
      port: 6537,
      database: "railway",
      user: "root",
      password: "96C3igw0PcNO2IoI24U1",
    },
    // pool: {
    //   min: 2,
    //   max: 10,
    // },
    migrations: {
      tableName: "knex_migrations",
    },
  },

  development: {
    client: "mysql2",
    connection: {
      host: "127.0.0.1",

      user: "etubaba",

      password: "mun2la@@",

      database: "lendsqr",
    },
    migrations: {
      directory: "./src/db/migrations",
      tableName: "migrations",
      // stub: 'src/databases/stubs',
    },
    seeds: {
      directory: "/seeds",
      // stub: 'src/databases/stubs',
    },
  },
};
