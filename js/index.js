document.addEventListener("DOMContentLoaded", function () {
    let modal = document.getElementById("myModal");
    let btn = document.getElementById("cart");
    let close = document.getElementsByClassName("close")[0];
    let closeFooter = document.getElementsByClassName("close-footer")[0];
    let order = document.getElementsByClassName("order")[0];
    let searchForm = document.getElementById("search-form");
    let searchInput = document.getElementById("search-input");

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

    let cartQuantity = 0;

    function setAddCartListeners() {
        let addCartButtons = document.getElementsByClassName("btn-cart");
        for (let i = 0; i < addCartButtons.length; i++) {
            let add = addCartButtons[i];
            add.removeEventListener("click", handleAddCartClick);
            add.addEventListener("click", handleAddCartClick);
        }
    }

    function handleAddCartClick(event) {
        let button = event.currentTarget;
        let product = button.closest(".main-product");
        if (product) {
            let img = product.querySelector(".img-prd")?.src || '';
            let title = product.querySelector(".content-product-h3")?.textContent || '';
            let price = product.querySelector(".money")?.textContent || '';

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
        let cartRow = document.createElement('div');
        cartRow.classList.add('cart-row');
        let cartItems = document.querySelector('.cart-items-product');
        let cartTitles = cartItems.getElementsByClassName('cart-item-title');

        // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
        for (let i = 0; i < cartTitles.length; i++) {
            if (cartTitles[i].textContent === title) {
                alert("Sản phẩm đã có trong giỏ hàng!");
                return;
            }
        }

        let cartRowContents = `
            <div class="cart-item cart-column">
                <img class="cart-item-image" src="${img}" width="100" height="100">
                <span class="cart-item-title">${title}</span>
            </div>
            <span class="cart-price cart-column">${price}</span>
            <div class="cart-quantity cart-column">
                <input class="cart-quantity-input" type="number" value="1">
                <button class="btn btn-danger" type="button">Xóa</button>
            </div>
        `;
        cartRow.innerHTML = cartRowContents;
        cartItems.append(cartRow);

        cartQuantity += 1;
        updateCart();
        updateCartQuantityDisplay();
        setRemoveCartListeners();
        setQuantityListeners();
    }

    function setRemoveCartListeners() {
        let removeCart = document.getElementsByClassName("btn-danger");
        for (let i = 0; i < removeCart.length; i++) {
            let button = removeCart[i];
            button.removeEventListener("click", handleRemoveCartClick);
            button.addEventListener("click", handleRemoveCartClick);
        }
    }

    function handleRemoveCartClick(event) {
        let buttonRemove = event.currentTarget;
        let row = buttonRemove.closest(".cart-row");
        let quantity = parseInt(row.querySelector(".cart-quantity-input").value) || 0;
        cartQuantity -= quantity;
        row.remove();
        updateCart();
        updateCartQuantityDisplay();
    }

    function updateCart() {
        let cartItem = document.querySelector('.cart-items-product');
        let cartRows = cartItem ? cartItem.getElementsByClassName("cart-row") : [];
        let total = 0;
        cartQuantity = 0; // Reset cartQuantity

        for (let i = 0; i < cartRows.length; i++) {
            let cartRow = cartRows[i];
            let priceItem = cartRow.getElementsByClassName("cart-price")[0];
            let quantityItem = cartRow.getElementsByClassName("cart-quantity-input")[0];

            if (priceItem && quantityItem) {
                let price = parseFloat(priceItem.textContent.replace('VNĐ', '').trim());
                let quantity = parseInt(quantityItem.value, 10);

                if (!isNaN(price) && !isNaN(quantity)) {
                    total += price * quantity;
                    cartQuantity += quantity; // Update cartQuantity
                }
            }
        }
        let totalPriceElement = document.getElementsByClassName("cart-total-price")[0];
        if (totalPriceElement) {
            totalPriceElement.textContent = total.toFixed(2) + ' VNĐ';
        }
        updateCartQuantityDisplay(); // Ensure cart quantity display is updated
    }

    function setQuantityListeners() {
        let quantityInputs = document.getElementsByClassName("cart-quantity-input");
        for (let i = 0; i < quantityInputs.length; i++) {
            let input = quantityInputs[i];
            input.removeEventListener("change", handleQuantityChange);
            input.addEventListener("change", handleQuantityChange);
        }
    }

    function handleQuantityChange(event) {
        let input = event.currentTarget;
        if (isNaN(input.value) || input.value <= 0) {
            input.value = 1;
        }
        updateCart();
    }

    function updateCartQuantityDisplay() {
        let cartButton = document.getElementById("cart");
        let cartCountSpan = document.getElementById("cart-count");
        if (cartButton && cartCountSpan) {
            cartCountSpan.textContent = cartQuantity;
        }
    }

    function searchProducts() {
        let query = searchInput.value.toLowerCase();
        let products = document.querySelectorAll('.products .main-product');
        products.forEach(function (product) {
            let title = product.querySelector('.content-product-h3').textContent.toLowerCase();
            if (title.includes(query)) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });
    }

    if (searchForm) {
        searchForm.addEventListener('input', function () {
            searchProducts();
        });
    }

    setAddCartListeners();
    setRemoveCartListeners();
    setQuantityListeners();
    loadProductsFromLocalStorage();
});
