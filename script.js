// إعداد Firebase
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

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
const storage = getStorage(app);

// دالة لإضافة منتج
export async function addProduct() {
  const name = document.getElementById("productName").value.trim();
  const price = parseFloat(document.getElementById("productPrice").value);
  const imageInput = document.getElementById("productImage");
  const file = imageInput.files[0];

  if (!name || isNaN(price) || !file) {
    alert("يرجى إدخال كل البيانات.");
    return;
  }

  // رفع الصورة إلى Firebase Storage
  const storageRef = ref(storage, `product-images/${file.name}`);
  await uploadBytes(storageRef, file);
  const imageUrl = await getDownloadURL(storageRef);

  // إضافة المنتج إلى Firestore
  await addDoc(productsRef, {
    name,
    price,
    image: imageUrl
  });

  // إعادة عرض المنتجات
  displayProducts();

  // إعادة تعيين الحقول
  document.getElementById("productName").value = "";
  document.getElementById("productPrice").value = "";
  imageInput.value = "";
}

// دالة لحذف منتج
export async function deleteProduct(productId) {
  await deleteDoc(doc(db, "products", productId));
  displayProducts();
}

// دالة لعرض المنتجات
export async function displayProducts() {
  const productList = document.getElementById("productList");
  productList.innerHTML = "";

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

// دالة لتغليف الحذف (لأن onclick يحتاج دالة في window)
window.deleteProductById = async function (id) {
  await deleteProduct(id);
};

// دالة لإضافة منتج إلى السلة
window.addToCart = function (id, name, price, image) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push({ id, name, price, image });
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("تمت إضافة المنتج إلى السلة");
};

// عند تحميل الصفحة
window.addEventListener("DOMContentLoaded", () => {
  displayProducts();
});



// السلة محلياً
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(id, name, price, image) {
  const existing = cart.find(p => p.id === id);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ id, name, price: parseFloat(price), image, quantity: 1 });
  }
  saveCart();
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


