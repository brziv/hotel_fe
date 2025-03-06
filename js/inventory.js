document.addEventListener("DOMContentLoaded", function() {
    const inventoryTable = document.querySelector("#inventoryTable tbody");
    const form = document.querySelector("#inventoryForm");
    const itemIdInput = document.querySelector("#itemId");
    const itemNameInput = document.querySelector("#itemName");
    const itemQuantityInput = document.querySelector("#itemQuantity");
    const itemStatusInput = document.querySelector("#itemStatus");
    const submitBtn = document.querySelector("button[type='submit']");
    const updateBtn = document.querySelector("#updateBtn");

    let inventoryData = JSON.parse(localStorage.getItem("inventory")) || [
        { id: "VT001", name: "Khăn Tắm", quantity: 50, status: "Còn Hàng" },
        { id: "VT002", name: "Dầu Gội", quantity: 30, status: "Còn Hàng" },
        { id: "VT003", name: "Kem Đánh Răng", quantity: 20, status: "Sắp Hết" }
    ];

    let editIndex = null;

    function renderInventory() {
        inventoryTable.innerHTML = "";
        inventoryData.forEach((item, index) => {
            let row = `
                <tr>
                    <td>${item.id}</td>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>${item.status}</td>
                    <td>
                        <button onclick="editItem(${index})">Sửa</button>
                        <button onclick="deleteItem(${index})">Xóa</button>
                    </td>
                </tr>
            `;
            inventoryTable.innerHTML += row;
        });
    }

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        let id = itemIdInput.value.trim();
        let name = itemNameInput.value.trim();
        let quantity = itemQuantityInput.value.trim();
        let status = itemStatusInput.value.trim();

        inventoryData.push({ id, name, quantity, status });
        localStorage.setItem("inventory", JSON.stringify(inventoryData));
        renderInventory();
        form.reset();
    });

    window.editItem = function(index) {
        let item = inventoryData[index];
        itemIdInput.value = item.id;
        itemNameInput.value = item.name;
        itemQuantityInput.value = item.quantity;
        itemStatusInput.value = item.status;

        editIndex = index;
        submitBtn.style.display = "none";
        updateBtn.style.display = "inline-block";
    };

    updateBtn.addEventListener("click", function() {
        let id = itemIdInput.value.trim();
        let name = itemNameInput.value.trim();
        let quantity = itemQuantityInput.value.trim();
        let status = itemStatusInput.value.trim();

        inventoryData[editIndex] = { id, name, quantity, status };
        localStorage.setItem("inventory", JSON.stringify(inventoryData));
        renderInventory();
        form.reset();
        submitBtn.style.display = "inline-block";
        updateBtn.style.display = "none";
        editIndex = null;
    });

    window.deleteItem = function(index) {
        if (confirm("Bạn có chắc chắn muốn xóa vật tư này không?")) {
            inventoryData.splice(index, 1);
            localStorage.setItem("inventory", JSON.stringify(inventoryData));
            renderInventory();
        }
    };

    renderInventory();
});