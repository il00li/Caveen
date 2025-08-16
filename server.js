require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 5000;

// اتصال بقاعدة بيانات PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// إنشاء جدول المنتجات إذا لم يكن موجودًا
async function createProductsTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        code VARCHAR(20) UNIQUE NOT NULL,
        name VARCHAR(100) NOT NULL,
        category VARCHAR(20) NOT NULL,
        price INTEGER NOT NULL,
        image VARCHAR(255) NOT NULL,
        description TEXT
      );
    `);
    console.log('تم إنشاء/التأكد من جدول المنتجات');
  } catch (err) {
    console.error('خطأ في إنشاء الجدول:', err);
  }
}

// Routes
app.get('/api/products', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM products');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/products', async (req, res) => {
  const { code, name, category, price, image, description } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO products (code, name, category, price, image, description) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [code, name, category, price, image, description]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM products WHERE id = $1', [req.params.id]);
    res.json({ message: 'تم حذف المنتج بنجاح' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// بدء الخادم بعد التأكد من اتصال قاعدة البيانات
createProductsTable().then(() => {
  app.listen(PORT, () => {
    console.log(`الخادم يعمل على المنفذ ${PORT}`);
  });
});
