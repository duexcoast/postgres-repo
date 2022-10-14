const express = require('express');
const pg = require('pg');

pg.Pool({});

const app = express();

app.get('/users', (req, res) => {});

app.post('/users', (req, res) => {});

app.get('/users/:id', (req, res) => {
  const { id } = req.params;
});

app.put('/users/:id', (req, res) => {
  const { id } = req.params;
});

app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
});
