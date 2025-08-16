require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// تكوين اتصال قاعدة البيانات
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// إنشاء جدول المنتجات إذا لم يكن موجوداً
async function createProductsTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        code VARCHAR(50) UNIQUE NOT NULL,
        category VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        price VARCHAR(50) NOT NULL,
        description TEXT,
        image_url VARCHAR(255)
      );
    `);
    console.log("Products table created or exists");
  } catch (err) {
    console.error("Error creating products table", err);
  }
}

createProductsTable();

// نقاط نهاية API للمنتجات

// الحصول على جميع المنتجات
app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// إضافة منتج جديد
app.post('/api/products', async (req, res) => {
  const { code, category, title, price, description, image_url } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO products (code, category, title, price, description, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [code, category, title, price, description, image_url]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// حذف منتج
app.delete('/api/products/:code', async (req, res) => {
  const { code } = req.params;

  try {
    await pool.query('DELETE FROM products WHERE code = $1', [code]);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// جميع الطلبات الأخرى تعيد index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
