document.addEventListener("DOMContentLoaded", function() {
    const guestTable = document.querySelector("#guestTable");
    const guestForm = document.querySelector("#guestForm");
    const guestNameInput = document.querySelector("#guestName");
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
                    <td>${guest.gFirstName} ${guest.gLastName}</td>
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
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(guest)
            });
            const data = await response.json();
            guests[editGuestIndex] = data.data;
            renderGuests();
        } catch (error) {
            console.error("Error updating guest:", error);
        }
    }

    async function deleteGuest(index) {
        try {
            const guest = guests[index];
            await fetch(`http://localhost:5222/api/Guest/XoaTblGuest`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ gGuestId: guest.gGuestId })
            });
            guests.splice(index, 1);
            renderGuests();
        } catch (error) {
            console.error("Error deleting guest:", error);
        }
    }

    guestForm.addEventListener("submit", function(event) {
        event.preventDefault();
        let name = guestNameInput.value.trim();
        let email = guestEmailInput.value.trim();
        let phone = guestPhoneInput.value.trim();

        const [firstName, ...lastName] = name.split(" ");
        const guest = {
            gGuestId: crypto.randomUUID(),
            gFirstName: firstName,
            gLastName: lastName.join(" "),
            gEmail: email,
            gPhoneNumber: phone
        };

        addGuest(guest);
        guestForm.reset();
    });

    window.editGuest = function(index) {
        let guest = guests[index];
        guestNameInput.value = `${guest.gFirstName} ${guest.gLastName}`;
        guestEmailInput.value = guest.gEmail;
        guestPhoneInput.value = guest.gPhoneNumber;

        editGuestIndex = index;
        guestSubmitBtn.style.display = "none";
        guestUpdateBtn.style.display = "inline-block";
    };

    guestUpdateBtn.addEventListener("click", function() {
        let name = guestNameInput.value.trim();
        let email = guestEmailInput.value.trim();
        let phone = guestPhoneInput.value.trim();

        const [firstName, ...lastName] = name.split(" ");
        const guest = {
            gGuestId: guests[editGuestIndex].gGuestId,
            gFirstName: firstName,
            gLastName: lastName.join(" "),
            gEmail: email,
            gPhoneNumber: phone
        };

        updateGuest(guest);
        guestForm.reset();
        guestSubmitBtn.style.display = "inline-block";
        guestUpdateBtn.style.display = "none";
        editGuestIndex = null;
    });

    window.deleteGuest = function(index) {
        if (confirm("Bạn có chắc chắn muốn xóa khách hàng này không?")) {
            deleteGuest(index);
        }
    };

    fetchGuests();
});