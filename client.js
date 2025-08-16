// وظيفة لجلب المنتجات من الخادم
async function fetchProducts() {
  try {
    const response = await fetch('/api/products');
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

// وظيفة لإضافة منتج جديد
async function addProductToServer(product) {
  try {
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Error adding product:', error);
    return null;
  }
}

// وظيفة لحذف منتج
async function deleteProductFromServer(code) {
  try {
    const response = await fetch(`/api/products/${code}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
}

// ... (بقية الدوال كما هي)

// في تهيئة التطبيق
document.addEventListener('DOMContentLoaded', async function() {
  // جلب المنتجات عند تحميل الصفحة
  products = await fetchProducts();
  renderProducts();
  
  // ربط الأزرار بالوظائف
  document.getElementById('confirmAccessBtn').addEventListener('click', checkAccessCode);
  document.getElementById('addProductBtn').addEventListener('click', addProduct);
  document.getElementById('closeAdminBtn').addEventListener('click', hideAdminPanel);
  
  // ... (بقية الكود)
});

// تعديل دالة addProduct
async function addProduct() {
  const name = document.getElementById('productName').value;
  const code = document.getElementById('productCode').value;
  const category = document.getElementById('productCategory').value;
  const price = document.getElementById('productPrice').value;
  const image = document.getElementById('productImage').value;
  const desc = document.getElementById('productDesc').value;
  
  if (!name || !code || !price || !image) {
    alert('الرجاء إدخال جميع البيانات المطلوبة');
    return;
  }
  
  const newProduct = {
    code,
    category,
    title: name,
    price,
    description: desc,
    image_url: image
  };
  
  const addedProduct = await addProductToServer(newProduct);
  if (addedProduct) {
    products.push(addedProduct);
    document.getElementById('productName').value = '';
    document.getElementById('productCode').value = '';
    document.getElementById('productPrice').value = '';
    document.getElementById('productImage').value = '';
    document.getElementById('productDesc').value = '';
    
    alert('تمت إضافة المنتج بنجاح!');
    renderProducts();
    loadCurrentProducts();
  }
}

// تعديل دالة deleteProduct
async function deleteProduct(productCode) {
  if (confirm(`هل أنت متأكد من رغبتك في حذف المنتج ${productCode}؟`)) {
    const success = await deleteProductFromServer(productCode);
    if (success) {
      products = products.filter(p => p.code !== productCode);
      alert(`تم حذف المنتج ${productCode} بنجاح`);
      renderProducts();
      loadCurrentProducts();
    }
  }
}
