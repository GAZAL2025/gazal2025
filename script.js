import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// إعداد Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD7H0KEqtBx4TFQX80jFbYbnoiN8HBOUD0",
  authDomain: "ghazal-2025.firebaseapp.com",
  projectId: "ghazal-2025",
  storageBucket: "ghazal-2025.appspot.com",
  messagingSenderId: "991237133972",
  appId: "1:991237133972:web:ee881d54f94e7d20690681"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const productsRef = collection(db, "products");

// إضافة منتج
async function addProduct(name, price, imageBase64) {
  await addDoc(productsRef, {
    name,
    price,
    image: imageBase64
  });
}

// عرض المنتجات
async function displayProducts() {
  const productList = document.getElementById("productList");
  productList.innerHTML = "";

  const snapshot = await getDocs(productsRef);
  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${data.image}" alt="${data.name}" class="product-img" />
      <h3>${data.name}</h3>
      <p>السعر: ${data.price} ريال</p>
      <button class="delete-btn" data-id="${docSnap.id}">🗑 حذف</button>
      <button class="cart-btn" data-id="${docSnap.id}">🛒 أضف للسلة</button>
    `;
    productList.appendChild(card);
  });

  document.querySelectorAll(".delete-btn").forEach(button => {
    button.addEventListener("click", async (e) => {
      const id = e.target.dataset.id;
      await deleteDoc(doc(db, "products", id));
      displayProducts();
    });
  });

  document.querySelectorAll(".cart-btn").forEach(button => {
    button.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      const card = e.target.closest(".product-card");
      const name = card.querySelector("h3").textContent;
      const price = parseFloat(card.querySelector("p").textContent.replace(/[^\d]/g, ''));
      const image = card.querySelector("img").src;

      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      cart.push({ id, name, price, image });
      localStorage.setItem("cart", JSON.stringify(cart));
      alert("تمت إضافة المنتج إلى السلة");
    });
  });
}

// عند إرسال النموذج
document.getElementById("productForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("productName").value.trim();
  const price = parseFloat(document.getElementById("productPrice").value);
  const imageInput = document.getElementById("productImage");
  const file = imageInput.files[0];

  if (!name || isNaN(price) || !file) {
    alert("يرجى تعبئة جميع الحقول");
    return;
  }

  const reader = new FileReader();
  reader.onload = async function (e) {
    const imageBase64 = e.target.result;
    await addProduct(name, price, imageBase64);
    document.getElementById("productForm").reset();
    displayProducts();
  };
  reader.readAsDataURL(file);
});

// عرض المنتجات عند التحميل
window.addEventListener("DOMContentLoaded", () => {
  displayProducts();
});
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
