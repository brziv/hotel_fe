document.addEventListener("DOMContentLoaded", function() {
    const customerTable = document.querySelector("#customerTable");
    const partnerTable = document.querySelector("#partnerTable");
    const customerForm = document.querySelector("#customerForm");
    const partnerForm = document.querySelector("#partnerForm");
    const nameInput = document.querySelector("#name");
    const emailInput = document.querySelector("#email");
    const phoneInput = document.querySelector("#phone");
    const partnerNameInput = document.querySelector("#partnerName");
    const partnerEmailInput = document.querySelector("#partnerEmail");
    const partnerPhoneInput = document.querySelector("#partnerPhone");
    const submitBtn = document.querySelector("button[type='submit']");
    const updateBtn = document.querySelector("#updateBtn");
    const partnerSubmitBtn = document.querySelector("#partnerForm button[type='submit']");
    const partnerUpdateBtn = document.querySelector("#partnerUpdateBtn");

    let customers = [
        { name: "Nguyễn Văn A", email: "nguyenvana@gmail.com", phone: "0912345678" },
        { name: "Trần Thị B", email: "tranthib@gmail.com", phone: "0987654321" },
        { name: "Lê Văn C", email: "levanc@gmail.com", phone: "0971122334" }
    ];

    let partners = [
        { name: "Công ty ABC", email: "abc@company.com", phone: "0901234567" },
        { name: "Công ty XYZ", email: "xyz@company.com", phone: "0907654321" }
    ];

    let editIndex = null;
    let editPartnerIndex = null;

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

    function renderPartners() {
        partnerTable.innerHTML = "";
        partners.forEach((partner, index) => {
            let row = `
                <tr>
                    <td>${partner.name}</td>
                    <td>${partner.email}</td>
                    <td>${partner.phone}</td>
                    <td>
                        <button onclick="editPartner(${index})">Sửa</button>
                        <button onclick="deletePartner(${index})">Xóa</button>
                    </td>
                </tr>
            `;
            partnerTable.innerHTML += row;
        });
    }

    function checkDuplicate(email, phone, excludeIndex = null, list = customers) {
        return list.some((item, index) => 
            (item.email === email || item.phone === phone) && index !== excludeIndex
        );
    }

    customerForm.addEventListener("submit", function(event) {
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
        customerForm.reset();
    });

    partnerForm.addEventListener("submit", function(event) {
        event.preventDefault();
        let name = partnerNameInput.value.trim();
        let email = partnerEmailInput.value.trim();
        let phone = partnerPhoneInput.value.trim();

        if (checkDuplicate(email, phone, null, partners)) {
            alert("Email hoặc Số điện thoại đã tồn tại!");
            return;
        }

        partners.push({ name, email, phone });
        renderPartners();
        partnerForm.reset();
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

    window.editPartner = function(index) {
        let partner = partners[index];
        partnerNameInput.value = partner.name;
        partnerEmailInput.value = partner.email;
        partnerPhoneInput.value = partner.phone;

        editPartnerIndex = index;
        partnerSubmitBtn.style.display = "none";
        partnerUpdateBtn.style.display = "inline-block";
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
        customerForm.reset();
        submitBtn.style.display = "inline-block";
        updateBtn.style.display = "none";
        editIndex = null;
    });

    partnerUpdateBtn.addEventListener("click", function() {
        let name = partnerNameInput.value.trim();
        let email = partnerEmailInput.value.trim();
        let phone = partnerPhoneInput.value.trim();

        if (checkDuplicate(email, phone, editPartnerIndex, partners)) {
            alert("Email hoặc Số điện thoại đã tồn tại!");
            return;
        }

        partners[editPartnerIndex] = { name, email, phone };
        renderPartners();
        partnerForm.reset();
        partnerSubmitBtn.style.display = "inline-block";
        partnerUpdateBtn.style.display = "none";
        editPartnerIndex = null;
    });

    window.deleteCustomer = function(index) {
        if (confirm("Bạn có chắc chắn muốn xóa khách hàng này không?")) {
            customers.splice(index, 1);
            renderCustomers();
        }
    };

    window.deletePartner = function(index) {
        if (confirm("Bạn có chắc chắn muốn xóa đối tác này không?")) {
            partners.splice(index, 1);
            renderPartners();
        }
    };

    renderCustomers();
    renderPartners();
});