const { randomBytes } = require('crypto');
const { default: migrate } = require('node-pg-migrate');
const format = require('pg-format');
const pool = require('../pool');

const DEFAULT_OPTIONS = {
  host: 'localhost',
  port: 5432,
  database: 'socialnetwork-test',
  user: 'conorney',
  password: '',
};

class Context {
  static async build() {
    // randomly generate a role name to PG as (must start with letter)
    const roleName = 'a' + randomBytes(4).toString('hex');

    // connect to PG as usual
    await pool.connect(DEFAULT_OPTIONS);

    // create a new role
    await pool.query(
      format('CREATE ROLE %I WITH LOGIN PASSWORD %L;', roleName, roleName)
    );

    // create a schema with the same name
    await pool.query(
      format('CREATE SCHEMA %I AUTHORIZATION %I', roleName, roleName)
    );

    // disconnect entirely from pg
    await pool.close();

    // run our migrations in the new schema
    await migrate({
      schema: roleName,
      direction: 'up',
      log: () => {},
      // allows us to run multiple migrations simultaneously
      noLock: true,
      dir: 'migrations',
      databaseUrl: {
        host: 'localhost',
        port: 5432,
        database: 'socialnetwork-test',
        user: roleName,
        password: roleName,
      },
    });
    // connect to pg
    await pool.connect({
      host: 'localhost',
      port: 5432,
      database: 'socialnetwork-test',
      user: roleName,
      password: roleName,
    });
    return new Context(roleName);
  }
  constructor(roleName) {
    this.roleName = roleName;
  }

  async close() {
    // disconnect from pg
    await pool.close();
    // reconnect as root user
    await pool.connect(DEFAULT_OPTIONS);

    // Delete the role and the schema
    await pool.query(format('DROP SCHEMA %I CASCADE;', [this.roleName]));
    await pool.query(format('DROP ROLE %I;', [this.roleName]));

    // Disconnect
    await pool.close();
  }
}

module.exports = Context;
