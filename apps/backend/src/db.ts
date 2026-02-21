import { Pool } from 'pg';
  console.log('DB URL USED BY BACKEND:', process.env.DATABASE_URL)

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})
