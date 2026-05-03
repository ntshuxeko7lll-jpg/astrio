import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../database';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

interface SignupRequest {
  username: string;
  email: string;
  password: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

// Signup
router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body as SignupRequest;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, email, hashedPassword]
    );

    const token = jwt.sign({ id: result.rows[0].id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'User created successfully',
      user: result.rows[0],
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Signup failed' });
  }
});

// Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as LoginRequest;

    if (!email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login successful',
      user: { id: user.id, username: user.username, email: user.email },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
});

export default router;
