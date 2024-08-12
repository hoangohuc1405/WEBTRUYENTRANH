document.addEventListener("DOMContentLoaded", function () {
    // Modal
    var modal = document.getElementById("myModal");
    var btn = document.getElementById("cart");
    var close = document.getElementsByClassName("close")[0];
    var closeFooter = document.getElementsByClassName("close-footer")[0];
    var order = document.getElementsByClassName("order")[0];

    // Check if elements exist before setting event listeners
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

    // Menu Mobile
    var btnMenu = document.getElementById("btnmenu");
    if (btnMenu) {
        btnMenu.addEventListener("click", function () {
            var itemMenu = document.getElementById("menutop");
            if (itemMenu) {
                itemMenu.style.display = (itemMenu.style.display === "block") ? "none" : "block";
            }
        });
    }

    // Remove Cart Item
    function setRemoveCartListeners() {
        var removeCart = document.getElementsByClassName("btn-danger");
        for (var i = 0; i < removeCart.length; i++) {
            var button = removeCart[i];
            button.removeEventListener("click", handleRemoveCartClick); // Remove existing listener if any
            button.addEventListener("click", handleRemoveCartClick);
        }
    }

    function handleRemoveCartClick(event) {
        var buttonRemove = event.currentTarget;
        buttonRemove.closest(".cart-row").remove();
        updateCart();
    }

    // Update Cart
    function updateCart() {
        var cartItem = document.getElementsByClassName("cart-items")[0];
        var cartRows = cartItem ? cartItem.getElementsByClassName("cart-row") : [];
        var total = 0;
        for (var i = 0; i < cartRows.length; i++) {
            var cartRow = cartRows[i];
            var priceItem = cartRow.getElementsByClassName("cart-price")[0];
            var quantityItem = cartRow.getElementsByClassName("cart-quantity-input")[0];

            if (priceItem && quantityItem) {
                var price = parseFloat(priceItem.innerText.replace('VNĐ', '').trim()); // Remove 'VNĐ' and trim
                var quantity = parseInt(quantityItem.value, 10);

                if (!isNaN(price) && !isNaN(quantity)) {
                    total += price * quantity;
                }
            }
        }
        var totalPriceElement = document.getElementsByClassName("cart-total-price")[0];
        if (totalPriceElement) {
            totalPriceElement.innerText = total.toFixed(2) + ' VNĐ';
        }
    }

    // Change Quantity
    function setQuantityListeners() {
        var quantityInputs = document.getElementsByClassName("cart-quantity-input");
        for (var i = 0; i < quantityInputs.length; i++) {
            var input = quantityInputs[i];
            input.removeEventListener("change", handleQuantityChange); // Remove existing listener if any
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

    // Add to Cart
    function setAddCartListeners() {
        var addCartButtons = document.getElementsByClassName("btn-cart");
        for (var i = 0; i < addCartButtons.length; i++) {
            var add = addCartButtons[i];
            add.removeEventListener("click", handleAddCartClick); // Remove existing listener if any
            add.addEventListener("click", handleAddCartClick);
        }
    }

    function handleAddCartClick(event) {
        var button = event.currentTarget;
        var product = button.closest(".product");
        if (product) {
            var img = product.getElementsByClassName("img-prd")[0]?.src || '';
            var title = product.getElementsByClassName("content-product-h3")[0]?.innerText || '';
            var price = product.getElementsByClassName("price")[0]?.innerText || '';

            addItemToCart(title, price, img);
            if (modal) {
                modal.style.display = "block";
            }
            updateCart();
        }
    }

    // Add Item to Cart
    function addItemToCart(title, price, img) {
        var cartRow = document.createElement('div');
        cartRow.classList.add('cart-row');
        var cartItems = document.getElementsByClassName('cart-items')[0];
        var cartTitles = cartItems ? cartItems.getElementsByClassName('cart-item-title') : [];

        for (var i = 0; i < cartTitles.length; i++) {
            if (cartTitles[i].innerText === title) {
                alert('Sản Phẩm Đã Có Trong Giỏ Hàng');
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
            </div>`;

        cartRow.innerHTML = cartRowContents;
        cartItems.append(cartRow);

        setRemoveCartListeners();
        setQuantityListeners();
    }

    // Initialize event listeners
    setRemoveCartListeners();
    setQuantityListeners();
    setAddCartListeners();
});
