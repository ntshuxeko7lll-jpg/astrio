import express, { Request, Response } from 'express';
import pool from '../database';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Get all content for user
router.get('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const result = await pool.query(
      'SELECT * FROM content WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch content' });
  }
});

// Create content
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { title, description, type } = req.body;

    if (!title || !type) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await pool.query(
      'INSERT INTO content (user_id, title, description, type) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, title, description, type]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create content' });
  }
});

// Update content
router.put('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;
    const { title, description, type } = req.body;

    const result = await pool.query(
      'UPDATE content SET title = $1, description = $2, type = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 AND user_id = $5 RETURNING *',
      [title, description, type, id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Content not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update content' });
  }
});

// Delete content
router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM content WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Content not found' });
    }

    res.json({ message: 'Content deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete content' });
  }
});

export default router;
