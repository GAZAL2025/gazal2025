// إعداد Firebase
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";

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

// دالة لإضافة منتج
export async function addProduct() {
  const name = document.getElementById("productName").value.trim();
  const price = parseFloat(document.getElementById("productPrice").value);
  const imageInput = document.getElementById("productImage");
  const file = imageInput.files[0];

  if (!name || isNaN(price) || !file) {
    alert("يرجى إدخال كل البيانات واختيار صورة.");
    return;
  }

  alert("📤 جاري رفع المنتج...");

  // قراءة الصورة كـ Base64
  const reader = new FileReader();

  reader.onload = async function (e) {
    const imageBase64 = e.target.result;

    try {
      await addDoc(productsRef, {
        name,
        price,
        image: imageBase64
      });

      displayProducts();
      document.getElementById("productName").value = "";
      document.getElementById("productPrice").value = "";
      imageInput.value = "";
      alert("✅ تم إضافة المنتج بنجاح!");
    } catch (error) {
      console.error("فشل إضافة المنتج:", error);
      alert("❌ حدث خطأ أثناء حفظ المنتج. حاول مرة أخرى.");
    }
  };

  reader.onerror = function (err) {
    console.error("فشل في قراءة الصورة:", err);
    alert("❌ حدث خطأ أثناء تحميل الصورة. حاول مرة أخرى.");
  };

  reader.readAsDataURL(file);
}

// دالة لعرض المنتجات
export async function displayProducts() {
  const productList = document.getElementById("productList");
  productList.innerHTML = "";

  try {
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
  } catch (error) {
    console.error("خطأ في جلب المنتجات:", error);
    alert("❌ لم نتمكن من تحميل المنتجات. تأكد من الاتصال بالإنترنت.");
  }
}

// حذف منتج
export async function deleteProduct(productId) {
  try {
    await deleteDoc(doc(db, "products", productId));
    displayProducts();
  } catch (error) {
    console.error("فشل حذف المنتج:", error);
    alert("❌ لم يتم حذف المنتج. حدث خطأ.");
  }
}

// السماح بالوصول من HTML
window.deleteProductById = deleteProduct;

window.addToCart = function (id, name, price, image) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push({ id, name, price, image });
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("✅ تمت إضافة المنتج إلى السلة");
};

window.addEventListener("DOMContentLoaded", () => {
  displayProducts();
});
