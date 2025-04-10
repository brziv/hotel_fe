let cusid = localStorage.getItem("userId");
let availableroomfound = [];
let SelectedRooms = [];

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

document.getElementById("bt_search").addEventListener("click", function () {
    const checkinDate = document.getElementById("checkin").value;
    const checkoutDate = document.getElementById("checkout").value;
    const floor = document.getElementById("floor").value.trim();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (new Date(checkinDate) < today) {
        alert("Check-in date cannot be in the past.");
        return;
    }

    if (!checkinDate || !checkoutDate) {
        alert("Please select both check-in and check-out dates.");
        return;
    }

    if (new Date(checkinDate) >= new Date(checkoutDate)) {
        alert("Check-out date must be after check-in date.");
        return;
    }

    if (floor === "") {
        alert("Please select a floor.");
        return;
    }

    const formattedCheckin = encodeURIComponent(`${checkinDate}:00.000`);
    const formattedCheckout = encodeURIComponent(`${checkoutDate}:00.000`);
    const apiUrl = `https://hotel-bed.onrender.com/api/Booking/FindAvailableRooms?indate=${formattedCheckin}&outdate=${formattedCheckout}&floor=${encodeURIComponent(floor)}`;

    fetch(apiUrl, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    })
        .then(response => {
            if (!response.ok) throw new Error("Failed to fetch available rooms");
            return response.json();
        })
        .then(data => {
            const searchRoomBody = document.getElementById("search-room-body");
            searchRoomBody.innerHTML = "";
            availableroomfound = data || [];

            if (availableroomfound.length === 0) {
                alert("No rooms available for the selected time and floor.");
                return;
            }

            availableroomfound.forEach((room, index) => {
                const row = document.createElement("tr");
                row.setAttribute("data-room-id", room.roomId);
                row.innerHTML = `
                    <td class="align-middle">${room.roomNumber}</td>
                    <td class="align-middle">${room.floor}</td>
                    <td class="align-middle">${room.roomType}</td>
                    <td class="align-middle">${room.pricePerHour}</td>
                    <td class="align-middle">
                        <div class="form-check d-flex justify-content-center">
                            <input type="checkbox" class="form-check-input room-select" data-index="${index}">
                        </div>
                    </td>
                `;
                searchRoomBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error("Error finding rooms:", error);
            alert("An error occurred while searching for rooms.");
        });
});

document.getElementById("choose-room").addEventListener("click", function () {
    const checkinDate = document.getElementById("checkin").value;
    const checkoutDate = document.getElementById("checkout").value;

    document.querySelectorAll(".room-select:checked").forEach(checkbox => {
        const index = checkbox.getAttribute("data-index");
        const room = availableroomfound[index];

        const selectedRoom = {
            roomId: room.roomId,
            roomNumber: room.roomNumber,
            floor: room.floor,
            roomType: room.roomType,
            pricePerHour: room.pricePerHour,
            checkInDate: checkinDate,
            checkOutDate: checkoutDate
        };

        const isAlreadySelected = SelectedRooms.some(r => r.roomId === room.roomId);
        if (!isAlreadySelected) {
            SelectedRooms.push(selectedRoom);
        } else {
            alert(`Room ${room.roomNumber} is already selected.`);
            return;
        }

        const tableBody = document.getElementById("room-table-body");
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><input type="text" class="form-control form-control-sm" style="border: none; box-shadow: none;" value="${room.roomNumber}" readonly></td>
            <td><input type="text" class="form-control form-control-sm" style="border: none; box-shadow: none;" value="${room.floor}" readonly></td>
            <td><input type="text" class="form-control form-control-sm" style="border: none; box-shadow: none;" value="${room.roomType}" readonly></td>
            <td><input type="text" class="form-control form-control-sm" style="border: none; box-shadow: none;" value="${room.pricePerHour}" readonly></td>
            <td><input type="datetime-local" class="form-control" style="border: none; box-shadow: none;" value="${checkinDate}" readonly></td>
            <td><input type="datetime-local" class="form-control" style="border: none; box-shadow: none;" value="${checkoutDate}" readonly></td>
            <td>
                <button class="btn btn-danger btn-sm delete-room">
                    <i class="bi bi-trash"></i> Delete
                </button>
            </td>
        `;
        tableBody.appendChild(row);

        row.querySelector(".delete-room").addEventListener("click", () => {
            row.remove();
            SelectedRooms = SelectedRooms.filter(r => r.roomId !== room.roomId);
            calculateTotalMoney();
        });

        calculateTotalMoney();
    });

    availableroomfound = [];
    document.getElementById("search-room-body").innerHTML = "";
    document.getElementById("checkin").value = "";
    document.getElementById("checkout").value = "";
    document.getElementById("floor").value = "";
    document.getElementById("find-room-modal").style.display = "none";
});

// Pre-Book
document.getElementById("pre-book").addEventListener("click", function () {
    if (!cusid) {
        alert("No customer ID found. Please add a customer first.");
        return;
    }

    if (SelectedRooms.length === 0) {
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
        BRdto: SelectedRooms.map(room => ({
            RoomId: room.roomId,
            CheckInDate: room.checkInDate,
            CheckOutDate: room.checkOutDate,
            // CheckInDate: new Date(room.checkInDate).toISOString(),
            // CheckOutDate: new Date(room.checkOutDate).toISOString(),
        })),
    };

    fetch("https://hotel-bed.onrender.com/api/Booking/BookInAdvance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
    })
        .then(response => {
            if (!response.ok) throw new Error(`Server error: ${response.status}`);
            return response.json();
        })
        .then(data => {
            alert("Room pre-booked successfully!");
            console.log("Pre-booking response:", data);
            SelectedRooms = [];
            document.getElementById("room-table-body").innerHTML = "";
            document.getElementById("deposit").value = "";
            document.getElementById("total-money").value = "0.00";
        })
        .catch(error => {
            console.error("Pre-booking error:", error);
            alert(`Failed to pre-book room: ${error.message}`);
        });
});

function calculateTotalMoney() {
    let totalMoney = 0;
    const rows = document.querySelectorAll("#room-table-body tr");

    rows.forEach(row => {
        const pricePerHour = parseFloat(row.cells[3].querySelector("input").value) || 0;
        const checkInValue = row.cells[4].querySelector("input").value;
        const checkOutValue = row.cells[5].querySelector("input").value;

        if (checkInValue && checkOutValue) {
            const checkIn = new Date(checkInValue);
            const checkOut = new Date(checkOutValue);
            const durationHours = (checkOut - checkIn) / (1000 * 60 * 60);
            totalMoney += pricePerHour * durationHours;
        }
    });

    const totalMoneyElement = document.getElementById("total-money");
    totalMoneyElement.value = totalMoney.toFixed(2);
    
    // Calculate deposit as 20% of total money
    const depositElement = document.getElementById("deposit");
    const deposit = totalMoney * 0.2;
    depositElement.value = deposit.toFixed(2);
}
