document.addEventListener("DOMContentLoaded", function() {
    console.log("Trang Khách Hàng và Đối Tác đã tải!");
});

function loadCustomers() {
    const customers = [
        { id: 1, name: "Nguyễn Văn A", email: "nguyenvana@gmail.com", phone: "0912345678" },
        { id: 2, name: "Trần Thị B", email: "tranthib@gmail.com", phone: "0987654321" },
        { id: 3, name: "Lê Văn C", email: "levanc@gmail.com", phone: "0971122334" }
    ];

    let tableBody = document.querySelector("#customer-table tbody");
    tableBody.innerHTML = "";

    customers.forEach(customer => {
        let row = `
            <tr>
                <td>${customer.id}</td>
                <td>${customer.name}</td>
                <td>${customer.email}</td>
                <td>${customer.phone}</td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}
