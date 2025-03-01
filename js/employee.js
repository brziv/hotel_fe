document.addEventListener("DOMContentLoaded", function() {
    const employeeTable = document.querySelector("#employeeTable");
    const form = document.querySelector("#employeeForm");
    const nameInput = document.querySelector("#name");
    const roleInput = document.querySelector("#role");
    const emailInput = document.querySelector("#email");
    const phoneInput = document.querySelector("#phone");
    const submitBtn = document.querySelector("button[type='submit']");
    const updateBtn = document.querySelector("#updateBtn");

    let employees = [
        { name: "Nguyễn Văn A", role: "Quản lý", email: "a@example.com", phone: "0123456789" },
        { name: "Trần Thị B", role: "Nhân viên", email: "b@example.com", phone: "0987654321" }
    ];

    let editIndex = null;

    function renderEmployees() {
        employeeTable.innerHTML = "";
        employees.forEach((emp, index) => {
            let row = `
                <tr>
                    <td>${emp.name}</td>
                    <td>${emp.role}</td>
                    <td>${emp.email}</td>
                    <td>${emp.phone}</td>
                    <td>
                        <button onclick="editEmployee(${index})">Sửa</button>
                        <button onclick="deleteEmployee(${index})">Xóa</button>
                    </td>
                </tr>
            `;
            employeeTable.innerHTML += row;
        });
    }

    function checkDuplicate(email, phone, excludeIndex = null) {
        return employees.some((emp, index) => 
            (emp.email === email || emp.phone === phone) && index !== excludeIndex
        );
    }

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        let name = nameInput.value.trim();
        let role = roleInput.value.trim();
        let email = emailInput.value.trim();
        let phone = phoneInput.value.trim();

        if (checkDuplicate(email, phone)) {
            alert("Email hoặc Số điện thoại đã tồn tại!");
            return;
        }

        employees.push({ name, role, email, phone });
        renderEmployees();
        form.reset();
    });

    window.editEmployee = function(index) {
        let emp = employees[index];
        nameInput.value = emp.name;
        roleInput.value = emp.role;
        emailInput.value = emp.email;
        phoneInput.value = emp.phone;

        editIndex = index;
        submitBtn.style.display = "none";
        updateBtn.style.display = "inline-block";
    };

    updateBtn.addEventListener("click", function() {
        let name = nameInput.value.trim();
        let role = roleInput.value.trim();
        let email = emailInput.value.trim();
        let phone = phoneInput.value.trim();

        if (checkDuplicate(email, phone, editIndex)) {
            alert("Email hoặc Số điện thoại đã tồn tại!");
            return;
        }

        employees[editIndex] = { name, role, email, phone };
        renderEmployees();
        form.reset();
        submitBtn.style.display = "inline-block";
        updateBtn.style.display = "none";
        editIndex = null;
    });

    window.deleteEmployee = function(index) {
        if (confirm("Bạn có chắc chắn muốn xóa nhân viên này?")) {
            employees.splice(index, 1);
            renderEmployees();
        }
    };

    renderEmployees();
});
