const request = require('supertest');
const app = require('../../app');
const UserRepo = require('../../repos/user-repo');
const pool = require('../../pool');
const { randomBytes } = require('crypto');
const { default: migrate } = require('node-pg-migrate');
const format = require('pg-format');

beforeAll(async () => {
  // randomly generate a role name to PG as (must start with letter)
  const roleName = 'a' + randomBytes(4).toString('hex');

  // connect to PG as usual
  await pool.connect({
    host: 'localhost',
    port: 5432,
    database: 'socialnetwork-test',
    user: 'conorney',
    password: '',
  });

  // create a new role
  await pool.query(`
    CREATE ROLE ${roleName} WITH LOGIN PASSWORD '${roleName}'
  `);

  // create a schema with the same name
  await pool.query(`
    CREATE SCHEMA ${roleName} AUTHORIZATION ${roleName}
  `);

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
      username: roleName,
      password: roleName,
    },
  });
  // connect to pg
  return pool.connect({
    host: 'localhost',
    port: 5432,
    database: 'socialnetwork-test',
    username: roleName,
    password: roleName,
  });
});

afterAll(() => {
  return pool.close();
});

it('create a user', async () => {
  const startingCount = await UserRepo.count();

  const username = 'coast',
    bio = 'hi hello';

  await request(app()).post('/users').send({ username, bio }).expect(200);
  const finishCount = await UserRepo.count();
  expect(finishCount - startingCount).toEqual(1);
});
