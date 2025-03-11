document.addEventListener("DOMContentLoaded", function () {
    const serviceTable = document.querySelector("#serviceTable");
    const form = document.querySelector("#serviceForm");
    const floorSelect = document.querySelector("#floorSelect");
    const roomSelect = document.querySelector("#roomSelect");
    const phoneInput = document.querySelector("#phoneInput");
    const dateInput = document.querySelector("#dateInput");
    const serviceSelect = document.querySelector("#serviceSelect");
    const addServiceBtn = document.querySelector("#addServiceBtn");

    let services = JSON.parse(localStorage.getItem("services")) || [];

    function renderServices() {
        serviceTable.innerHTML = "";
        services.forEach((service, index) => {
            let row = `
                <tr>
                    <td>${service.floor}</td>
                    <td>${service.room}</td>
                    <td>${service.phone}</td>
                    <td>${service.date}</td>
                    <td>${service.service}</td>
                    <td>
                        <button onclick="deleteService(${index})">Xóa</button>
                    </td>
                </tr>
            `;
            serviceTable.innerHTML += row;
        });
    }

    function loadValidFloors() {
        let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
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

    floorSelect.addEventListener("change", function () {
        let selectedFloor = this.value;
        let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
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

    roomSelect.addEventListener("change", function () {
        let selectedRoom = this.value;
        let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
        let booking = bookings.find(b => b.room == selectedRoom);
        if (booking) {
            phoneInput.value = booking.phone;
        } else {
            phoneInput.value = "Không hợp lệ";
            alert("Số điện thoại không hợp lệ! Vui lòng chọn lại.");
        }
    });

    addServiceBtn.addEventListener("click", function () {
        let selectedRoom = roomSelect.value;
        let phone = phoneInput.value;
        let date = dateInput.value;
        let service = serviceSelect.value;

        if (!selectedRoom || phone === "Không hợp lệ" || !date) {
            alert("Vui lòng chọn thông tin hợp lệ!");
            return;
        }

        services.push({ floor: floorSelect.value, room: selectedRoom, phone, date, service });
        localStorage.setItem("services", JSON.stringify(services));
        renderServices();
        form.reset();
    });

    window.deleteService = function (index) {
        if (confirm("Bạn có chắc chắn muốn xóa dịch vụ này không?")) {
            services.splice(index, 1);
            localStorage.setItem("services", JSON.stringify(services));
            renderServices();
        }
    };

    renderServices();
    loadValidFloors();
});