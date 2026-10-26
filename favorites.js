// Favorites saved in localStorage (same idea as the cart)
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
const favoritesCount = document.getElementById('favorites-count');

function isFavorite(id) {
    return favorites.some(item => item.id === id);
}

// Add the product if it isn't saved, remove it if it is
function toggleFavorite(product) {
    if (isFavorite(product.id)) {
        favorites = favorites.filter(item => item.id !== product.id);
    } else {
        favorites.push({
            id: product.id,
            title: product.title,
            price: product.price,
            thumbnail: product.thumbnail,
            rating: product.rating,
            discountPercentage: product.discountPercentage
        });
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoritesCount();
}

function updateFavoritesCount() {
    favoritesCount.textContent = favorites.length;
}

updateFavoritesCount();