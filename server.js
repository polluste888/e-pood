require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const DATA_DIR = path.join(__dirname, 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');

// Andmete tekitamine
const initData = async () => {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
    if (!fs.existsSync(PRODUCTS_FILE)) {
        try {
            console.log("Hangun andmed FakeStoreAPI-st...");
            const res = await fetch('https://fakestoreapi.com/products?limit=10');
            const data = await res.json();
            fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(data, null, 2));
            console.log("10 toodet salvestatud!");
        } catch (err) {
            console.error("Viga:", err);
        }
    }
};
initData();

// API otspunktid
app.get('/api/products', (req, res) => {
    const data = fs.readFileSync(PRODUCTS_FILE, 'utf8');
    res.json(JSON.parse(data));
});

app.get('/api/categories', (req, res) => {
    const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8'));
    const cats = [...new Set(products.map(p => p.category))];
    res.json(cats);
});

app.listen(PORT, () => {
    console.log(`ANDMETE SERVER TÖÖTAB PORDIL ${PORT}`);
    console.log(`Tooted saadaval: http://localhost:${PORT}/api/products`);
});