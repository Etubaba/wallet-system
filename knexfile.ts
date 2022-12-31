// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  production: {
    client: "mysql2",
    connection: {
      host: "containers-us-west-100.railway.app",
      port: 5591,
      database: "railway",
      user: "root",
      password: "ikPjB7bhCCuRg8zEtGTD",
    },
    // pool: {
    //   min: 2,
    //   max: 10,
    // },
    // migrations: {
    //   tableName: 'knex_migrations',
    // },
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
      directory: "src/db/migrations",
      tableName: "migrations",
      // stub: 'src/databases/stubs',
    },
    seeds: {
      directory: "src/db/seeds",
      // stub: 'src/databases/stubs',
    },
  },
};
