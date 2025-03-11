document.addEventListener("DOMContentLoaded", function () {
    const employeeTable = document.querySelector("#employeeTable");
    const employeeForm = document.querySelector("#employeeForm");
    const employeeFirstNameInput = document.querySelector("#employeeFirstName");
    const employeeLastNameInput = document.querySelector("#employeeLastName");
    const employeeRoleInput = document.querySelector("#employeeRole");
    const employeeEmailInput = document.querySelector("#employeeEmail");
    const employeePhoneInput = document.querySelector("#employeePhone");
    const employeeSalaryInput = document.querySelector("#employeeSalary");
    const employeeSubmitBtn = document.querySelector("button[type='submit']");
    const employeeUpdateBtn = document.querySelector("#employeeUpdateBtn");

    let employees = [];
    let editEmployeeIndex = null;

    async function fetchEmployees() {
        try {
            const response = await fetch("https://hotel-bed.onrender.com/api/Employee/GetEmployeeList");
            const data = await response.json();
            employees = data.data;
            renderEmployees();
        } catch (error) {
            console.error("Error fetching employees:", error);
        }
    }

    function renderEmployees() {
        employeeTable.innerHTML = "";
        employees.forEach((employee, index) => {
            let row = `
                <tr>
                    <td>${employee.eFirstName}</td>
                    <td>${employee.eLastName}</td>
                    <td>${employee.ePosition}</td>
                    <td>${employee.eEmail}</td>
                    <td>${employee.ePhoneNumber}</td>
                    <td>${employee.eSalary}</td>
                    <td>
                        <button onclick="editEmployee(${index})">Sửa</button>
                        <button onclick="deleteEmployee(${index})">Xóa</button>
                    </td>
                </tr>
            `;
            employeeTable.innerHTML += row;
        });
    }

    employeeUpdateBtn.addEventListener("click", function () {
        let firstName = employeeFirstNameInput.value.trim();
        let lastName = employeeLastNameInput.value.trim();
        let role = employeeRoleInput.value.trim();
        let email = employeeEmailInput.value.trim();
        let phone = employeePhoneInput.value.trim();
        let salary = parseFloat(employeeSalaryInput.value.trim());

        const employee = {
            eEmployeeId: employees[editEmployeeIndex].eEmployeeId,
            eFirstName: firstName,
            eLastName: lastName,
            eEmail: email,
            ePhoneNumber: phone,
            ePosition: role,
            eSalary: salary
        };

        updateEmployee(employee);
        employeeForm.reset();
        employeeSubmitBtn.style.display = "inline-block";
        employeeUpdateBtn.style.display = "none";
        editEmployeeIndex = null;
    });

    async function addEmployee(employee) {
        try {
            const response = await fetch("https://hotel-bed.onrender.com/api/Employee/InsertTblEmployee", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(employee)
            });
            const data = await response.json();
            employees.push(data.data);
            renderEmployees();
        } catch (error) {
            console.error("Error adding employee:", error);
        }
    }

    employeeForm.addEventListener("submit", function (event) {
        event.preventDefault();
        let firstName = employeeFirstNameInput.value.trim();
        let lastName = employeeLastNameInput.value.trim();
        let role = employeeRoleInput.value.trim();
        let email = employeeEmailInput.value.trim();
        let phone = employeePhoneInput.value.trim();
        let salary = parseFloat(employeeSalaryInput.value.trim());

        const employee = {
            eEmployeeId: crypto.randomUUID(),
            eFirstName: firstName,
            eLastName: lastName,
            eEmail: email,
            ePhoneNumber: phone,
            ePosition: role,
            eSalary: salary
        };

        addEmployee(employee);
        employeeForm.reset();
    });

    window.editEmployee = function (index) {
        let employee = employees[index];
        employeeFirstNameInput.value = employee.eFirstName;
        employeeLastNameInput.value = employee.eLastName;
        employeeRoleInput.value = employee.ePosition;
        employeeEmailInput.value = employee.eEmail;
        employeePhoneInput.value = employee.ePhoneNumber;
        employeeSalaryInput.value = employee.eSalary;

        editEmployeeIndex = index;
        employeeSubmitBtn.style.display = "none";
        employeeUpdateBtn.style.display = "inline-block";
    };

    async function updateEmployee(employee) {
        try {
            const response = await fetch("https://hotel-bed.onrender.com/api/Employee/UpdateTblEmployee", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(employee)
            });
            if (!response.ok) throw new Error("Failed to update employee");

            await fetchEmployees();
        } catch (error) {
            console.error("Error updating employee:", error);
        }
    }

    window.deleteEmployee = function (index) {
        if (confirm("Bạn có chắc chắn muốn xóa nhân viên này không?")) {
            deleteEmployee(index);
        }
    };

    async function deleteEmployee(index) {
        try {
            const employee = employees[index];

            const response = await fetch(`https://hotel-bed.onrender.com/api/Employee/XoaTblEmployee?eEmployeeId=${employee.eEmployeeId}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Failed to delete employee");

            await fetchEmployees();
        } catch (error) {
            console.error("Error deleting employee:", error);
        }
    }

    fetchEmployees();
});