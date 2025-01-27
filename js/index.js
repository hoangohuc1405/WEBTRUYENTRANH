document.addEventListener("DOMContentLoaded", function () {
    let modal = document.getElementById("myModal");
    let btn = document.getElementById("cart");
    let close = document.getElementsByClassName("close")[0];
    let closeFooter = document.getElementsByClassName("close-footer")[0];
    let order = document.getElementsByClassName("order")[0];
    let searchInput = document.getElementById("search-input");
    let filterPriceBtn = document.getElementById("filter-price-btn");
    let minPriceInput = document.getElementById("min-price");
    let maxPriceInput = document.getElementById("max-price");
    let signinButton = document.getElementById('signin-button');
    let brandButtons = document.querySelectorAll('.filter-section .dropdown .item');

    function updateSigninButton() {
        const username = localStorage.getItem('username');
        if (username) {
            signinButton.innerHTML = `
                ${username}
                <div class="dropdown-menu">
                    <a href="#" class="dropdown-item">Người dùng</a>
                    <a href="admin-auth.html" class="dropdown-item">Người quản lý</a>
                    <a href="home.html" class="dropdown-item" id="logout">Đăng xuất</a>
                </div>
            `;
            signinButton.classList.add('dropdown');

            document.getElementById('logout').addEventListener('click', function () {
                localStorage.removeItem('username');
                localStorage.removeItem('isAdmin');
                updateSigninButton();
            });
        } else {
            signinButton.innerHTML = 'Sign In';
            signinButton.classList.remove('dropdown');
        }
    }

    signinButton.addEventListener('click', function () {
        if (!localStorage.getItem('username')) {
            window.location.href = 'login.html';
        }
    });

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
            const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
            if (cartItems.length > 0) {
                // Lưu sản phẩm đã bán vào localStorage của admin
                let soldProducts = JSON.parse(localStorage.getItem('soldProducts')) || [];
                soldProducts = soldProducts.concat(cartItems.map(item => ({
                    ...item,
                    status: 'Chưa thanh toán' // Trạng thái mặc định khi thanh toán
                })));
                localStorage.setItem('soldProducts', JSON.stringify(soldProducts));

                // Xóa giỏ hàng sau khi thanh toán
                localStorage.removeItem('cart');
                updateCart(); // Cập nhật giỏ hàng trên trang
                alert('Cảm ơn bạn đã thanh toán đơn hàng');
            } else {
                alert('Giỏ hàng trống');
            }
        };
    }

    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }

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
        loadCartFromLocalStorage();
        applyFilters();
    }

    function addItemToCart(title, price, img) {
        let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        let existingProduct = cartItems.find(item => item.title === title);

        if (existingProduct) {
            alert("Sản phẩm đã có trong giỏ hàng!");
            return;
        }

        let cartItem = {
            title: title,
            price: price,
            img: img,
            quantity: 1
        };

        cartItems.push(cartItem);
        localStorage.setItem('cart', JSON.stringify(cartItems));
        updateCart();
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
        let title = row.querySelector(".cart-item-title").textContent;
        let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

        cartItems = cartItems.filter(item => item.title !== title);
        localStorage.setItem('cart', JSON.stringify(cartItems));

        row.remove();
        updateCart();
    }

    function updateCart() {
        let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        let cartItemContainer = document.querySelector('.cart-items-product');
        cartItemContainer.innerHTML = '';

        let total = 0;
        let cartQuantity = 0;

        cartItems.forEach(item => {
            const cartRow = document.createElement('div');
            cartRow.classList.add('cart-row');
            const cartRowContents = `
                <div class="cart-item cart-column">
                    <img class="cart-item-image" src="${item.img}" width="100" height="100">
                    <span class="cart-item-title">${item.title}</span>
                </div>
                <span class="cart-price cart-column">${item.price}</span>
                <div class="cart-quantity cart-column">
                    <input class="cart-quantity-input" type="number" value="${item.quantity}">
                    <button class="btn btn-danger" type="button">Xóa</button>
                </div>
            `;
            cartRow.innerHTML = cartRowContents;
            cartItemContainer.append(cartRow);

            total += parseFloat(item.price.replace('VNĐ', '').trim().replace(/\./g, '')) * item.quantity;
            cartQuantity += item.quantity;
        });

        let totalPriceElement = document.getElementsByClassName("cart-total-price")[0];
        if (totalPriceElement) {
            totalPriceElement.textContent = total.toLocaleString() + ' VNĐ';
        }

        let cartCountSpan = document.getElementById("cart-count");
        if (cartCountSpan) {
            cartCountSpan.textContent = cartQuantity;
        }

        setRemoveCartListeners();
        setQuantityListeners();
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
        let title = input.closest('.cart-row').querySelector('.cart-item-title').textContent;
        let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        let item = cartItems.find(item => item.title === title);

        if (item) {
            item.quantity = parseInt(input.value, 10) || 1;
            localStorage.setItem('cart', JSON.stringify(cartItems));
            updateCart();
        }
    }

    function loadCartFromLocalStorage() {
        updateCart();
    }

    function searchProducts(query) {
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

    function applyFilters() {
        let query = searchInput.value.toLowerCase();
        let minPrice = parseFloat(minPriceInput.value) || 0;
        let maxPrice = parseFloat(maxPriceInput.value) || Infinity;
        let products = document.querySelectorAll('.products .main-product');

        products.forEach(function (product) {
            let title = product.querySelector('.content-product-h3').textContent.toLowerCase();
            let priceText = product.querySelector('.money').textContent.replace('VNĐ', '').trim().replace(/\./g, '');
            let price = parseFloat(priceText) || 0;

            let isPriceInRange = price >= minPrice && price <= maxPrice;
            let isTitleMatching = title.includes(query);

            if (isPriceInRange && isTitleMatching) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });
    }

    searchInput.addEventListener('input', function () {
        searchProducts(searchInput.value.toLowerCase());
    });

    filterPriceBtn.addEventListener('click', function () {
        applyFilters();
    });

    brandButtons.forEach(button => {
        button.addEventListener('click', function () {
            const brand = this.getAttribute('data-brand');
            filterProductsByBrand(brand);
        });
    });

    function filterProductsByBrand(brand) {
        let products = document.querySelectorAll('.products .main-product');
        products.forEach(function (product) {
            let productBrand = product.querySelector('.content-product-h3').textContent.toLowerCase();
            if (brand === 'other') {
                if (!['butterfly', 'stiga', 'lining', 'mizuno', 'joola'].some(b => productBrand.includes(b))) {
                    product.style.display = 'block';
                } else {
                    product.style.display = 'none';
                }
            } else {
                if (productBrand.includes(brand)) {
                    product.style.display = 'block';
                } else {
                    product.style.display = 'none';
                }
            }
        });
    }

    loadProductsFromLocalStorage();
    updateSigninButton();
});
