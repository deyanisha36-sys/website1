// Sample pre-designed T-shirts
const products = [
  {
    id: 1,
    name: "White Logo Tee",
    image: "assets/product1.png",
    price: 499,
    colors: ["red", "white", "black"],
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 2,
    name: "Black Classic Tee",
    image: "assets/product2.png",
    price: 599,
    colors: ["black", "white"],
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 3,
    name: "Blue Cool Tee",
    image: "assets/product3.png",
    price: 549,
    colors: ["blue", "white"],
    sizes: ["S", "M", "L", "XL"]
  }
];

// Load products
const productsGrid = document.getElementById("productsGrid");

products.forEach(product => {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <img src="${product.image}" alt="${product.name}">
    <h3>${product.name}</h3>
    <p>Price: ₹${product.price}</p>
    <label>Color:
      <select id="color-${product.id}">
        ${product.colors.map(c => `<option value="${c}">${c}</option>`).join("")}
      </select>
    </label><br><br>
    <label>Size:
      <select id="size-${product.id}">
        ${product.sizes.map(s => `<option value="${s}">${s}</option>`).join("")}
      </select>
    </label><br><br>
    <button onclick="addToCart(${product.id})">Add to Cart</button>
  `;
  productsGrid.appendChild(card);
});

// Cart array
let cart = [];

// Add to Cart function
function addToCart(id) {
  const product = products.find(p => p.id === id);
  const color = document.getElementById(`color-${id}`).value;
  const size = document.getElementById(`size-${id}`).value;

  const cartItem = {
    id: product.id,
    name: product.name,
    price: product.price,
    color: color,
    size: size,
    qty: 1
  };

  cart.push(cartItem);
  alert(`${product.name} added to cart!`);
  updateCartCount();
}

// Update cart count
function updateCartCount() {
  const cartCount = document.getElementById("cartCountHome");
  if(cartCount) cartCount.innerText = cart.length;
}
