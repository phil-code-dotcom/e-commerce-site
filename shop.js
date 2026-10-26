// shop page: search, category filter, sort and pagination

const productGrid = document.getElementById('product-grid');
const categorySelect = document.getElementById('category-select');
const sortSelect = document.getElementById('sort-select');
const pageTitle = document.getElementById('page-title');
const resultCount = document.getElementById('result-count');
const clearSearch = document.getElementById('clear-search');
const pagination = document.getElementById('pagination');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const pageInfo = document.getElementById('page-info');

// Read ?q=... and ?category=... from the page address
const urlParams = new URLSearchParams(window.location.search);
const searchQuery = urlParams.get('q') || '';
let selectedCategory = urlParams.get('category') || '';

let sortValue = '';
let currentPage = 1;
const pageSize = 12;
let totalProducts = 0;

// If the person searched, show it and put it back in the search boxes
if (searchQuery) {
    pageTitle.textContent = `Results for "${searchQuery}"`;
    clearSearch.classList.remove('hidden');
    categorySelect.disabled = true; // the API can't search and filter by category together
    document.getElementById('nav-search').value = searchQuery;
    document.getElementById('nav-search-mobile').value = searchQuery;
}

// Build the API address from the current choices
function buildUrl() {
    const params = new URLSearchParams();
    params.set('limit', pageSize);
    params.set('skip', (currentPage - 1) * pageSize);

    if (sortValue) {
        const [sortBy, order] = sortValue.split('-'); // "price-asc" -> "price", "asc"
        params.set('sortBy', sortBy);
        params.set('order', order);
    }

    let path = '/products';
    if (searchQuery) {
        path = '/products/search';
        params.set('q', searchQuery);
    } else if (selectedCategory) {
        path = `/products/category/${selectedCategory}`;
    }

    return `https://dummyjson.com${path}?${params}`;
}

async function loadProducts() {
    productGrid.innerHTML = '<p class="col-span-full text-gray-600">Loading products...</p>';

    try {
        const res = await fetch(buildUrl());
        if (!res.ok) throw new Error('Request failed');
        const data = await res.json();

        totalProducts = data.total;
        resultCount.textContent = `${totalProducts} products`;

        if (data.products.length === 0) {
            productGrid.innerHTML = '<p class="col-span-full text-gray-600">No products found.</p>';
        } else {
            displayProducts(data.products, productGrid);
        }
        updatePagination();
    } catch (error) {
        productGrid.innerHTML = '<p class="col-span-full text-gray-600">Could not load products. Please try again.</p>';
    }
}

function updatePagination() {
    const totalPages = Math.ceil(totalProducts / pageSize);
    pagination.classList.toggle('hidden', totalPages <= 1);
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage >= totalPages;
}

// Fill the category dropdown from the API
async function loadCategories() {
    try {
        const res = await fetch('https://dummyjson.com/products/categories');
        const categories = await res.json();

        categories.forEach(category => {
            // The API may send plain text or objects with a slug and a name
            const slug = typeof category === 'string' ? category : category.slug;
            const name = typeof category === 'string' ? category : category.name;

            const option = document.createElement('option');
            option.value = slug;
            option.textContent = name;
            categorySelect.appendChild(option);
        });
        categorySelect.value = selectedCategory;
    } catch (error) {
        // The dropdown just stays on "All categories"
    }
}

// Events
categorySelect.addEventListener('change', () => {
    selectedCategory = categorySelect.value;
    currentPage = 1;
    loadProducts();
});

sortSelect.addEventListener('change', () => {
    sortValue = sortSelect.value;
    currentPage = 1;
    loadProducts();
});

prevBtn.addEventListener('click', () => {
    currentPage -= 1;
    loadProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

nextBtn.addEventListener('click', () => {
    currentPage += 1;
    loadProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

loadCategories();
loadProducts();