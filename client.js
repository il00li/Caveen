// عرض المنتجات
async function loadProducts() {
    try {
        const response = await fetch('/api/products');
        const products = await response.json();
        const container = document.getElementById('productsContainer');
        
        container.innerHTML = products.map(product => `
            <div class="product-card" data-category="${product.category}" data-code="${product.code}">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <span class="product-code">${product.code}</span>
                <div class="product-info">
                    <span class="product-category">${getCategoryName(product.category)}</span>
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-price">${product.price} ر.ي</p>
                    <p class="product-desc">${product.description}</p>
                    <a href="https://wa.me/967734607101?text=مرحباً، أريد طلب المنتج: ${product.name} (كود: ${product.code}) بسعر ${product.price} ر.ي" class="order-btn">
                        <iconify-icon icon="mdi:whatsapp"></iconify-icon>
                        طلب المنتج
                    </a>
                </div>
            </div>
        `).join('');
        
        // إعادة تعيين مستمعات الأحداث
        initEventListeners();
    } catch (err) {
        console.error('خطأ في تحميل المنتجات:', err);
    }
}

function getCategoryName(category) {
    const categories = {
        'men': 'رجالي',
        'women': 'نسائي',
        'kids': 'أطفال'
    };
    return categories[category] || category;
}

// إضافة منتج جديد
async function addProduct(productData) {
    try {
        const response = await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData)
        });
        
        if (response.ok) {
            loadProducts(); // إعادة تحميل المنتجات
            return true;
        }
        return false;
    } catch (err) {
        console.error('خطأ في إضافة المنتج:', err);
        return false;
    }
}

// حذف منتج
async function deleteProduct(productId) {
    try {
        const response = await fetch(`/api/products/${productId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            loadProducts(); // إعادة تحميل المنتجات
            return true;
        }
        return false;
    } catch (err) {
        console.error('خطأ في حذف المنتج:', err);
        return false;
    }
}

// تهيئة مستمعات الأحداث
function initEventListeners() {
    // ... (نفس الكود السابق لإدارة الواجهة)
}

// تحميل المنتجات عند بدء التشغيل
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
});
