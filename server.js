const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5000;
const DATA_FILE = './data.json';

app.use(cors());
app.use(express.json());
app.use(express.static('./'));

async function prepareData() {
    try {
        let shouldFetch = false;

        // 1. Kontrollime, kas fail on olemas
        if (!fs.existsSync(DATA_FILE)) {
            shouldFetch = true;
        } else {
            // 2. Kui on olemas, kontrollime, kas see on tühi
            const stats = fs.statSync(DATA_FILE);
            if (stats.size < 10) { // Kui fail on peaaegu tühi (alla 10 baidi)
                shouldFetch = true;
            }
        }

        if (shouldFetch) {
            console.log("Andmefail on tühi või puudu. Tõmban FakeStoreAPI-st uued andmed...");
            const response = await fetch('https://fakestoreapi.com/products?limit=10');
            const products = await response.json();

            const initialData = {
                products: products,
                customer: { name: "E-poe Kasutaja", email: "klienditugi@e-pood.ee" }
            };

            fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
            console.log("✅ data.json on nüüd uute andmetega täidetud.");
        } else {
            console.log("✅ Kasutan olemasolevat data.json faili.");
        }
        
        app.listen(PORT, () => {
            console.log(`🚀 Server: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Viga ettevalmistamisel:", error);
    }
}

// API otspunkt
app.get('/api/data', (req, res) => {
    try {
        const rawData = fs.readFileSync(DATA_FILE, 'utf8');
        const shopData = JSON.parse(rawData);
        res.json(shopData);
    } catch (e) {
        res.status(500).json({ error: "Andmete lugemine ebaõnnestus" });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

prepareData();