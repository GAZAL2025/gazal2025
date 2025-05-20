// إعداد Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD7H0KEqtBx4TFQX80jFbYbnoiN8HBOUD0",
  authDomain: "ghazal-2025.firebaseapp.com",
  projectId: "ghazal-2025",
  storageBucket: "ghazal-2025.appspot.com",
  messagingSenderId: "991237133972",
  appId: "1:991237133972:web:ee881d54f94e7d20690681"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const productsRef = db.collection("products");

// عرض المنتجات عند التحميل
window.addEventListener("DOMContentLoaded", displayProducts);

// إضافة منتج جديد
document.getElementById("productForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("productName").value.trim();
  const price = parseFloat(document.getElementById("productPrice").value);
  const imageInput = document.getElementById("productImage");
  const file = imageInput.files[0];

  if (!name || isNaN(price) || !file) {
    alert("يرجى إدخال كل البيانات.");
    return;
  }

  const reader = new FileReader();
  reader.onload = async function (e) {
    const imageBase64 = e.target.result;

    await productsRef.add({
      name,
      price,
      image: imageBase64
    });

    // إعادة تعيين النموذج
    document.getElementById("productForm").reset();
    displayProducts();
  };
  reader.readAsDataURL(file);
});

// عرض المنتجات
async function displayProducts() {
  const productList = document.getElementById("productList");
  productList.innerHTML = "";

  const snapshot = await productsRef.get();
  snapshot.forEach((doc) => {
    const data = doc.data();
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <img src="${data.image}" alt="${data.name}" class="product-img" />
      <h3>${data.name}</h3>
      <p>السعر: ${data.price} ريال</p>
      <button onclick="deleteProduct('${doc.id}')">🗑 حذف</button>
      <button onclick="addToCart('${doc.id}', '${data.name}', ${data.price}, '${data.image}')">🛒 أضف للسلة</button>
    `;

    productList.appendChild(card);
  });
}

// حذف منتج
async function deleteProduct(id) {
  await productsRef.doc(id).delete();
  displayProducts();
}

// إضافة للسلة
function addToCart(id, name, price, image) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push({ id, name, price, image });
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("تمت إضافة المنتج إلى السلة");
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
      <p>العدد: ${product.quantity}</p>
      <p>السعر: ${product.price * product.quantity} ريال</p>
      <button onclick="removeFromCart('${product.id}')">حذف من السلة</button>
    `;
    container.appendChild(div);
    total += product.price * product.quantity;
  });

  totalEl.innerText = `الإجمالي: ${total} ريال`;
}

function removeFromCart(id) {
  cart = cart.filter(p => p.id !== id);
  saveCart();
  displayCartItems();
}

