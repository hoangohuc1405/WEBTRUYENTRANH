// admin.js
document.addEventListener('DOMContentLoaded', function() {
    const addProductForm = document.getElementById('addProductForm');
    const submitButton = document.getElementById('submitButton');
    const productTable = document.getElementById('productTable').getElementsByTagName('tbody')[0];
    let editingRowIndex = null;

    // Load products from localStorage
    loadProductsFromLocalStorage();

    submitButton.addEventListener('click', function(event) {
        event.preventDefault();
        const productName = document.getElementById('productName').value.trim();
        const productPrice = document.getElementById('productPrice').value.trim();
        const productImage = document.getElementById('productImage').value.trim();

        if (productName && productPrice && productImage) {
            if (editingRowIndex !== null) {
                // Update existing product
                updateProductInTable(productName, productPrice, productImage, editingRowIndex);
                updateLocalStorage();
                editingRowIndex = null; // Clear editing state
                submitButton.textContent = 'Thêm Sản phẩm'; // Change button text back
            } else {
                // Check for duplicate product
                if (isProductDuplicate(productName)) {
                    alert("Sản phẩm này đã tồn tại.");
                } else {
                    // Add new product
                    addProductToTable(productName, productPrice, productImage);
                    saveProductToLocalStorage(productName, productPrice, productImage);
                }
            }
            addProductForm.reset();
        } else {
            alert("Vui lòng điền đầy đủ thông tin sản phẩm.");
        }
    });

    function addProductToTable(name, price, image) {
        const row = productTable.insertRow();
        row.innerHTML = `
            <td>${name}</td>
            <td>${price} VNĐ</td>
            <td><img src="${image}" alt="${name}" style="width: 100px;"></td>
            <td>
                <button class="edit-btn">Sửa</button>
                <button class="delete-btn">Xóa</button>
            </td>
        `;
    }

    function saveProductToLocalStorage(name, price, image) {
        let products = JSON.parse(localStorage.getItem('products')) || [];
        products.push({ name, price, image });
        localStorage.setItem('products', JSON.stringify(products));
    }

    function loadProductsFromLocalStorage() {
        let products = JSON.parse(localStorage.getItem('products')) || [];
        products.forEach((product, index) => addProductToTable(product.name, product.price, product.image));
    }

    function updateProductInTable(name, price, image, rowIndex) {
        if (rowIndex >= 0 && rowIndex < productTable.rows.length) {
            const row = productTable.rows[rowIndex];
            row.cells[0].innerText = name;
            row.cells[1].innerText = `${price} VNĐ`;
            row.cells[2].getElementsByTagName('img')[0].src = image;
        }
    }

    function updateLocalStorage() {
        let rows = productTable.getElementsByTagName('tr');
        let products = [];
        for (let i = 0; i < rows.length; i++) {
            let cells = rows[i].getElementsByTagName('td');
            if (cells.length > 0) {
                let name = cells[0].innerText;
                let price = cells[1].innerText.replace(' VNĐ', '');
                let image = cells[2].getElementsByTagName('img')[0].src;
                products.push({ name, price, image });
            }
        }
        localStorage.setItem('products', JSON.stringify(products));
    }

    function isProductDuplicate(name) {
        let products = JSON.parse(localStorage.getItem('products')) || [];
        return products.some(product => product.name.toLowerCase() === name.toLowerCase());
    }

    productTable.addEventListener('click', function(event) {
        if (event.target.classList.contains('edit-btn')) {
            editProduct(event.target);
        } else if (event.target.classList.contains('delete-btn')) {
            deleteProduct(event.target);
        }
    });

    function editProduct(button) {
        const row = button.parentElement.parentElement;
        const rowIndex = row.rowIndex - 1; // Adjust for table headers
        const name = row.cells[0].innerText;
        const price = row.cells[1].innerText.replace(' VNĐ', '');
        const image = row.cells[2].getElementsByTagName('img')[0].src;

        document.getElementById('productName').value = name;
        document.getElementById('productPrice').value = price;
        document.getElementById('productImage').value = image;

        // Save row index for later update
        editingRowIndex = rowIndex;
        submitButton.textContent = 'Sửa'; // Change button text to 'Sửa'
    }

    function deleteProduct(button) {
        const row = button.parentElement.parentElement;
        row.remove();
        updateLocalStorage();
    }
});
