document.addEventListener("DOMContentLoaded", function() {
    const inventoryTable = document.querySelector("#inventoryTable tbody");
    const addItemBtn = document.getElementById("addItemBtn");

    let inventoryData = [
        { id: "VT001", name: "Khăn Tắm", quantity: 50, status: "Còn Hàng" },
        { id: "VT002", name: "Dầu Gội", quantity: 30, status: "Còn Hàng" },
        { id: "VT003", name: "Kem Đánh Răng", quantity: 20, status: "Sắp Hết" }
    ];

    function renderInventory() {
        inventoryTable.innerHTML = "";
        inventoryData.forEach((item, index) => {
            let row = `
                <tr>
                    <td>${item.id}</td>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>${item.status}</td>
                    <td><button onclick="deleteItem(${index})">Xóa</button></td>
                </tr>
            `;
            inventoryTable.innerHTML += row;
        });
    }

    window.deleteItem = function(index) {
        inventoryData.splice(index, 1);
        renderInventory();
    };

    renderInventory();
});