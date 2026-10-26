// Cart saved in localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM elements
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const cartBtn = document.getElementById('cart-btn');
const closeCartBtn = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartSubtotal = document.getElementById('cart-subtotal');
const cartTax = document.getElementById('cart-tax');
const cartTotal = document.getElementById('cart-total');
const emptyCartMessage = document.getElementById('empty-cart-message');
const checkoutBtn = document.getElementById('checkout-btn');

// Add a product to the cart
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.title,
            price: product.price,
            image: product.thumbnail,
            quantity: 1
        });
    }
    updateCart();
    showCart();
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCart();
}

function updateQuantity(itemId, newQuantity) {
    const item = cart.find(item => item.id === itemId);
    if (item) {
        item.quantity = newQuantity;
        if (item.quantity <= 0) {
            removeFromCart(itemId);
        } else {
            updateCart();
        }
    }
}

// Redraw the cart and save it
function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cart));

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        emptyCartMessage.classList.remove('hidden');
        cartSubtotal.textContent = '$0.00';
        cartTax.textContent = '$0.00';
        cartTotal.textContent = '$0.00';
        return;
    }

    emptyCartMessage.classList.add('hidden');

    let subtotal = 0;

    cart.forEach(item => {
        subtotal += item.price * item.quantity;

        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'flex py-4';
        cartItemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="size-16 rounded bg-gray-200 object-cover">
            <div class="ml-4 flex-1">
                <h3 class="font-medium">${item.name}</h3>
                <div class="mt-1 flex items-center justify-between">
                    <span class="text-gray-600">$${item.price.toFixed(2)}</span>
                    <div class="flex items-center gap-2">
                        <button class="quantity-decrease cursor-pointer text-gray-600 hover:text-brand" data-id="${item.id}" aria-label="Decrease quantity">
                            <svg class="size-4 fill-none stroke-current stroke-2" aria-hidden="true"><use href="#i-minus" /></svg>
                        </button>
                        <span>${item.quantity}</span>
                        <button class="quantity-increase cursor-pointer text-gray-600 hover:text-brand" data-id="${item.id}" aria-label="Increase quantity">
                            <svg class="size-4 fill-none stroke-current stroke-2" aria-hidden="true"><use href="#i-plus" /></svg>
                        </button>
                    </div>
                </div>
            </div>
            <button class="remove-item ml-4 cursor-pointer text-gray-500 hover:text-accent" data-id="${item.id}" aria-label="Remove item">
                <svg class="size-5 fill-none stroke-current stroke-2" aria-hidden="true"><use href="#i-trash" /></svg>
            </button>
        `;
        cartItemsContainer.appendChild(cartItemElement);
    });

    const tax = subtotal * 0.08;
    cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    cartTax.textContent = `$${tax.toFixed(2)}`;
    cartTotal.textContent = `$${(subtotal + tax).toFixed(2)}`;

    // Buttons inside the cart
    document.querySelectorAll('.quantity-decrease').forEach(button => {
        button.addEventListener('click', (e) => {
            const itemId = parseInt(e.target.closest('button').getAttribute('data-id'));
            const item = cart.find(item => item.id === itemId);
            if (item) updateQuantity(itemId, item.quantity - 1);
        });
    });

    document.querySelectorAll('.quantity-increase').forEach(button => {
        button.addEventListener('click', (e) => {
            const itemId = parseInt(e.target.closest('button').getAttribute('data-id'));
            const item = cart.find(item => item.id === itemId);
            if (item) updateQuantity(itemId, item.quantity + 1);
        });
    });

    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const itemId = parseInt(e.target.closest('button').getAttribute('data-id'));
            removeFromCart(itemId);
        });
    });
}

// Show / hide the sidebar
function showCart() {
    cartSidebar.classList.remove('translate-x-full');
    cartOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function hideCart() {
    cartSidebar.classList.add('translate-x-full');
    cartOverlay.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

cartBtn.addEventListener('click', showCart);
closeCartBtn.addEventListener('click', hideCart);
cartOverlay.addEventListener('click', hideCart);
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hideCart();
});

checkoutBtn.addEventListener('click', () => {
    if (cart.length > 0) {
        alert('Checkout comes later.'); // later: go to checkout.html
    }
});

// Draw the saved cart when the page loads
updateCart();