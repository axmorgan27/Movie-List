const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'movies_db',
    password: 'scrappy',
    port: 5432,
});

// Get all movies
app.get('/movies', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM movies');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Search movies by title
app.get('/movies/search', async (req, res) => {
    const { title } = req.query;
    try {
        const result = await pool.query(
            'SELECT * FROM movies WHERE title ILIKE $1',
            [`%${title}%`]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Add a new movie
app.post('/movies', async (req, res) => {
    const { title, watched } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO movies (title, watched) VALUES ($1, $2) RETURNING *',
            [title, watched]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Delete a movie
app.delete('/movies/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM movies WHERE id = $1', [id]);
        res.sendStatus(204);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Update watched status
app.patch('/movies/:id', async (req, res) => {
    const { id } = req.params;
    const { watched } = req.body;
    try {
        const result = await pool.query(
            'UPDATE movies SET watched = $1 WHERE id = $2 RETURNING *',
            [watched, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

app.listen(3001, () => {
    console.log('Server running on http://localhost:3001');
});