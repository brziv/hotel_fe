function loadValidFloors() {
    let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    let floorSelect = document.getElementById("floorSelect");
    floorSelect.innerHTML = "<option value=''>Chọn tầng</option>"; // Reset danh sách

    let uniqueFloors = new Set();
    bookings.forEach(booking => {
        let floor = booking.room.toString().slice(0, 1); // Lấy số tầng (VD: 101 → tầng 1)
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
