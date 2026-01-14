import React, { useState, useEffect } from 'react';
import './style.css'; 

function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [view, setView] = useState('products'); 
  const [selectedCat, setSelectedCat] = useState('Kõik');

  
  const [userId] = useState(() => {
    const id = localStorage.getItem('epoed_userId');
    if (id) return id;
    const uusId = "ID-" + Math.floor(Math.random() * 1000000);
    localStorage.setItem('epoed_userId', uusId);
    return uusId;
  });

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('epoed_cart');
    return saved ? JSON.parse(saved) : [];
  });

 
  useEffect(() => {
    localStorage.setItem('epoed_cart', JSON.stringify(cart));
  }, [cart]);

  
  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Viga toodete laadimisel:", err));

    fetch('http://localhost:5000/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error("Viga kategooriate laadimisel:", err));
  }, []);

  
  const filteredProducts = selectedCat === 'Kõik' 
    ? products 
    : products.filter(p => p.category === selectedCat);

  
  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.price, 0).toFixed(2);
  };

  return (
    <div className="container">
      <header>
        <div className="logo" onClick={() => setView('products')}>
          <h1>MINU E-POOD</h1>
        </div>
        <nav>
          <ul>
            <li><button onClick={() => setView('products')}>Pood</button></li>
            <li><button onClick={() => setView('cart')}>Ostukorv ({cart.length})</button></li>
          </ul>
        </nav>
      </header>

      {view === 'products' ? (
        <main>
          <section className="filters">
            <h2>Kategooriad</h2>
            <div className="category-buttons">
              <button 
                className={selectedCat === 'Kõik' ? 'active' : ''} 
                onClick={() => setSelectedCat('Kõik')}
              >
                Kõik
              </button>
              {categories.map(cat => (
                <button 
                  key={cat} 
                  className={selectedCat === cat ? 'active' : ''}
                  onClick={() => setSelectedCat(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </section>

          <section className="product-display">
            <h2>Tooted</h2>
            <div id="product-list" className="product-grid">
              {filteredProducts.map(product => (
                <div key={product.id} className="product-card">
                  <div className="product-image">
                    <img src={product.image} alt={product.title} />
                  </div>
                  <div className="product-info">
                    <h3>{product.title.substring(0, 30)}...</h3>
                    <p className="price">{product.price} €</p>
                    <div className="product-buttons">
                      <button className="add-to-cart" onClick={() => addToCart(product)}>
                        Lisa ostukorvi
                      </button>
                      <button className="add-to-favorites" onClick={() => alert("Lisatud lemmikutesse!")}>
                        ❤️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      ) : (
        <section className="cart-view">
          <h2>Sinu ostukorv</h2>
          {cart.length === 0 ? (
            <p>Ostukorv on tühi.</p>
          ) : (
            <div className="cart-container">
              <ul className="cart-items">
                {cart.map((item, index) => (
                  <li key={index} className="cart-item">
                    <span>{item.title}</span>
                    <span>{item.price} €</span>
                  </li>
                ))}
              </ul>
              <div className="cart-summary">
                <h3>Kokku: {calculateTotal()} €</h3>
                <button className="checkout-btn">Vormista ost</button>
                <button className="clear-cart" onClick={() => setCart([])}>Tühjenda</button>
              </div>
            </div>
          )}
          <button className="back-btn" onClick={() => setView('products')}>Tagasi poodi</button>
        </section>
      )}
      
      <footer>
        <p>Kasutaja ID: {userId}</p>
        <p>&copy; 2024 Minu E-pood</p>
      </footer>
    </div>
  );
}

export default App;