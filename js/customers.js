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

    let customers = [];
    let partners = [];

    let editIndex = null;
    let editPartnerIndex = null;

    async function fetchCustomers() {
        try {
            const response = await fetch("http://localhost:5222/api/Guest/GetGuestList");
            const data = await response.json();
            customers = data.data;
            renderCustomers();
        } catch (error) {
            console.error("Error fetching customers:", error);
        }
    }

    async function fetchPartners() {
        try {
            const response = await fetch("http://localhost:5222/api/Partner/GetPartnerList");
            const data = await response.json();
            partners = data.data;
            renderPartners();
        } catch (error) {
            console.error("Error fetching partners:", error);
        }
    }

    function renderCustomers() {
        customerTable.innerHTML = "";
        customers.forEach((customer, index) => {
            let row = `
                <tr>
                    <td>${customer.gFirstName} ${customer.gLastName}</td>
                    <td>${customer.gEmail}</td>
                    <td>${customer.gPhoneNumber}</td>
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
                    <td>${partner.pPartnerName}</td>
                    <td>${partner.pEmail}</td>
                    <td>${partner.pPhoneNumber}</td>
                    <td>
                        <button onclick="editPartner(${index})">Sửa</button>
                        <button onclick="deletePartner(${index})">Xóa</button>
                    </td>
                </tr>
            `;
            partnerTable.innerHTML += row;
        });
    }

    async function addCustomer(customer) {
        try {
            const response = await fetch("http://localhost:5222/api/Guest/InsertTblGuest", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(customer)
            });
            const data = await response.json();
            customers.push(data.data);
            renderCustomers();
        } catch (error) {
            console.error("Error adding customer:", error);
        }
    }

    async function updateCustomer(customer) {
        try {
            const response = await fetch("http://localhost:5222/api/Guest/UpdateTblGuest", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(customer)
            });
            const data = await response.json();
            customers[editIndex] = data.data;
            renderCustomers();
        } catch (error) {
            console.error("Error updating customer:", error);
        }
    }

    async function deleteCustomer(index) {
        try {
            const customer = customers[index];
            await fetch(`http://localhost:5222/api/Guest/XoaTblGuest`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ gGuestId: customer.gGuestId })
            });
            customers.splice(index, 1);
            renderCustomers();
        } catch (error) {
            console.error("Error deleting customer:", error);
        }
    }

    async function addPartner(partner) {
        try {
            const response = await fetch("http://localhost:5222/api/Partner/InsertTblPartner", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(partner)
            });
            const data = await response.json();
            partners.push(data.data);
            renderPartners();
        } catch (error) {
            console.error("Error adding partner:", error);
        }
    }

    async function updatePartner(partner) {
        try {
            const response = await fetch("http://localhost:5222/api/Partner/UpdateTblPartner", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(partner)
            });
            const data = await response.json();
            partners[editPartnerIndex] = data.data;
            renderPartners();
        } catch (error) {
            console.error("Error updating partner:", error);
        }
    }

    async function deletePartner(index) {
        try {
            const partner = partners[index];
            await fetch(`http://localhost:5222/api/Partner/XoaTblPartner`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ pPartnerId: partner.pPartnerId })
            });
            partners.splice(index, 1);
            renderPartners();
        } catch (error) {
            console.error("Error deleting partner:", error);
        }
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

        const [firstName, ...lastName] = name.split(" ");
        const customer = {
            gGuestId: crypto.randomUUID(),
            gFirstName: firstName,
            gLastName: lastName.join(" "),
            gEmail: email,
            gPhoneNumber: phone
        };

        addCustomer(customer);
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

        const partner = {
            pPartnerId: crypto.randomUUID(),
            pPartnerName: name,
            pEmail: email,
            pPhoneNumber: phone
        };

        addPartner(partner);
        partnerForm.reset();
    });

    window.editCustomer = function(index) {
        let customer = customers[index];
        nameInput.value = `${customer.gFirstName} ${customer.gLastName}`;
        emailInput.value = customer.gEmail;
        phoneInput.value = customer.gPhoneNumber;

        editIndex = index;
        submitBtn.style.display = "none";
        updateBtn.style.display = "inline-block";
    };

    window.editPartner = function(index) {
        let partner = partners[index];
        partnerNameInput.value = partner.pPartnerName;
        partnerEmailInput.value = partner.pEmail;
        partnerPhoneInput.value = partner.pPhoneNumber;

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

        const [firstName, ...lastName] = name.split(" ");
        const customer = {
            gGuestId: customers[editIndex].gGuestId,
            gFirstName: firstName,
            gLastName: lastName.join(" "),
            gEmail: email,
            gPhoneNumber: phone
        };

        updateCustomer(customer);
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

        const partner = {
            pPartnerId: partners[editPartnerIndex].pPartnerId,
            pPartnerName: name,
            pEmail: email,
            pPhoneNumber: phone
        };

        updatePartner(partner);
        partnerForm.reset();
        partnerSubmitBtn.style.display = "inline-block";
        partnerUpdateBtn.style.display = "none";
        editPartnerIndex = null;
    });

    window.deleteCustomer = function(index) {
        if (confirm("Bạn có chắc chắn muốn xóa khách hàng này không?")) {
            deleteCustomer(index);
        }
    };

    window.deletePartner = function(index) {
        if (confirm("Bạn có chắc chắn muốn xóa đối tác này không?")) {
            deletePartner(index);
        }
    };

    fetchCustomers();
    fetchPartners();
});