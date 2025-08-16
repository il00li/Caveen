// بيانات المنتجات الأولية
let products = [
    {
        code: "CFN-1001",
        category: "women",
        title: "فستان صيفي أنيق",
        price: "14900",
        desc: "فستان صيفي أنيق بتصميم عصري يناسب جميع المناسبات",
        image: "https://images.unsplash.com/photo-1551232864-3f0890e580d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
    },
    {
        code: "CFN-1002",
        category: "men",
        title: "قميص كاجوال",
        price: "12900",
        desc: "قميص رجالي بمواصفات عالية الجودة وخامة قطنية",
        image: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
    }
];

// كود جافاسكريبت للتحكم في ظهور/اختفاء الهيدر عند التمرير
let lastScroll = 0;
const header = document.getElementById('mainHeader');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        header.classList.remove('hidden');
        return;
    }
    
    if (currentScroll > lastScroll && !header.classList.contains('hidden')) {
        header.classList.add('hidden');
    } else if (currentScroll < lastScroll && header.classList.contains('hidden')) {
        header.classList.remove('hidden');
    }
    
    lastScroll = currentScroll;
});

// فلترة المنتجات حسب التصنيف
const categoryBtns = document.querySelectorAll('.category-btn');
let productCards;

function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        const categoryName = {
            'men': 'رجالي',
            'women': 'نسائي',
            'kids': 'أطفال'
        }[product.category];
        
        const productHTML = `
        <div class="product-card" data-category="${product.category}" data-code="${product.code}">
            <img src="${product.image}" alt="${product.title}" class="product-image">
            <span class="product-code">${product.code}</span>
            <div class="product-info">
                <span class="product-category">${categoryName}</span>
                <h3 class="product-title">${product.title}</h3>
                <p class="product-price">${product.price} ر.ي</p>
                <p class="product-desc">${product.desc}</p>
                <a href="https://wa.me/967734607101?text=مرحباً، أريد طلب المنتج: ${product.title} (كود: ${product.code}) بسعر ${product.price} ر.ي" class="order-btn">
                    <iconify-icon icon="mdi:whatsapp"></iconify-icon>
                    طلب المنتج
                </a>
            </div>
        </div>
        `;
        
        productsGrid.innerHTML += productHTML;
    });
    
    // تحديث متغير productCards
    productCards = document.querySelectorAll('.product-card');
}

function filterProducts(category) {
    productCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // إزالة النشط من جميع الأزرار
        categoryBtns.forEach(b => b.classList.remove('active'));
        // إضافة النشط للزر المحدد
        btn.classList.add('active');
        
        const category = btn.dataset.category;
        filterProducts(category);
    });
});

// البحث عن المنتجات
const searchBtn = document.getElementById('searchBtn');
const searchModal = document.getElementById('searchModal');
const closeSearch = document.getElementById('closeSearch');
const productSearch = document.getElementById('productSearch');

searchBtn.addEventListener('click', () => {
    searchModal.style.display = 'flex';
    productSearch.focus();
});

closeSearch.addEventListener('click', () => {
    searchModal.style.display = 'none';
    productSearch.value = '';
});

