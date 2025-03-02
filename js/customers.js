document.addEventListener("DOMContentLoaded", function() {
    renderCustomers();
});

let customers = [
    { id: 1, name: "Nguyễn Văn A", email: "nguyenvana@gmail.com", phone: "0912345678" },
    { id: 2, name: "Trần Thị B", email: "tranthib@gmail.com", phone: "0987654321" },
    { id: 3, name: "Lê Văn C", email: "levanc@gmail.com", phone: "0971122334" }
];

function renderCustomers() {
    let tableBody = document.querySelector("#customer-table tbody");
    tableBody.innerHTML = "";

    customers.forEach((customer, index) => {
        let row = `
            <tr>
                <td>${customer.id}</td>
                <td>${customer.name}</td>
                <td>${customer.email}</td>
                <td>${customer.phone}</td>
                <td>
                    <button onclick="editCustomer(${index})">Sửa</button>
                    <button onclick="deleteCustomer(${index})">Xóa</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

function addCustomer() {
    let name = document.querySelector("#name").value.trim();
    let email = document.querySelector("#email").value.trim();
    let phone = document.querySelector("#phone").value.trim();

    if (!name || !email || !phone) {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
    }

    let isDuplicate = customers.some(c => c.email === email || c.phone === phone);
    if (isDuplicate) {
        alert("Email hoặc Số điện thoại đã tồn tại!");
        return;
    }

    let newCustomer = {
        id: customers.length ? customers[customers.length - 1].id + 1 : 1,
        name,
        email,
        phone
    };

    customers.push(newCustomer);
    renderCustomers();
    clearForm();
}

function editCustomer(index) {
    let customer = customers[index];

    document.querySelector("#name").value = customer.name;
    document.querySelector("#email").value = customer.email;
    document.querySelector("#phone").value = customer.phone;
    
    document.querySelector("#addBtn").style.visibility = "hidden";
    document.querySelector("#updateBtn").style.visibility = "visible";
    document.querySelector("#updateBtn").onclick = function() {
        updateCustomer(index);
    };
}

function updateCustomer(index) {
    let name = document.querySelector("#name").value.trim();
    let email = document.querySelector("#email").value.trim();
    let phone = document.querySelector("#phone").value.trim();

    if (!name || !email || !phone) {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
    }

    let isDuplicate = customers.some((c, i) => i !== index && (c.email === email || c.phone === phone));
    if (isDuplicate) {
        alert("Email hoặc Số điện thoại đã tồn tại!");
        return;
    }

    customers[index] = { ...customers[index], name, email, phone };
    renderCustomers();
    clearForm();

    document.querySelector("#addBtn").style.visibility = "visible";
    document.querySelector("#updateBtn").style.visibility = "hidden";
}

function deleteCustomer(index) {
    if (confirm("Bạn có chắc chắn muốn xóa khách hàng này không?")) {
        customers.splice(index, 1);
        renderCustomers();
    }
}

function clearForm() {
    document.querySelector("#name").value = "";
    document.querySelector("#email").value = "";
    document.querySelector("#phone").value = "";
}
