let cusid = "";
let availableroomfound = [];

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^\d{10}$/; // 10-digit phone number
    return phoneRegex.test(phone);
}

// Add Customer
document.getElementById("add-customer").addEventListener("click", function () {
    document.getElementById("customer-modal").style.display = "flex";
});

document.getElementById("cancel-customer").addEventListener("click", function () {
    document.getElementById("customer-modal").style.display = "none";
});

document.getElementById("confirm-customer").addEventListener("click", async function () {
    const firstName = document.getElementById("first-name").value.trim();
    const lastName = document.getElementById("last-name").value.trim();
    const email = document.getElementById("customer-email").value.trim();
    const phoneNumber = document.getElementById("customer-phone").value.trim();

    if (!firstName || !lastName || !email || !phoneNumber) {
        alert("Please fill in all customer details.");
        return;
    }

    if (!isValidEmail(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    if (!isValidPhone(phoneNumber)) {
        alert("Please enter a valid 10-digit phone number.");
        return;
    }

    try {
        const response = await fetch(
            `http://localhost:5222/api/Booking/AddGuest?firstname=${encodeURIComponent(firstName)}&lastname=${encodeURIComponent(lastName)}&email=${encodeURIComponent(email)}&phonenum=${encodeURIComponent(phoneNumber)}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            }
        );

        if (!response.ok) throw new Error(`Server error: ${response.status}`);
        const data = await response.json();

        document.getElementById("cid").value = data.data;
        document.getElementById("name").value = `${firstName} ${lastName}`;
        document.getElementById("phonenum").value = phoneNumber;
        cusid = data.data;

        alert("Customer added successfully!");
        document.getElementById("customer-modal").style.display = "none";
    } catch (error) {
        console.error("Error adding customer:", error);
        alert(`Failed to add customer: ${error.message}`);
    }
});

// Find Available Rooms
document.getElementById("bt_findroom").addEventListener("click", function () {
    document.getElementById("find-room-modal").style.display = "flex";
});

document.getElementById("cancel-findroom").addEventListener("click", function () {
    availableroomfound = [];
    document.getElementById("search-room-body").innerHTML = "";
    document.getElementById("checkin").value = "";
    document.getElementById("checkout").value = "";
    document.getElementById("floor").value = "";
    document.getElementById("find-room-modal").style.display = "none";
});

document.getElementById("bt_search").addEventListener("click", async function () {
    const checkinDate = document.getElementById("checkin").value;
    const checkoutDate = document.getElementById("checkout").value;
    const floor = document.getElementById("floor").value.trim();

    if (!checkinDate || !checkoutDate) {
        alert("Please select both check-in and check-out dates.");
        return;
    }

    if (new Date(checkinDate) >= new Date(checkoutDate)) {
        alert("Check-out date must be after check-in date.");
        return;
    }

    const formattedCheckin = encodeURIComponent(`${checkinDate}:00.000`);
    const formattedCheckout = encodeURIComponent(`${checkoutDate}:00.000`);
    const apiUrl = `http://localhost:5222/api/Booking/FindAvailableRooms?indate=${formattedCheckin}&outdate=${formattedCheckout}&floor=${encodeURIComponent(floor)}`;

    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error("Failed to fetch available rooms");
        const data = await response.json();

        const searchRoomBody = document.getElementById("search-room-body");
        searchRoomBody.innerHTML = "";
        availableroomfound = data || [];

        if (availableroomfound.length === 0) {
            alert("No rooms available for the selected time and floor.");
            return;
        }

        availableroomfound.forEach((room, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${room.roomId}</td>
                <td>${room.roomNumber}</td>
                <td>${room.floor}</td>
                <td>${room.roomType}</td>
                <td>${room.pricePerHour}</td>
                <td><input type="checkbox" class="room-select" data-index="${index}"></td>
            `;
            searchRoomBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error finding rooms:", error);
        alert("An error occurred while searching for rooms.");
    }
});

document.getElementById("choose-room").addEventListener("click", function () {
    const newlySelectedRooms = [];
    const checkinDate = document.getElementById("checkin").value;
    const checkoutDate = document.getElementById("checkout").value;

    document.querySelectorAll(".room-select:checked").forEach(checkbox => {
        const index = checkbox.getAttribute("data-index");
        const room = availableroomfound[index];

        const isAlreadySelected = Array.from(document.querySelectorAll("#room-table-body tr")).some(
            row => row.cells[0].querySelector("input").value === room.roomId
        );

        if (!isAlreadySelected) {
            newlySelectedRooms.push(room);
        } else {
            alert(`Room ${room.roomNumber} is already selected.`);
        }
    });

    const tableBody = document.getElementById("room-table-body");
    newlySelectedRooms.forEach(room => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><input type="text" class="small-input" value="${room.roomId}" readonly></td>
            <td><input type="text" class="small-input" value="${room.roomNumber}" readonly></td>
            <td><input type="text" class="small-input" value="${room.floor}" readonly></td>
            <td><input type="text" class="small-input" value="${room.roomType}" readonly></td>
            <td><input type="text" class="small-input" value="${room.pricePerHour}" readonly></td>
            <td><input type="datetime-local" id="checkin-${room.roomId}" class="large-input" value="${checkinDate}" required></td>
            <td><input type="datetime-local" id="checkout-${room.roomId}" class="large-input" value="${checkoutDate}" required></td>
            <td><button class="delete-room">Delete</button></td>
        `;
        tableBody.appendChild(row);

        row.querySelector(".delete-room").addEventListener("click", () => row.remove());
    });

    availableroomfound = [];
    document.getElementById("search-room-body").innerHTML = "";
    document.getElementById("checkin").value = "";
    document.getElementById("checkout").value = "";
    document.getElementById("floor").value = "";
    document.getElementById("find-room-modal").style.display = "none";
});

// Book Immediately
document.getElementById("book-room").addEventListener("click", async function () {
    if (!cusid) {
        alert("No customer ID found. Please add a customer first.");
        return;
    }

    const rows = document.querySelectorAll("#room-table-body tr");
    if (rows.length === 0) {
        alert("Please select at least one room to book.");
        return;
    }

    const requestBody = {
        GuestId: cusid,
        BRdto: Array.from(rows).map(row => {
            const checkInDate = row.cells[5].querySelector("input").value;
            const checkOutDate = row.cells[6].querySelector("input").value;

            if (!checkInDate || !checkOutDate) {
                throw new Error("Check-in and check-out dates are required for all rooms.");
            }

            return {
                RoomId: row.cells[0].querySelector("input").value,
                CheckInDate: new Date(checkInDate).toISOString(),
                CheckOutDate: new Date(checkOutDate).toISOString(),
            };
        }),
    };

    console.log("Booking request:", requestBody);

    try {
        const response = await fetch("http://localhost:5222/api/Booking/BookImmediately", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) throw new Error(`Server error: ${response.status}`);
        const data = await response.json();

        alert("Room booked successfully!");
        console.log("Booking response:", data);
        document.getElementById("room-table-body").innerHTML = ""; // Clear table after booking
        cusid = ""; // Reset customer ID
        document.getElementById("cid").value = "";
        document.getElementById("name").value = "";
        document.getElementById("phonenum").value = "";
    } catch (error) {
        console.error("Booking error:", error);
        alert(`Failed to book room: ${error.message}`);
    }
});

// Pre-Book
document.getElementById("pre-book").addEventListener("click", async function () {
    if (!cusid) {
        alert("No customer ID found. Please add a customer first.");
        return;
    }

    const rows = document.querySelectorAll("#room-table-body tr");
    if (rows.length === 0) {
        alert("Please select at least one room to pre-book.");
        return;
    }

    const deposit = parseFloat(document.getElementById("deposit").value) || 0;
    if (deposit <= 0) {
        alert("Please enter a valid deposit amount.");
        return;
    }

    const requestBody = {
        GuestId: cusid,
        Deposit: deposit,
        BRdto: Array.from(rows).map(row => {
            const checkInDate = row.cells[5].querySelector("input").value;
            const checkOutDate = row.cells[6].querySelector("input").value;

            if (!checkInDate || !checkOutDate) {
                throw new Error("Check-in and check-out dates are required for all rooms.");
            }

            return {
                RoomId: row.cells[0].querySelector("input").value,
                CheckInDate: new Date(checkInDate).toISOString(),
                CheckOutDate: new Date(checkOutDate).toISOString(),
            };
        }),
    };

    console.log("Pre-booking request:", requestBody);

    try {
        const response = await fetch("http://localhost:5222/api/Booking/BookInAdvance", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) throw new Error(`Server error: ${response.status}`);
        const data = await response.json();

        alert("Room pre-booked successfully!");
        console.log("Pre-booking response:", data);
        document.getElementById("room-table-body").innerHTML = ""; // Clear table after pre-booking
        document.getElementById("deposit").value = ""; // Clear deposit input
    } catch (error) {
        console.error("Pre-booking error:", error);
        alert(`Failed to pre-book room: ${error.message}`);
    }
});