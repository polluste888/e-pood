import { Product } from "./constructors/product.js";

const API_URL = "http://localhost:5000/api/data";

export async function FetchProducts() {
  const response = await fetch(API_URL);
  const data = await response.json();

  // Jääb samaks, sest struktuur on data.products
  return data.products.map(item =>
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

export async function FetchCustomer() {
  const response = await fetch(API_URL);
  const data = await response.json();
  return data.customer; 
}