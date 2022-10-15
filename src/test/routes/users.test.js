const request = require('supertest');
const app = require('../../app');
const buildApp = require('../../app');
const UserRepo = require('../../repos/user-repo');

it('create a user', async () => {
  const startingCount = await UserRepo.count();
  expect(startingCount).toEqual(0);
  const username = 'coast',
    bio = 'hi hello';

  await request(app).post('/users').send({ username, bio });
  expect(200);
  const finishCount = await UserRepo.count();
  expect(finishCount).toEqual(startingCount + 1);
});
