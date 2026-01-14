const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 5000;
const DATA_FILE = "./data.json";

app.use(cors());
app.use(express.json());
app.use(express.static("./"));

const getShopData = () => {
  const rawData = fs.readFileSync(DATA_FILE, "utf8");
  return JSON.parse(rawData);
};

const saveShopData = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

app.get("/api/products", (req, res) => {
  const data = getShopData();
  res.json(data.products);
});

app.get("/api/categories", (req, res) => {
  const data = getShopData();
  const categories = [...new Set(data.products.map((p) => p.category))];
  res.json(categories);
});

app.get("/api/products/category/:categoryName", (req, res) => {
  const data = getShopData();
  const filtered = data.products.filter(
    (p) => p.category.toLowerCase() === req.params.categoryName.toLowerCase()
  );
  res.json(filtered);
});

app.get("/api/products/:id", (req, res) => {
  const data = getShopData();
  const product = data.products.find((p) => p.id == req.params.id);
  product ? res.json(product) : res.status(404).send("Toodet ei leitud");
});

app.get("/api/favorites", (req, res) => {
  const data = getShopData();
  res.json(data.favorites || []);
});

app.post("/api/favorites", (req, res) => {
  const product = req.body;
  const data = getShopData();

  if (!data.favorites) data.favorites = [];

  const exists = data.favorites.find((f) => f.id === product.id);
  if (!exists) {
    data.favorites.push(product);
    saveShopData(data);
  }

  res.status(201).json(data.favorites);
});

app.delete("/api/favorites/:id", (req, res) => {
  const productId = parseInt(req.params.id);
  const data = getShopData();

  if (data.favorites) {
    data.favorites = data.favorites.filter((f) => f.id !== productId);
    saveShopData(data);
  }

  res.json(data.favorites);
});

app.get("/api/data", (req, res) => {
  res.json(getShopData());
});

async function prepareData() {
  try {
    let shouldFetch = false;
    if (!fs.existsSync(DATA_FILE)) {
      shouldFetch = true;
    } else {
      const stats = fs.statSync(DATA_FILE);
      if (stats.size < 10) shouldFetch = true;
    }

    if (shouldFetch) {
      console.log("Tõmban andmed API-st...");
      const response = await fetch(
        "https://fakestoreapi.com/products?limit=10"
      );
      const products = await response.json();
      const initialData = {
        products: products,
        favorites: [],
        customer: { name: "E-poe Kasutaja", email: "klienditugi@e-pood.ee" },
      };
      saveShopData(initialData);
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server töötab: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Viga:", error);
  }
}

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

prepareData();
