import { Product } from "./constructors/product.js";

const BASE_URL = "http://localhost:5000/api";

async function fetchData(endpoint) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    if (!response.ok) throw new Error(`Serveri viga: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`Viga pärimisel (${endpoint}):`, error);
    return null;
  }
}

export async function FetchProducts() {
  const products = await fetchData("/products");
  return (products || []).map(
    (item) =>
      new Product(
        item.id,
        item.title,
        item.price,
        item.category,
        item.image,
        item.description
      )
  );
}

export async function FetchProductsByCategory(category) {
  const products = await fetchData(`/products/category/${category}`);
  return (products || []).map(
    (item) =>
      new Product(
        item.id,
        item.title,
        item.price,
        item.category,
        item.image,
        item.description
      )
  );
}

export async function FetchCategories() {
  const categories = await fetchData("/categories");
  return categories || [];
}

export async function FetchProductById(id) {
  const item = await fetchData(`/products/${id}`);
  if (!item) return null;
  return new Product(
    item.id,
    item.title,
    item.price,
    item.category,
    item.image,
    item.description
  );
}

export async function FetchFavorites() {
  const favorites = await fetchData("/favorites");
  return favorites || [];
}

export async function AddFavorite(product) {
  try {
    const response = await fetch(`${BASE_URL}/favorites`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    return await response.json();
  } catch (error) {
    console.error("Viga lemmiku lisamisel:", error);
  }
}

export async function RemoveFavorite(productId) {
  try {
    const response = await fetch(`${BASE_URL}/favorites/${productId}`, {
      method: "DELETE",
    });
    return await response.json();
  } catch (error) {
    console.error("Viga lemmiku eemaldamisel:", error);
  }
}

export async function FetchCustomer() {
  const data = await fetchData("/data");
  return data ? data.customer : null;
}
