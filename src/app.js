const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const errorHandler = require('./middlewares/error.middleware');
const categoryRoutes = require('./routes/category.routes');
const productRoutes = require('./routes/product.routes');
const authRoutes = require('./routes/auth.routes');
const path = require('path');
const productImageRoutes = require('./routes/productImage.routes');
const cartRoutes = require('./routes/cart.routes');
const wishlistRoutes = require('./routes/wishlist.routes');
const orderRoutes = require('./routes/order.routes');
const paymentRoutes = require('./routes/payment.routes');
const adminRoutes = require('./routes/admin.routes');
const addressRoutes = require('./routes/address.routes');
const shipmentRoutes = require('./routes/shipment.routes');

const app = express();

//Middleware
app.use(express.json());
app.use(
  cors({
    origin: [
      'https://krivaura.com',
      'https://www.krivaura.com',
      'http://localhost:3000',
    ],
    credentials: true,
  }),
);
app.use(helmet());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'KrivAura API is Live 🚀',
    version: '1.0.0',
  });
});
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/api/v1/products', productImageRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/wishlist', wishlistRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/addresses', addressRoutes);
app.use('/api/v1/shipments', shipmentRoutes);

app.use(errorHandler);
module.exports = app;
