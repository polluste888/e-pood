import { Product } from "./constructors/product.js";

export async function FetchProducts() {
  const response = await fetch("./data.json");
  const data = await response.json();

 
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
  const response = await fetch("./data.json");
  const data = await response.json();
  return data.customer; 
}
