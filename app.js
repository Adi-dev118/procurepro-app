const express = require('express');
const path = require('path');
const app = express();
const session = require('express-session');
const RedisStore = require('connect-redis').RedisStore;

// REQUIRED ROUTING FILES
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/product');
const orderRoutes = require('./routes/order');
const cartRoutes = require('./routes/cart');
const adminRoutes = require('./routes/admin');
const companyRoutes = require('./routes/company');
const vendorRoutes = require('./routes/vendor');
const rfqRoutes = require('./routes/rfq');
const { createClient } = require('redis');

//EJS VIEW SETUP
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//MIDDLEWARE
app.use(express.json());

app.use('/assets', express.static(path.join(__dirname, 'views/assets')));

const redisClient = createClient({
   url: "redis://127.0.0.1:6379"
});
redisClient.on("connect", () => {
  console.log("✅ Redis Connected");
});

redisClient.on("error", (err) => {
  console.log("Redis Error:", err);
});

redisClient.connect().catch(console.error)

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24
    }
  }),
);

// API ROUTERS
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/carts', cartRoutes);
app.use('/api/v1/rfq', rfqRoutes);

// VIEWS ROUTES
app.use('/', vendorRoutes);
app.use('/', adminRoutes);
app.use('/', companyRoutes);

module.exports = app;
