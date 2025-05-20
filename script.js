let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function displayCartItems() {
  const container = document.getElementById("cartItems");
  const totalEl = document.getElementById("totalPrice");
  if (!container || !totalEl) return;

  container.innerHTML = "";
  let total = 0;

  cart.forEach(product => {
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <img src="${product.image}" width="50" />
      <strong>${product.name}</strong>
      <p>العدد: ${product.quantity || 1}</p>
      <p>السعر: ${product.price * (product.quantity || 1)} ريال</p>
      <button onclick="removeFromCart('${product.id}')">حذف من السلة</button>
    `;
    container.appendChild(div);
    total += product.price * (product.quantity || 1);
  });

  totalEl.innerText = `الإجمالي: ${total} ريال`;
}

function removeFromCart(id) {
  cart = cart.filter(p => p.id !== id);
  saveCart();
  displayCartItems();
}

if (document.getElementById("cartItems")) {
  displayCartItems();
}
