// Cart functionality
document.addEventListener('DOMContentLoaded', function() {
    // Add to cart functionality for shop page
    const addToCartButtons = document.querySelectorAll('.add-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation(); // Prevent product click event
            
            const productId = this.getAttribute('data-id');
            const productName = this.getAttribute('data-name');
            const productPrice = parseFloat(this.getAttribute('data-price'));
            const productImage = this.getAttribute('data-image');
            const productBrand = this.getAttribute('data-brand');
            
            addToCart(productId, productName, productPrice, productImage, productBrand, 1);
            alert('Product added to cart!');
        });
    });
    
    // Load cart items on cart page
    if (window.location.pathname.includes('cart.html')) {
        displayCartItems();
    }
});

// Function to add product to cart
function addToCart(id, name, price, image, brand, quantity) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if product already exists in cart
    const existingProductIndex = cart.findIndex(item => item.id === id);
    
    if (existingProductIndex !== -1) {
        // Update quantity if product already exists
        cart[existingProductIndex].quantity += quantity;
    } else {
        // Add new product to cart
        cart.push({
            id: id,
            name: name,
            price: price,
            image: image,
            brand: brand,
            quantity: quantity
        });
    }
    
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Function to display cart items
function displayCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Clear cart items container
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        // Display empty cart message
        cartItemsContainer.innerHTML = `
            <tr>
                <td colspan="6">
                    <div class="empty-cart">
                        <p>Your cart is empty</p>
                        <a href="shop.html" class="normal">Continue Shopping</a>
                    </div>
                </td>
            </tr>
        `;
        
        // Update totals
        document.getElementById('cart-subtotal').textContent = '₹0';
        document.getElementById('cart-total').textContent = '₹0';
        
        return;
    }
    
    let totalAmount = 0;
    
    // Add cart items to the table
    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        totalAmount += subtotal;
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><a href="#" class="remove-item" data-id="${item.id}"><i class="far fa-times-circle"></i></a></td>
            <td><img src="${item.image}" alt="${item.name}"></td>
            <td>${item.name}</td>
            <td>₹${item.price}</td>
            <td>
                <div class="quantity-controls">
                    <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                    <input type="number" value="${item.quantity}" min="1" class="quantity-input" data-id="${item.id}">
                    <button class="quantity-btn increase" data-id="${item.id}">+</button>
                </div>
            </td>
            <td>₹${subtotal}</td>
        `;
        
        cartItemsContainer.appendChild(tr);
    });
    
    // Update totals
    document.getElementById('cart-subtotal').textContent = `₹${totalAmount}`;
    document.getElementById('cart-total').textContent = `₹${totalAmount}`;
    
    // Add event listeners for quantity controls and remove buttons
    addCartEventListeners();
}

// Function to add event listeners for cart controls
function addCartEventListeners() {
    // Remove item buttons
    const removeButtons = document.querySelectorAll('.remove-item');
    removeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = this.getAttribute('data-id');
            removeFromCart(productId);
            displayCartItems();
        });
    });
    
    // Quantity decrease buttons
    const decreaseButtons = document.querySelectorAll('.quantity-btn.decrease');
    decreaseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            updateCartItemQuantity(productId, 'decrease');
            displayCartItems();
        });
    });
    
    // Quantity increase buttons
    const increaseButtons = document.querySelectorAll('.quantity-btn.increase');
    increaseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            updateCartItemQuantity(productId, 'increase');
            displayCartItems();
        });
    });
    
    // Quantity input fields
    const quantityInputs = document.querySelectorAll('.quantity-input');
    quantityInputs.forEach(input => {
        input.addEventListener('change', function() {
            const productId = this.getAttribute('data-id');
            const newQuantity = parseInt(this.value);
            if (newQuantity > 0) {
                updateCartItemQuantity(productId, 'set', newQuantity);
                displayCartItems();
            }
        });
    });
}

// Function to remove item from cart
function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Function to update cart item quantity
function updateCartItemQuantity(productId, action, value = 1) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const productIndex = cart.findIndex(item => item.id === productId);
    
    if (productIndex !== -1) {
        if (action === 'increase') {
            cart[productIndex].quantity += 1;
        } else if (action === 'decrease') {
            if (cart[productIndex].quantity > 1) {
                cart[productIndex].quantity -= 1;
            }
        } else if (action === 'set') {
            cart[productIndex].quantity = value;
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
    }
}



// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart from localStorage or create empty cart
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Update cart count in the UI
    updateCartCount();
    
    // Add event listeners to all "Add to Cart" buttons
    const addToCartButtons = document.querySelectorAll('.add-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Check if product is out of stock
            if (this.getAttribute('data-stock') === 'out') {
                alert('Sorry, this product is currently out of stock. It will be available in 2 days. You can save it to your watchlist.');
                return;
            }
            
            // Get product details from data attributes
            const product = {
                id: this.getAttribute('data-id'),
                name: this.getAttribute('data-name'),
                price: parseFloat(this.getAttribute('data-price')),
                image: this.getAttribute('data-image'),
                brand: this.getAttribute('data-brand'),
                quantity: 1
            };
            
            // Check if product already exists in cart
            const existingProductIndex = cart.findIndex(item => item.id === product.id);
            
            if (existingProductIndex > -1) {
                // Increase quantity if product already in cart
                cart[existingProductIndex].quantity++;
            } else {
                // Add new product to cart
                cart.push(product);
            }
            
            // Save updated cart to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Update cart count in the UI
            updateCartCount();
            
            // Show confirmation message
            alert(`${product.name} has been added to your cart!`);
        });
    });
    
    // Add event listeners to all "Save to Watchlist" buttons
    const watchlistButtons = document.querySelectorAll('.watchlist-btn');
    watchlistButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Get product details from parent element
            const productElement = this.closest('.pro');
            const addToCartButton = productElement.querySelector('.add-cart');
            
            const product = {
                id: addToCartButton.getAttribute('data-id'),
                name: addToCartButton.getAttribute('data-name'),
                price: parseFloat(addToCartButton.getAttribute('data-price')),
                image: addToCartButton.getAttribute('data-image'),
                brand: addToCartButton.getAttribute('data-brand')
            };
            
            // Get watchlist from localStorage or create empty watchlist
            let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
            
            // Check if product already exists in watchlist
            const existingProductIndex = watchlist.findIndex(item => item.id === product.id);
            
            if (existingProductIndex > -1) {
                alert(`${product.name} is already in your watchlist!`);
            } else {
                // Add new product to watchlist
                watchlist.push(product);
                
                // Save updated watchlist to localStorage
                localStorage.setItem('watchlist', JSON.stringify(watchlist));
                
                // Show confirmation message
                alert(`${product.name} has been added to your watchlist!`);
            }
        });
    });
    
    // Function to update cart count in the UI
    function updateCartCount() {
        const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
        // You can update a cart count badge here if you have one
        // For example: document.querySelector('.cart-count').textContent = cartCount;
    }
});