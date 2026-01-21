// api.js
import { Product } from "./constructors/product.js";

export async function FetchProducts() {
    try {
        const response = await fetch("./data.json");
        if (!response.ok) throw new Error("Andmefaili ei leitud");
        
        const data = await response.json();
        const rawProducts = Array.isArray(data) ? data : (data.products || []);

        return rawProducts.map(item => {
            const p = new Product(
                item.id, item.title, item.price, 
                item.category, item.image, item.description
            );
            // Lisa ratingu objekt, et allProductsView ei läheks katki
            p.rating = item.rating || { rate: item.rate || 0, count: item.count || 0 };
            return p;
        });
    } catch (error) {
        console.error("Viga api.js-is:", error);
        return [];
    }
}