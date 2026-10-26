// Show a heart as filled (saved) or empty
function setHeartState(button, active) {
    const icon = button.querySelector('svg');
    icon.classList.toggle('fill-current', active);
    icon.classList.toggle('fill-none', !active);
    button.classList.toggle('text-accent', active);
    button.classList.toggle('text-gray-600', !active);
    button.setAttribute('aria-pressed', active);
    button.setAttribute('aria-label', active ? 'Remove from favorites' : 'Add to favorites');
}

// Draw product cards into a container (used by main.js, shop.js and favorites-page.js)
// onFavoriteChange is optional: it runs after a heart is clicked
function displayProducts(list, container, onFavoriteChange) {
    container.innerHTML = '';

    list.forEach(item => {
        const card = document.createElement('article');
        card.className = 'overflow-hidden rounded-xl bg-white hover:shadow-lg';

        // Show a badge only when the discount is 10% or more
        const badge = item.discountPercentage >= 10
            ? `<span class="absolute left-3 top-3 rounded-md bg-accent px-2 py-1 text-xs font-semibold text-white">-${Math.round(item.discountPercentage)}%</span>`
            : '';

        card.innerHTML = `
            <div class="relative aspect-square bg-gray-200">
                <img src="${item.thumbnail}" alt="${item.title}" class="size-full object-cover">
                ${badge}
                <button type="button" class="favorite-btn absolute right-3 top-3 flex size-9 cursor-pointer items-center justify-center rounded-full bg-white text-gray-600 shadow-md hover:text-accent focus-visible:ring-2 focus-visible:ring-brand" aria-label="Add to favorites" aria-pressed="false">
                    <svg class="size-5 fill-none stroke-current stroke-2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#i-heart" /></svg>
                </button>
            </div>
            <div class="p-4">
                <h3 class="line-clamp-1 font-semibold">${item.title}</h3>
                <p class="mt-1 flex items-center gap-1 text-sm text-gray-600">
                    <svg class="size-4 fill-current text-accent" aria-hidden="true"><use href="#i-star" /></svg>${item.rating.toFixed(1)}
                </p>
                <p class="mt-2 font-bold">$${item.price.toFixed(2)}</p>
                <button type="button" class="add-to-cart mt-3 w-full cursor-pointer rounded-lg bg-brand py-2 font-semibold text-white hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand" data-id="${item.id}">Add to cart</button>
            </div>
        `;
        container.appendChild(card);

        // Heart button
        const heart = card.querySelector('.favorite-btn');
        setHeartState(heart, isFavorite(item.id));
        heart.addEventListener('click', () => {
            toggleFavorite(item);
            setHeartState(heart, isFavorite(item.id));
            if (onFavoriteChange) onFavoriteChange();
        });
    });

    // Add to cart buttons
    container.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const itemId = parseInt(button.getAttribute('data-id'));
            const product = list.find(item => item.id === itemId);
            if (product) addToCart(product);
        });
    });
}