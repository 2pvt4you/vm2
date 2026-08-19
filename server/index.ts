import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { initDb, pool } from './db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

// Initialize database (silently fail/warn if URL not provided or connection fails)
if (process.env.DATABASE_URL) {
  initDb().catch((err) => {
    console.error('Database connection failed, but proceeding in fallback mode:', err);
  });
} else {
  console.warn('DATABASE_URL is missing. DB features will operate in memory/log-only fallback mode.');
}

// 1. Submit contact inquiry
app.post('/api/contact', async (req, res) => {
  const { name, email, phone, message } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and Email are required.' });
  }

  try {
    if (process.env.DATABASE_URL) {
      const query = `
        INSERT INTO inquiries (name, email, phone, message)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `;
      const result = await pool.query(query, [name, email, phone || null, message || null]);
      console.log('Inquiry saved to database:', result.rows[0]);
      return res.status(200).json({ success: true, inquiry: result.rows[0] });
    } else {
      console.log('[FALLBACK] Contact form submission:', { name, email, phone, message });
      return res.status(200).json({ success: true, fallback: true });
    }
  } catch (error) {
    console.error('Failed to process contact inquiry:', error);
    return res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

// 2. Download brochure & log event
app.get('/api/brochure/download', async (req, res) => {
  const brochurePath = path.join(__dirname, '../assets/Varaha_Metaliks_Brochure.pdf');
  const fallbackPath = path.join(__dirname, '../public/assets/Varaha_Metaliks_Brochure.pdf');
  const ipAddress = req.ip || req.headers['x-forwarded-for'] || 'unknown';
  const userAgent = req.headers['user-agent'] || 'unknown';

  try {
    if (process.env.DATABASE_URL) {
      const query = `
        INSERT INTO brochure_downloads (ip_address, user_agent)
        VALUES ($1, $2);
      `;
      await pool.query(query, [String(ipAddress), String(userAgent)]);
    } else {
      console.log('[FALLBACK] Brochure downloaded by IP:', ipAddress);
    }
  } catch (error) {
    // We log but don't block the actual download if DB insert fails
    console.warn('Failed to log brochure download event to DB:', error);
  }

  // Send PDF file
  res.download(brochurePath, 'Varaha_Metaliks_Brochure.pdf', (err) => {
    if (err) {
      res.download(fallbackPath, 'Varaha_Metaliks_Brochure.pdf', (err2) => {
        if (err2) {
          console.error('Brochure file download failed:', err2);
          if (!res.headersSent) {
            res.status(404).send('Brochure PDF file not found on the server.');
          }
        }
      });
    }
  });
});

// Serve frontend build in production
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
