/* eslint-disable no-undef */
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pkg from 'pg';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Отримання __dirname для ES6 модулів
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ініціалізація
dotenv.config();
const { Pool } = pkg;

const app = express();
const PORT = process.env.PORT || 5000; // Використовуємо порт з .env або 5000 за замовчуванням
const SALT_ROUNDS = 10;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images'))); // Обслуговування статичних зображень

// Підключення до PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

pool.connect()
  .then(() => console.log('✅ Connected to PostgreSQL'))
  .catch((err) => console.error('❌ Connection error', err));

// Маршрути API

// 1. Отримати всі категорії
app.get('/api/categories', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 2. Отримати всі товари
app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    // Додаємо шлях до зображення для кожного товару
    const products = result.rows.map(product => ({
      ...product,
      image_url: `/images/${product.id}.jpg`, // Припускаємо, що зображення називається як ID
    }));
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    const product = result.rows[0];

    // Обробка всіх зображень з масиву image_urls
    if (product.image_urls && Array.isArray(product.image_urls)) {
      product.image_base64 = product.image_urls.map((imageName) => {
        const imagePath = path.join(__dirname, 'images', imageName);
        if (fs.existsSync(imagePath)) {
          try {
            const image = fs.readFileSync(imagePath);
            return image.toString('base64');
          } catch (fileError) {
            console.error(`Помилка зчитування зображення ${imageName}:`, fileError);
            return null; // Або якесь значення за замовчуванням
          }
        } else {
          console.log(`Image not found: ${imageName}`);
          return null;
        }
      }).filter(img => img !== null); // Видаляємо null значення
    } else {
      product.image_base64 = [];
    }

    res.json(product);
  } catch (err) {
    console.error('Помилка отримання товару:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});



// 4. Додати новий товар
app.post('/api/products', async (req, res) => {
  const { name, description, price, category_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO products (name, description, price, category_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, description, price, category_id]
    );
    const newProduct = result.rows[0];
    newProduct.image_url = `/images/${newProduct.id}.jpg`; // Шлях до зображення
    res.status(201).json(newProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 5. Оновити товар
app.put('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, price, category_id } = req.body;
  try {
    const result = await pool.query(
      'UPDATE products SET name = $1, description = $2, price = $3, category_id = $4 WHERE id = $5 RETURNING *',
      [name, description, price, category_id, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    const updatedProduct = result.rows[0];
    updatedProduct.image_url = `/images/${updatedProduct.id}.jpg`; // Шлях до зображення
    res.json(updatedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 6. Видалити товар
app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 7. Отримання товарів за категорією
app.get('/api/categories/:id/products', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM products WHERE category_id = $1', [id]);
    const products = result.rows.map(product => ({
      ...product,
      image_url: `/images/${product.id}.jpg`, // Шлях до зображення
    }));
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 8. Пошук по сайту
app.get('/api/search', async (req, res) => {
  const searchQuery = req.query.q;
  try {
    const result = await pool.query(
      'SELECT * FROM products WHERE name ILIKE $1 OR description ILIKE $1',
      [`%${searchQuery}%`]
    );
    const products = result.rows.map(product => ({
      ...product,
      image_url: `/images/${product.id}.jpg`, // Шлях до зображення
    }));
    res.json(products);
  } catch (err) {
    console.error('Помилка пошуку товарів:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 9. Реєстрація користувача
app.post('/api/register', async (req, res) => {
  const { username, email, password, phone } = req.body;

  try {
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Користувач з таким email вже існує' });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const phoneValue = phone || null;

    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash, phone, user_type) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [username, email, hashedPassword, phoneValue, 'customer']
    );

    res.status(201).json({ success: true, message: 'Реєстрація пройшла успішно', user: result.rows[0] });
  } catch (err) {
    console.error('Помилка реєстрації:', err);
    res.status(500).json({ success: false, message: 'Внутрішня помилка сервера' });
  }
});

// 10. Вхід користувача
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(400).json({ success: false, message: 'Користувача не знайдено' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.rows[0].password_hash);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: 'Невірний пароль' });
    }

    const userData = {
      id: user.rows[0].id,
      name: user.rows[0].name,
      email: user.rows[0].email,
      phone: user.rows[0].phone,
      user_type: user.rows[0].user_type,
    };

    res.json({ success: true, message: 'Вхід успішний', user: userData });
  } catch (err) {
    console.error('Помилка входу:', err);
    res.status(500).json({ success: false, message: 'Внутрішня помилка сервера' });
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});