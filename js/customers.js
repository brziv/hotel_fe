document.addEventListener("DOMContentLoaded", function() {
    const customerTable = document.querySelector("#customerTable");
    const form = document.querySelector("#customerForm");
    const nameInput = document.querySelector("#name");
    const emailInput = document.querySelector("#email");
    const phoneInput = document.querySelector("#phone");
    const submitBtn = document.querySelector("button[type='submit']");
    const updateBtn = document.querySelector("#updateBtn");

    let customers = [
        { name: "Nguyễn Văn A", email: "nguyenvana@gmail.com", phone: "0912345678" },
        { name: "Trần Thị B", email: "tranthib@gmail.com", phone: "0987654321" },
        { name: "Lê Văn C", email: "levanc@gmail.com", phone: "0971122334" }
    ];

    let editIndex = null;

    function renderCustomers() {
        customerTable.innerHTML = "";
        customers.forEach((customer, index) => {
            let row = `
                <tr>
                    <td>${customer.name}</td>
                    <td>${customer.email}</td>
                    <td>${customer.phone}</td>
                    <td>
                        <button onclick="editCustomer(${index})">Sửa</button>
                        <button onclick="deleteCustomer(${index})">Xóa</button>
                    </td>
                </tr>
            `;
            customerTable.innerHTML += row;
        });
    }

    function checkDuplicate(email, phone, excludeIndex = null) {
        return customers.some((customer, index) => 
            (customer.email === email || customer.phone === phone) && index !== excludeIndex
        );
    }

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        let name = nameInput.value.trim();
        let email = emailInput.value.trim();
        let phone = phoneInput.value.trim();

        if (checkDuplicate(email, phone)) {
            alert("Email hoặc Số điện thoại đã tồn tại!");
            return;
        }

        customers.push({ name, email, phone });
        renderCustomers();
        form.reset();
    });

    window.editCustomer = function(index) {
        let customer = customers[index];
        nameInput.value = customer.name;
        emailInput.value = customer.email;
        phoneInput.value = customer.phone;

        editIndex = index;
        submitBtn.style.display = "none";
        updateBtn.style.display = "inline-block";
    };

    updateBtn.addEventListener("click", function() {
        let name = nameInput.value.trim();
        let email = emailInput.value.trim();
        let phone = phoneInput.value.trim();

        if (checkDuplicate(email, phone, editIndex)) {
            alert("Email hoặc Số điện thoại đã tồn tại!");
            return;
        }

        customers[editIndex] = { name, email, phone };
        renderCustomers();
        form.reset();
        submitBtn.style.display = "inline-block";
        updateBtn.style.display = "none";
        editIndex = null;
    });

    window.deleteCustomer = function(index) {
        if (confirm("Bạn có chắc chắn muốn xóa khách hàng này không?")) {
            customers.splice(index, 1);
            renderCustomers();
        }
    };

    renderCustomers();
});