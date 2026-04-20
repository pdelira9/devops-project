const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(express.json());
app.use(express.static('public'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('DB connected'))
  .catch(err => console.log(err));

app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: "OK",
    uptime: process.uptime()
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

const client = require('prom-client');

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests'
});

app.use((req, res, next) => {
  httpRequestCounter.inc();
  next();
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

module.exports = app;