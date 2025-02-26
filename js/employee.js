document.addEventListener("DOMContentLoaded", function() {
    const employeeTable = document.querySelector("#employeeTable");
    
    let employees = [
        { name: "Nguyễn Văn A", role: "Quản lý", email: "a@example.com", phone: "0123456789" },
        { name: "Trần Thị B", role: "Nhân viên", email: "b@example.com", phone: "0987654321" }
    ];

    function renderEmployees() {
        employeeTable.innerHTML = "";
        employees.forEach((emp, index) => {
            let row = `
                <tr>
                    <td>${emp.name}</td>
                    <td>${emp.role}</td>
                    <td>${emp.email}</td>
                    <td>${emp.phone}</td>
                    <td><button onclick="deleteEmployee(${index})">Xóa</button></td>
                </tr>
            `;
            employeeTable.innerHTML += row;
        });
    }

    window.deleteEmployee = function(index) {
        employees.splice(index, 1);
        renderEmployees();
    };

    renderEmployees();
});