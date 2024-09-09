const express = require('express');
const router = express.Router();
const db = require('./db');  

router.get('/', (req, res) => {
    const sql = 'SELECT * FROM notes';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json(results);
    });
});


router.get('/:id', (req, res) => {
    const sql = 'SELECT * FROM notes WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ message: err.message });
        if (result.length === 0) return res.status(404).json({ message: 'Note non trouvée' });
        res.json(result[0]);
    });
});

router.post('/', (req, res) => {
    const { nom, prenom, classe, matiere, note } = req.body;
    const sql = 'INSERT INTO notes (nom, prenom, classe, matiere, note) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [nom, prenom, classe, matiere, note], (err, result) => {
        if (err) return res.status(500).json({ message: err.message });
        res.status(201).json({ id: result.insertId, nom, prenom, classe, matiere, note });
    });
});

router.put('/:id', (req, res) => {
    const { nom, prenom, classe, matiere, note } = req.body;
    const sql = 'UPDATE notes SET nom = ?, prenom = ?, classe = ?, matiere = ?, note = ? WHERE id = ?';
    db.query(sql, [nom, prenom, classe, matiere, note, req.params.id], (err, result) => {
        if (err) return res.status(500).json({ message: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Note non trouvée' });
        res.json({ id: req.params.id, nom, prenom, classe, matiere, note });
    });
});

router.delete('/:id', (req, res) => {
    const sql = 'DELETE FROM notes WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ message: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Note non trouvée' });
        res.json({ message: 'Note supprimée' });
    });
});

module.exports = router;
