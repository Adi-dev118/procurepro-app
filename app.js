const express = require('express');
const path = require('path');
const app = express();
const session = require('express-session');
const RedisStore = require('connect-redis').RedisStore;

// REQUIRED ROUTING FILES
const adminPages = require('./routes/admin');
const companyPages = require('./routes/company');
const vendorPages = require('./routes/vendor');
const authRoutes = require('./routes/authentication');
const apiRoutes = require('./routes');
const { createClient } = require('redis');

//EJS VIEW SETUP
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//MIDDLEWARE
app.use(express.json());

app.use('/assets', express.static(path.join(__dirname, 'views/assets')));

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
});
redisClient.on('connect', () => {
  console.log('✅ Redis Connected');
});

redisClient.on('error', (err) => {
  console.log('Redis Error:', err);
});
redisClient.connect().catch(console.error);

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  }),
);
app.use('/', authRoutes);
app.use('/admin', adminPages);
app.use('/vendor', vendorPages);
app.use('/company', companyPages);
app.use(apiRoutes);

app.use((req, res) => {
  res.status(404).json({ status: 'fail', message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ status: 'error', message: 'Internal server error' });
});

module.exports = app;
