document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("myModal");
    const btn = document.getElementById("cart");
    const close = document.getElementsByClassName("close")[0];
    const closeFooter = document.getElementsByClassName("close-footer")[0];
    const order = document.getElementsByClassName("order")[0];
    const searchForm = document.getElementById("search-form");
    const searchInput = document.getElementById("search-input");

    let cartQuantity = 0;

    if (btn && modal) {
        btn.onclick = function () {
            modal.style.display = "block";
        };
    }

    if (close && modal) {
        close.onclick = function () {
            modal.style.display = "none";
        };
    }

    if (closeFooter && modal) {
        closeFooter.onclick = function () {
            modal.style.display = "none";
        };
    }

    if (order) {
        order.onclick = function () {
            alert("Cảm ơn bạn đã thanh toán đơn hàng");
        };
    }

    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }

    function setAddCartListeners() {
        const addCartButtons = document.getElementsByClassName("btn-cart");
        for (let i = 0; i < addCartButtons.length; i++) {
            const add = addCartButtons[i];
            add.removeEventListener("click", handleAddCartClick);
            add.addEventListener("click", handleAddCartClick);
        }
    }

    function handleAddCartClick(event) {
        const button = event.currentTarget;
        const product = button.closest(".main-product");
        if (product) {
            const img = product.querySelector(".img-prd")?.src || '';
            const title = product.querySelector(".content-product-h3")?.textContent || '';
            const price = product.querySelector(".money")?.textContent || '';

            addItemToCart(title, price, img);
            if (modal) {
                modal.style.display = "block";
            }
            updateCart();
        }
    }

    function loadProductsFromLocalStorage() {
        let products = JSON.parse(localStorage.getItem('products')) || [];
        const productContainer = document.querySelector('.products ul');
        productContainer.innerHTML = '';

        products.forEach(product => {
            const productHTML = `
                <li class="main-product">
                    <div class="img-product">
                        <img class="img-prd" src="${product.image}" alt="">
                    </div>
                    <div class="content-product">
                        <h3 class="content-product-h3">${product.name}</h3>
                        <div class="content-product-deltals">
                            <div class="price">
                                <span class="money">${product.price} VNĐ</span>
                            </div>
                            <button type="button" class="btn btn-cart">Thêm Vào Giỏ</button>
                        </div>
                    </div>
                </li>
            `;
            productContainer.innerHTML += productHTML;
        });

        setAddCartListeners();
    }

    function addItemToCart(title, price, img) {
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        
        // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
        let existingItem = cartItems.find(item => item.title === title);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cartItems.push({ title, price, img, quantity: 1 });
        }

        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        updateCart();
    }

    function setRemoveCartListeners() {
        const removeCartButtons = document.getElementsByClassName("btn-danger");
        for (let i = 0; i < removeCartButtons.length; i++) {
            const button = removeCartButtons[i];
            button.removeEventListener("click", handleRemoveCartClick);
            button.addEventListener("click", handleRemoveCartClick);
        }
    }

    function handleRemoveCartClick(event) {
        const buttonRemove = event.currentTarget;
        const row = buttonRemove.closest(".cart-row");
        const title = row.querySelector(".cart-item-title").textContent;

        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        cartItems = cartItems.filter(item => item.title !== title);
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        
        updateCart();
    }

    function updateCart() {
        const cartItemsProduct = document.querySelector('.cart-items-product');
        cartItemsProduct.innerHTML = '';
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        
        cartQuantity = 0;
        let total = 0;

        cartItems.forEach(item => {
            const { title, price, img, quantity } = item;
            const cartRow = document.createElement('div');
            cartRow.classList.add('cart-row');
            const cartRowContents = `
                <div class="cart-item cart-column">
                    <img class="cart-item-image" src="${img}" width="100" height="100">
                    <span class="cart-item-title">${title}</span>
                </div>
                <span class="cart-price cart-column">${price}</span>
                <div class="cart-quantity cart-column">
                    <input class="cart-quantity-input" type="number" value="${quantity}">
                    <button class="btn btn-danger" type="button">Xóa</button>
                </div>
            `;
            cartRow.innerHTML = cartRowContents;
            cartItemsProduct.append(cartRow);

            cartQuantity += quantity;
            total += parseFloat(price.replace(' VNĐ', '')) * quantity;
        });

        document.querySelector('.cart-total-price').textContent = `${total} VNĐ`;
        document.getElementById("cart-count").textContent = cartQuantity;

        setRemoveCartListeners();
        setQuantityListeners();
    }

    function setQuantityListeners() {
        const quantityInputs = document.getElementsByClassName("cart-quantity-input");
        for (let i = 0; i < quantityInputs.length; i++) {
            const input = quantityInputs[i];
            input.removeEventListener("change", handleQuantityChange);
            input.addEventListener("change", handleQuantityChange);
        }
    }

    function handleQuantityChange(event) {
        const input = event.currentTarget;
        const row = input.closest(".cart-row");
        const title = row.querySelector(".cart-item-title").textContent;
        const newQuantity = parseInt(input.value);

        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        let item = cartItems.find(item => item.title === title);
        if (item) {
            item.quantity = newQuantity;
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            updateCart();
        }
    }

    loadProductsFromLocalStorage();
    updateCart();
});
