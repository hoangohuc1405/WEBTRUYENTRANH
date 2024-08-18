document.addEventListener("DOMContentLoaded", function () {
    let modal = document.getElementById("myModal");
    let btn = document.getElementById("cart");
    let close = document.getElementsByClassName("close")[0];
    let closeFooter = document.getElementsByClassName("close-footer")[0];
    let order = document.getElementsByClassName("order")[0];
    let searchForm = document.getElementById("search-form");
    let searchInput = document.getElementById("search-input");
    let signinButton = document.getElementById('signin-button');

    // Hiển thị tên người dùng hoặc nút đăng nhập
    function updateSigninButton() {
        const username = localStorage.getItem('username');
        if (username) {
            signinButton.innerHTML = `
                ${username}
                <div class="dropdown-menu">
                    <a href="#" class="dropdown-item">Người dùng</a>
                    <a href="admin-auth.html" class="dropdown-item">Người quản lý</a>
                    <a href="#" class="dropdown-item" id="logout">Đăng xuất</a>
                </div>
            `;
            signinButton.classList.add('dropdown');
            
            // Xử lý sự kiện Đăng xuất
            document.getElementById('logout').addEventListener('click', function () {
                localStorage.removeItem('username');
                localStorage.removeItem('isAdmin'); // Xóa trạng thái admin
                updateSigninButton();
            });
        } else {
            signinButton.innerHTML = 'Sign In';
            signinButton.classList.remove('dropdown');
        }
    }

    // Xử lý sự kiện khi nhấn vào nút đăng nhập
    signinButton.addEventListener('click', function () {
        if (!localStorage.getItem('username')) {
            window.location.href = 'login.html'; // Thay đổi đường dẫn đến trang đăng nhập của bạn
        }
    });

    // Thực hiện cập nhật giỏ hàng và các sự kiện khác
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
            localStorage.removeItem('cart'); // Xóa giỏ hàng sau khi thanh toán
            updateCart(); // Cập nhật giỏ hàng
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
        loadCartFromLocalStorage(); // Tải giỏ hàng từ localStorage
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

            total += parseFloat(item.price.replace('VNĐ', '').trim()) * item.quantity;
            cartQuantity += item.quantity;
        });

        let totalPriceElement = document.getElementsByClassName("cart-total-price")[0];
        if (totalPriceElement) {
            totalPriceElement.textContent = total.toFixed(2) + ' VNĐ';
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
    setQuantityListeners();
    loadProductsFromLocalStorage();
    updateSigninButton(); // Cập nhật nút đăng nhập khi trang được tải
});
