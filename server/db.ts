import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Connection options
const connectionString = process.env.DATABASE_URL;
const sslEnabled = process.env.DATABASE_SSL !== 'false';

export const pool = new Pool({
  connectionString,
  ssl: sslEnabled ? { rejectUnauthorized: false } : false,
});

// Initialize Tables
export async function initDb() {
  const client = await pool.connect();
  try {
    console.log('Initializing database tables...');
    
    // Create inquiries table
    await client.query(`
      CREATE TABLE IF NOT EXISTS inquiries (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Create brochure_downloads table
    await client.query(`
      CREATE TABLE IF NOT EXISTS brochure_downloads (
        id SERIAL PRIMARY KEY,
        ip_address VARCHAR(100),
        user_agent TEXT,
        downloaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('Database tables verified/created successfully.');
  } catch (err) {
    console.error('Failed to initialize database tables:', err);
  } finally {
    client.release();
  }
}
