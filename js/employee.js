document.addEventListener("DOMContentLoaded", function() {
    const employeeTable = document.querySelector("#employeeTable");
    const form = document.querySelector("#employeeForm");
    const nameInput = document.querySelector("#name");
    const roleInput = document.querySelector("#role");
    const emailInput = document.querySelector("#email");
    const phoneInput = document.querySelector("#phone");
    const salaryInput = document.querySelector("#salary");
    const submitBtn = document.querySelector("button[type='submit']");
    const updateBtn = document.querySelector("#updateBtn");

    let employees = [];

    let editIndex = null;

    async function fetchEmployees() {
        const response = await fetch('http://localhost:5222/api/Employee/GetEmployeeList');
        const data = await response.json();
        employees = data.data;
        renderEmployees();
    }

    function renderEmployees() {
        employeeTable.innerHTML = "";
        employees.forEach((emp, index) => {
            let row = `
                <tr>
                    <td>${emp.eFirstName} ${emp.eLastName}</td>
                    <td>${emp.ePosition}</td>
                    <td>${emp.eEmail}</td>
                    <td>${emp.ePhoneNumber}</td>
                    <td>${emp.eSalary}</td>
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
            (emp.eEmail === email || emp.ePhoneNumber === phone) && index !== excludeIndex
        );
    }

    form.addEventListener("submit", async function(event) {
        event.preventDefault();
        let name = nameInput.value.trim();
        let role = roleInput.value.trim();
        let email = emailInput.value.trim();
        let phone = phoneInput.value.trim();
        let salary = parseFloat(salaryInput.value.trim());

        if (checkDuplicate(email, phone)) {
            alert("Email hoặc Số điện thoại đã tồn tại!");
            return;
        }

        const [firstName, lastName] = name.split(' ');

        const response = await fetch('http://localhost:5222/api/Employee/InsertTblEmployee', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                eEmployeeId: crypto.randomUUID(),
                eFirstName: firstName,
                eLastName: lastName,
                eEmail: email,
                ePhoneNumber: phone,
                ePosition: role,
                eSalary: salary
            })
        });

        const data = await response.json();
        employees.push(data.data);
        renderEmployees();
        form.reset();
    });

    window.editEmployee = function(index) {
        let emp = employees[index];
        nameInput.value = `${emp.eFirstName} ${emp.eLastName}`;
        roleInput.value = emp.ePosition;
        emailInput.value = emp.eEmail;
        phoneInput.value = emp.ePhoneNumber;
        salaryInput.value = emp.eSalary;

        editIndex = index;
        submitBtn.style.display = "none";
        updateBtn.style.display = "inline-block";
    };

    updateBtn.addEventListener("click", async function() {
        let name = nameInput.value.trim();
        let role = roleInput.value.trim();
        let email = emailInput.value.trim();
        let phone = phoneInput.value.trim();
        let salary = parseFloat(salaryInput.value.trim());

        if (checkDuplicate(email, phone, editIndex)) {
            alert("Email hoặc Số điện thoại đã tồn tại!");
            return;
        }

        const [firstName, lastName] = name.split(' ');

        const response = await fetch('http://localhost:5222/api/Employee/UpdateTblEmployee', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                eEmployeeId: employees[editIndex].eEmployeeId,
                eFirstName: firstName,
                eLastName: lastName,
                eEmail: email,
                ePhoneNumber: phone,
                ePosition: role,
                eSalary: salary
            })
        });

        const data = await response.json();
        employees[editIndex] = data.data;
        renderEmployees();
        form.reset();
        submitBtn.style.display = "inline-block";
        updateBtn.style.display = "none";
        editIndex = null;
    });

    window.deleteEmployee = async function(index) {
        if (confirm("Bạn có chắc chắn muốn xóa nhân viên này?")) {
            const response = await fetch('http://localhost:5222/api/Employee/XoaTblEmployee', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    eEmployeeId: employees[index].eEmployeeId
                })
            });

            const data = await response.json();
            employees.splice(index, 1);
            renderEmployees();
        }
    };

    fetchEmployees();
});