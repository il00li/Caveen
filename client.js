// إعدادات المتجر
const STORE_CONFIG = {
    whatsapp: "967734607101",
    telegram: "crazys7",
    adminCode: "F-S-YA76"
};

// عرض المنتجات
async function loadProducts() {
    const response = await fetch('/api/products');
    const products = await response.json();
    document.getElementById('app').innerHTML = `
        ${products.map(p => `
        <div class="product">
            <h3>${p.name}</h3>
            <p>${p.price} ر.ي</p>
            <a href="https://wa.me/${STORE_CONFIG.whatsapp}?text=طلبية ${p.name}">
                اطلب الآن
            </a>
        </div>
        `).join('')}
    `;
}

// تهيئة الصفحة
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
});
