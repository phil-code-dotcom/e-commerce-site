// Favorites page: show the saved products
const productGrid = document.getElementById('product-grid');
const favoritesEmpty = document.getElementById('favorites-empty');
const favoritesSummary = document.getElementById('favorites-summary');

function showFavorites() {
    favoritesSummary.textContent = `${favorites.length} saved`;
    favoritesEmpty.classList.toggle('hidden', favorites.length > 0);
    // After a heart is clicked, draw the page again so removed items disappear
    displayProducts(favorites, productGrid, showFavorites);
}

showFavorites();