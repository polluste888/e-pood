import { Product } from "./constructors/product.js";

const DATA_URL = "./data.json";

export async function FetchProducts() {
    try {
        const response = await fetch(DATA_URL);
        if (!response.ok) throw new Error("Andmefaili ei leitud!");
        
        const data = await response.json();
        const rawProducts = Array.isArray(data) ? data : data.products;

        return rawProducts.map(item => {
            const p = new Product(
                item.id, item.title, item.price, 
                item.category, item.image, item.description
            );
            // Lisame ratingu, et tärnid ja laoseis ilmuksid (nagu su pildil)
            p.rating = item.rating || { rate: item.rate || 0, count: item.count || 0 };
            return p;
        });
    } catch (error) {
        console.error("Viga api.js:", error);
        return [];
    }
}

export async function FetchCategories() {
    const all = await FetchProducts();
    return [...new Set(all.map(p => p.category))];
}