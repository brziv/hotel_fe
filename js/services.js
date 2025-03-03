function loadValidFloors() {
    let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    let floorSelect = document.getElementById("floorSelect");
    floorSelect.innerHTML = "<option value=''>Chọn tầng</option>";

    let uniqueFloors = new Set();
    bookings.forEach(booking => {
        let floor = booking.room.toString().slice(0, 1);
        uniqueFloors.add(floor);
    });

    uniqueFloors.forEach(floor => {
        let option = document.createElement("option");
        option.value = floor;
        option.textContent = `Tầng ${floor}`;
        floorSelect.appendChild(option);
    });
}

document.getElementById("floorSelect").addEventListener("change", function () {
    let selectedFloor = this.value;
    let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    let roomSelect = document.getElementById("roomSelect");
    roomSelect.innerHTML = "<option value=''>Chọn phòng</option>";

    bookings.forEach(booking => {
        let floor = booking.room.toString().slice(0, 1);
        if (floor === selectedFloor) {
            let option = document.createElement("option");
            option.value = booking.room;
            option.textContent = `Phòng ${booking.room}`;
            roomSelect.appendChild(option);
        }
    });
});

document.getElementById("roomSelect").addEventListener("change", function () {
    let selectedRoom = this.value;
    let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    let phoneInput = document.getElementById("phoneInput");

    let booking = bookings.find(b => b.room == selectedRoom);
    if (booking) {
        phoneInput.value = booking.phone;
    } else {
        phoneInput.value = "Không hợp lệ";
        alert("Số điện thoại không hợp lệ! Vui lòng chọn lại.");
    }
});

document.getElementById("addServiceBtn").addEventListener("click", function () {
    let selectedRoom = document.getElementById("roomSelect").value;
    let phone = document.getElementById("phoneInput").value;
    let date = document.getElementById("dateInput").value;
    let service = document.getElementById("serviceSelect").value;

    if (!selectedRoom || phone === "Không hợp lệ" || !date) {
        alert("Vui lòng chọn thông tin hợp lệ!");
        return;
    }

    let serviceData = JSON.parse(localStorage.getItem("services")) || [];
    serviceData.push({ room: selectedRoom, phone, date, service });
    localStorage.setItem("services", JSON.stringify(serviceData));

    alert("Dịch vụ đã được thêm thành công!");
});

// Load dữ liệu tầng khi trang mở
loadValidFloors();