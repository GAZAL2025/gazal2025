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

// دالة لإضافة منتج
function addProduct() {
  const name = document.getElementById("productName").value.trim();
  const price = parseFloat(document.getElementById("productPrice").value);
  const imageInput = document.getElementById("productImage");
  const file = imageInput.files[0];

  if (!name || isNaN(price) || !file) {
    alert("يرجى تعبئة كل الحقول بشكل صحيح");
    return;
  }

  const reader = new FileReader();
  reader.onload = async function (e) {
    const imageBase64 = e.target.result;

    try {
      await productsRef.add({
        name,
        price,
        image: imageBase64
      });

      alert("تمت إضافة المنتج بنجاح");
      document.getElementById("productName").value = "";
      document.getElementById("productPrice").value = "";
      imageInput.value = "";
      displayProducts();
    } catch (error) {
      console.error("خطأ أثناء إضافة المنتج:", error);
      alert("حدث خطأ أثناء إضافة المنتج");
    }
  };

  reader.readAsDataURL(file);
}

// دالة عرض المنتجات
async function displayProducts() {
  const productList = document.getElementById("productList");
  productList.innerHTML = "";

  try {
    const snapshot = await productsRef.get();
    snapshot.forEach(doc => {
      const data = doc.data();
      const productCard = document.createElement("div");
      productCard.className = "product-card";

      productCard.innerHTML = `
        <img src="${data.image}" alt="${data.name}" class="product-img" />
        <h3>${data.name}</h3>
        <p>السعر: ${data.price} ريال</p>
        <button onclick="deleteProductById('${doc.id}')">🗑 حذف</button>
        <button onclick="addToCart('${doc.id}', '${data.name}', ${data.price}, '${data.image}')">🛒 أضف للسلة</button>
      `;

      productList.appendChild(productCard);
    });
  } catch (error) {
    console.error("فشل تحميل المنتجات:", error);
  }
}

// حذف منتج
async function deleteProductById(productId) {
  try {
    await productsRef.doc(productId).delete();
    displayProducts();
  } catch (error) {
    console.error("خطأ أثناء الحذف:", error);
  }
}

// إضافة للسلة
function addToCart(id, name, price, image) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push({ id, name, price, image });
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("تمت إضافة المنتج إلى السلة");
}

// تشغيل عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", () => {
  displayProducts();
  window.deleteProductById = deleteProductById;
  window.addToCart = addToCart;
  window.addProduct = addProduct;
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

