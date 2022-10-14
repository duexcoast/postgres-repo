const express = require('express');
const UserRepo = require('../repos/user-repo');

const router = express.Router();

router.get('/users', async (req, res) => {
  //Run a query to get all users
  const users = await UserRepo.find();

  // send the result back
  res.send(users);
});

router.post('/users', async (req, res) => {});

router.get('/users/:id', async (req, res) => {
  const { id } = req.params;
});

router.put('/users/:id', async (req, res) => {
  const { id } = req.params;
});

router.delete('/users/:id', async (req, res) => {
  const { id } = req.params;
});

module.exports = router;