productSearch.addEventListener('input', () => {
    const searchTerm = productSearch.value.trim().toUpperCase();
    
    if (searchTerm.length === 0) {
        productCards.forEach(card => {
            card.style.display = 'block';
        });
        return;
    }
    
    productCards.forEach(card => {
        const productCode = card.dataset.code.toUpperCase();
        if (productCode.includes(searchTerm)) {
            card.style.display = 'block';
            
            // التمرير إلى المنتج المطلوب
            if (productCode === searchTerm) {
                card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        } else {
            card.style.display = 'none';
        }
    });
});

// نظام النقر الثلاثي للإدارة
let clickCount = 0;
let clickTimer = 0;

document.querySelector('.logo').addEventListener('click', function() {
    clearTimeout(clickTimer);
    clickCount++;
    
    if (clickCount === 3) {
        showAccessPanel();
        clickCount = 0;
    }
    
    clickTimer = setTimeout(() => {
        clickCount = 0;
    }, 1000);
});

// أيقونة الإعدادات في الفوتر
document.getElementById('adminIcon').addEventListener('click', function() {
    showAccessPanel();
});

// إظهار واجهة التحقق من الرمز
function showAccessPanel() {
    document.getElementById('accessPanel').style.display = 'flex';
    document.getElementById('accessCode').focus();
}

// إخفاء واجهة التحقق من الرمز
function hideAccessPanel() {
    document.getElementById('accessPanel').style.display = 'none';
    document.getElementById('accessCode').value = '';
    document.getElementById('accessError').style.display = 'none';
}

// التحقق من صحة الرمز
function checkAccessCode() {
    const accessCode = document.getElementById('accessCode').value;
    const accessError = document.getElementById('accessError');
    
    if (accessCode === "F-S-YA76") {
        hideAccessPanel();
        showAdminPanel();
    } else {
        accessError.style.display = 'block';
        // اهتزاز للحقل
        document.getElementById('accessCode').style.animation = 'shake 0.5s';
        setTimeout(() => {
            document.getElementById('accessCode').style.animation = '';
        }, 500);
    }
}

// إظهار واجهة الإدارة
function showAdminPanel() {
    document.getElementById('adminPanel').style.display = 'block';
    loadCurrentProducts();
}

// إخفاء واجهة الإدارة
function hideAdminPanel() {
    document.getElementById('adminPanel').style.display = 'none';
}

// تحميل المنتجات الحالية في واجهة الإدارة
function loadCurrentProducts() {
    const productsList = document.getElementById('currentProductsList');
    productsList.innerHTML = '';
    
    products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.className = 'admin-product-item';
        productItem.innerHTML = `
            <div class="admin-product-info">
                <div class="admin-product-title">${product.title}</div>
                <div class="admin-product-code">${product.code}</div>
            </div>
            <button class="delete-btn" data-code="${product.code}">حذف</button>
        `;
        
        productsList.appendChild(productItem);
    });
    
    // إضافة مستمعين لأزرار الحذف
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productCode = this.dataset.code;
            deleteProduct(productCode);
        });
    });
}

// حذف منتج
function deleteProduct(productCode) {
    if (confirm(`هل أنت متأكد من رغبتك في حذف المنتج ${productCode}؟`)) {
        products = products.filter(p => p.code !== productCode);
        alert(`تم حذف المنتج ${productCode} بنجاح`);
        renderProducts(); // إعادة عرض المنتجات
        loadCurrentProducts(); // تحديث قائمة المنتجات في الإدارة
    }
}

// إضافة منتج جديد
function addProduct() {
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
    
    // التحقق من عدم وجود كود مكرر
    if (products.some(p => p.code === code)) {
        alert('كود المنتج موجود مسبقاً! الرجاء استخدام كود مختلف');
        return;
    }
    
    const newProduct = {
        code,
        category,
        title: name,
        price,
        desc,
        image
    };
    
    products.push(newProduct);
    
    // إعادة تعيين الحقول
    document.getElementById('productName').value = '';
    document.getElementById('productCode').value = '';
    document.getElementById('productPrice').value = '';
    document.getElementById('productImage').value = '';
    document.getElementById('productDesc').value = '';
    
    alert('تمت إضافة المنتج بنجاح!');
    renderProducts(); // إعادة عرض المنتجات
    loadCurrentProducts(); // تحديث قائمة المنتجات في الإدارة
}

// تهيئة الأحداث
document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
    
    // ربط الأزرار بالوظائف
    document.getElementById('confirmAccessBtn').addEventListener('click', checkAccessCode);
    document.getElementById('addProductBtn').addEventListener('click', addProduct);
    document.getElementById('closeAdminBtn').addEventListener('click', hideAdminPanel);
    
    // إضافة أنيميشن الاهتزاز
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20%, 60% { transform: translateX(-5px); }
            40%, 80% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(style);
});
