const express = require('express');
const UserRepo = require('../repos/user-repo');

const router = express.Router();

router.get('/users', async (req, res) => {
  //Run a query to get all users
  const users = await UserRepo.find();

  // send the result back
  res.send(users);
});

router.post('/users', async (req, res) => {
  const { username, bio } = req.body;
  const user = await UserRepo.insert(username, bio);
  if (user) {
    res.send(user);
  } else {
    res.sendStatus(404);
  }
});

router.get('/users/:id', async (req, res) => {
  const { id } = req.params;
  const user = await UserRepo.findById(id);
  if (user) {
    res.send(user);
  } else {
    res.status(404).send(`No user found with id: ${id}`);
  }
});

router.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { username, bio } = req.body;

  const user = await UserRepo.update(id, username, bio);
  if (user) {
    res.send(user);
  } else {
    res.sendStatus(404);
  }
});

router.delete('/users/:id', async (req, res) => {
  const { id } = req.params;

  const user = await UserRepo.delete(id);
  if (user) {
    res.send(user);
  } else {
    res.sendStatus(404);
  }
});

module.exports = router;
