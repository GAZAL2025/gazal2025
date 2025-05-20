// إعداد Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// تكوين Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD7H0KEqtBx4TFQX80jFbYbnoiN8HBOUD0",
  authDomain: "ghazal-2025.firebaseapp.com",
  projectId: "ghazal-2025",
  storageBucket: "ghazal-2025.appspot.com",
  messagingSenderId: "991237133972",
  appId: "1:991237133972:web:ee881d54f94e7d20690681"
};

// التهيئة
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const productsRef = collection(db, "products");

// دالة لإضافة منتج (بدون صورة مؤقتًا)
export async function addProduct() {
  const name = document.getElementById("productName").value.trim();
  const price = parseFloat(document.getElementById("productPrice").value);

  if (!name || isNaN(price)) {
    alert("يرجى إدخال اسم وسعر المنتج.");
    return;
  }

  try {
    await addDoc(productsRef, {
      name,
      price,
      image: "" // لا يوجد صورة الآن
    });

    alert("تمت إضافة المنتج بنجاح");
    displayProducts();

    // تفريغ الحقول
    document.getElementById("productName").value = "";
    document.getElementById("productPrice").value = "";
    document.getElementById("productImage").value = "";
  } catch (error) {
    console.error("حدث خطأ أثناء الإضافة:", error);
    alert("فشل في إضافة المنتج");
  }
}

// دالة لعرض المنتجات
export async function displayProducts() {
  const productList = document.getElementById("productList");
  productList.innerHTML = ""; // تفريغ القائمة

  const snapshot = await getDocs(productsRef);
  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const productCard = document.createElement("div");
    productCard.className = "product-card";

    productCard.innerHTML = `
      <img src="${data.image}" alt="${data.name}" class="product-img" />
      <h3>${data.name}</h3>
      <p>السعر: ${data.price} ريال</p>
      <button onclick="deleteProductById('${docSnap.id}')">🗑 حذف</button>
      <button onclick="addToCart('${docSnap.id}', '${data.name}', ${data.price}, '${data.image}')">🛒 أضف للسلة</button>
    `;

    productList.appendChild(productCard);
  });
}


// حذف منتج
export async function deleteProduct(productId) {
  await deleteDoc(doc(db, "products", productId));
  displayProducts();
}

// السماح بالوصول من HTML
window.deleteProductById = deleteProduct;

window.addToCart = function (id, name, price, image) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push({ id, name, price, image });
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("تمت إضافة المنتج إلى السلة");
};

window.addProduct = addProduct;

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

