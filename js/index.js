document.addEventListener("DOMContentLoaded", function () {
    var modal = document.getElementById("myModal");
    var btn = document.getElementById("cart");
    var close = document.getElementsByClassName("close")[0];
    var closeFooter = document.getElementsByClassName("close-footer")[0];
    var order = document.getElementsByClassName("order")[0];

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

    var cartQuantity = 0; // Số lượng sản phẩm trong giỏ hàng

    function setAddCartListeners() {
        var addCartButtons = document.getElementsByClassName("btn-cart");
        for (var i = 0; i < addCartButtons.length; i++) {
            var add = addCartButtons[i];
            add.removeEventListener("click", handleAddCartClick);
            add.addEventListener("click", handleAddCartClick);
        }
    }

    function handleAddCartClick(event) {
        var button = event.currentTarget;
        var product = button.closest(".main-product");
        if (product) {
            var img = product.querySelector(".img-prd")?.src || '';
            var title = product.querySelector(".content-product-h3")?.textContent || '';
            var price = product.querySelector(".money")?.textContent || '';

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
        var cartRow = document.createElement('div');
        cartRow.classList.add('cart-row');
        var cartItems = document.getElementsByClassName('cart-items')[0];
        var cartTitles = cartItems ? cartItems.getElementsByClassName('cart-item-title') : [];

        for (var i = 0; i < cartTitles.length; i++) {
            if (cartTitles[i].textContent === title) {
                var quantityInput = cartTitles[i].closest(".cart-row").querySelector(".cart-quantity-input");
                if (quantityInput) {
                    quantityInput.value = parseInt(quantityInput.value) + 1;
                }
                updateCart();
                updateCartQuantityDisplay();
                return;
            }
        }

        var cartRowContents = `
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

        cartQuantity += 1; // Increment cart quantity
        updateCart();
        updateCartQuantityDisplay();
        setRemoveCartListeners();
        setQuantityListeners();
    }

    function setRemoveCartListeners() {
        var removeCart = document.getElementsByClassName("btn-danger");
        for (var i = 0; i < removeCart.length; i++) {
            var button = removeCart[i];
            button.removeEventListener("click", handleRemoveCartClick);
            button.addEventListener("click", handleRemoveCartClick);
        }
    }

    function handleRemoveCartClick(event) {
        var buttonRemove = event.currentTarget;
        var row = buttonRemove.closest(".cart-row");
        var quantity = parseInt(row.querySelector(".cart-quantity-input").value) || 0;
        cartQuantity -= quantity;
        row.remove();
        updateCart();
        updateCartQuantityDisplay();
    }

    function updateCart() {
        var cartItem = document.getElementsByClassName("cart-items")[0];
        var cartRows = cartItem ? cartItem.getElementsByClassName("cart-row") : [];
        var total = 0;
        for (var i = 0; i < cartRows.length; i++) {
            var cartRow = cartRows[i];
            var priceItem = cartRow.getElementsByClassName("cart-price")[0];
            var quantityItem = cartRow.getElementsByClassName("cart-quantity-input")[0];

            if (priceItem && quantityItem) {
                var price = parseFloat(priceItem.textContent.replace('VNĐ', '').trim());
                var quantity = parseInt(quantityItem.value, 10);

                if (!isNaN(price) && !isNaN(quantity)) {
                    total += price * quantity;
                }
            }
        }
        var totalPriceElement = document.getElementsByClassName("cart-total-price")[0];
        if (totalPriceElement) {
            totalPriceElement.textContent = total.toFixed(2) + ' VNĐ';
        }
    }

    function setQuantityListeners() {
        var quantityInputs = document.getElementsByClassName("cart-quantity-input");
        for (var i = 0; i < quantityInputs.length; i++) {
            var input = quantityInputs[i];
            input.removeEventListener("change", handleQuantityChange);
            input.addEventListener("change", handleQuantityChange);
        }
    }

    function handleQuantityChange(event) {
        var input = event.currentTarget;
        if (isNaN(input.value) || input.value <= 0) {
            input.value = 1;
        }
        updateCart();
    }

    function updateCartQuantityDisplay() {
        var cartButton = document.getElementById("cart");
        var cartCountSpan = document.getElementById("cart-count");
        if (cartButton && cartCountSpan) {
            cartCountSpan.textContent = cartQuantity;
        }
    }

    setAddCartListeners();
    setRemoveCartListeners();
    setQuantityListeners();
    loadProductsFromLocalStorage();
});

