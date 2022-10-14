const express = require('express');

const router = express.Router();

router.get('/users', async (req, res) => {});

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
