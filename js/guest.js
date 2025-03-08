document.addEventListener("DOMContentLoaded", function () {
    const guestTable = document.querySelector("#guestTable");
    const guestForm = document.querySelector("#guestForm");
    const guestFirstNameInput = document.querySelector("#guestFirstName");
    const guestLastNameInput = document.querySelector("#guestLastName");
    const guestEmailInput = document.querySelector("#guestEmail");
    const guestPhoneInput = document.querySelector("#guestPhone");
    const guestSubmitBtn = document.querySelector("button[type='submit']");
    const guestUpdateBtn = document.querySelector("#guestUpdateBtn");

    let guests = [];
    let editGuestIndex = null;

    async function fetchGuests() {
        try {
            const response = await fetch("http://localhost:5222/api/Guest/GetGuestList");
            const data = await response.json();
            guests = data.data;
            renderGuests();
        } catch (error) {
            console.error("Error fetching guests:", error);
        }
    }

    function renderGuests() {
        guestTable.innerHTML = "";
        guests.forEach((guest, index) => {
            let row = `
                <tr>
                    <td>${guest.gFirstName}</td>
                    <td>${guest.gLastName}</td>
                    <td>${guest.gEmail}</td>
                    <td>${guest.gPhoneNumber}</td>
                    <td>
                        <button onclick="editGuest(${index})">Sửa</button>
                        <button onclick="deleteGuest(${index})">Xóa</button>
                    </td>
                </tr>
            `;
            guestTable.innerHTML += row;
        });
    }

    async function addGuest(guest) {
        try {
            const response = await fetch("http://localhost:5222/api/Guest/InsertTblGuest", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(guest)
            });
            const data = await response.json();
            guests.push(data.data);
            renderGuests();
        } catch (error) {
            console.error("Error adding guest:", error);
        }
    }

    async function updateGuest(guest) {
        try {
            const response = await fetch("http://localhost:5222/api/Guest/UpdateTblGuest", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(guest)
            });
            if (!response.ok) throw new Error("Failed to update guest");

            await fetchGuests();
        } catch (error) {
            console.error("Error updating guest:", error);
        }
    }

    async function deleteGuest(index) {
        try {
            const guest = guests[index];
    
            const response = await fetch(`http://localhost:5222/api/Guest/XoaTblGuest?gGuestId=${guest.gGuestId}`, {
                method: "DELETE",
            });
    
            if (!response.ok) throw new Error("Failed to delete guest");
    
            await fetchGuests();
        } catch (error) {
            console.error("Error deleting guest:", error);
        }
    }
    
    guestForm.addEventListener("submit", function (event) {
        event.preventDefault();
        let firstName = guestFirstNameInput.value.trim();
        let lastName = guestLastNameInput.value.trim();
        let email = guestEmailInput.value.trim();
        let phone = guestPhoneInput.value.trim();

        const guest = {
            gGuestId: crypto.randomUUID(),
            gFirstName: firstName,
            gLastName: lastName,
            gEmail: email,
            gPhoneNumber: phone
        };

        addGuest(guest);
        guestForm.reset();
    });

    window.editGuest = function (index) {
        let guest = guests[index];
        guestFirstNameInput.value = guest.gFirstName;
        guestLastNameInput.value = guest.gLastName;
        guestEmailInput.value = guest.gEmail;
        guestPhoneInput.value = guest.gPhoneNumber;

        editGuestIndex = index;
        guestSubmitBtn.style.display = "none";
        guestUpdateBtn.style.display = "inline-block";
    };

    guestUpdateBtn.addEventListener("click", function () {
        let firstName = guestFirstNameInput.value.trim();
        let lastName = guestLastNameInput.value.trim();
        let email = guestEmailInput.value.trim();
        let phone = guestPhoneInput.value.trim();

        const guest = {
            gGuestId: guests[editGuestIndex].gGuestId,
            gFirstName: firstName,
            gLastName: lastName,
            gEmail: email,
            gPhoneNumber: phone
        };

        updateGuest(guest);
        guestForm.reset();
        guestSubmitBtn.style.display = "inline-block";
        guestUpdateBtn.style.display = "none";
        editGuestIndex = null;
    });

    window.deleteGuest = function (index) {
        if (confirm("Bạn có chắc chắn muốn xóa khách hàng này không?")) {
            deleteGuest(index);
        }
    };

    fetchGuests();
});