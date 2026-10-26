// // Load products and show them on the page
// const productGrid = document.getElementById('product-grid');

// // The products on screen. Update this every time you show a new list.
// let products = [];

// async function loadProducts() {
//     try {
//         const res = await fetch('https://dummyjson.com/products?limit=8');
//         if (!res.ok) throw new Error('Request failed');
//         const data = await res.json();
//         products = data.products;
//         displayProducts(products);
//     } catch (error) {
//         productGrid.innerHTML = '<p class="col-span-full text-gray-600">Could not load products. Please try again.</p>';
//     }
// }

// function displayProducts(list) {
//     productGrid.innerHTML = '';

//     list.forEach(item => {
//         const card = document.createElement('article');
//         card.className = 'overflow-hidden rounded-xl bg-white hover:shadow-lg';

//         // Show a badge only when the discount is 10% or more
//         const badge = item.discountPercentage >= 10
//             ? `<span class="absolute left-3 top-3 rounded-md bg-accent px-2 py-1 text-xs font-semibold text-white">-${Math.round(item.discountPercentage)}%</span>`
//             : '';

//         card.innerHTML = `
//             <div class="relative aspect-square bg-gray-200">
//                 <img src="${item.thumbnail}" alt="${item.title}" class="size-full object-cover">
//                 ${badge}
//             </div>
//             <div class="p-4">
//                 <h3 class="line-clamp-1 font-semibold">${item.title}</h3>
//                 <p class="mt-1 flex items-center gap-1 text-sm text-gray-600">
//                     <svg class="size-4 fill-current text-accent" aria-hidden="true"><use href="#i-star" /></svg>${item.rating.toFixed(1)}
//                 </p>
//                 <p class="mt-2 font-bold">$${item.price.toFixed(2)}</p>
//                 <button type="button" class="add-to-cart mt-3 w-full cursor-pointer rounded-lg bg-brand py-2 font-semibold text-white hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand" data-id="${item.id}">Add to cart</button>
//             </div>
//         `;
//         productGrid.appendChild(card);
//     });

//     // Add to cart buttons
//     document.querySelectorAll('.add-to-cart').forEach(button => {
//         button.addEventListener('click', () => {
//             const itemId = parseInt(button.getAttribute('data-id'));
//             const product = products.find(item => item.id === itemId);
//             if (product) addToCart(product);
//         });
//     });
// }

// loadProducts();

// Homepage: load featured products
const productGrid = document.getElementById('product-grid');

async function loadProducts() {
    try {
        const res = await fetch('https://dummyjson.com/products?limit=8');
        if (!res.ok) throw new Error('Request failed');
        const data = await res.json();
        displayProducts(data.products, productGrid);
    } catch (error) {
        productGrid.innerHTML = '<p class="col-span-full text-gray-600">Could not load products. Please try again.</p>';
    }
}

loadProducts();