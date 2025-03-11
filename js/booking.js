/////////////them khach
let cusid = "";

document.getElementById("add-customer").addEventListener("click", function () {
    document.getElementById("customer-modal").style.display = "flex";
});

document.getElementById("cancel-customer").addEventListener("click", function () {
    document.getElementById("customer-modal").style.display = "none";
});

document.getElementById("confirm-customer").addEventListener("click", function () {
    let firstName = document.getElementById("first-name").value.trim();
    let lastName = document.getElementById("last-name").value.trim();
    let email = document.getElementById("customer-email").value.trim();
    let phoneNumber = document.getElementById("customer-phone").value.trim();

    if (!firstName || !lastName || !email || !phoneNumber) {
        alert("Vui lòng nhập đầy đủ thông tin khách hàng.");
        return;
    }

    fetch("http://localhost:5222/api/Booking/AddGuest?fistname=" + firstName + "&lastname=" + lastName + "&email=" + email + "&phonenum=" + phoneNumber, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
    })
        .then(response => response.json())
        .then(data => {
            alert("Add customer successfully!");
            // Gán dữ liệu trả về vào các input
            document.getElementById("cid").value = data.data; // ID khách hàng mới
            document.getElementById("name").value =
                document.getElementById("first-name").value + " " +
                document.getElementById("last-name").value;
            document.getElementById("phonenum").value = document.getElementById("customer-phone").value;
            cusid = data.data;
            document.getElementById("customer-modal").style.display = "none";
        })
        .catch(error => {
            console.error("Lỗi:", error);
            alert("Có lỗi xảy ra khi thêm khách hàng.");
        });
});
//////////////////////////// tim phong
let availableroomfound = [];

// Hiển thị modal tìm phòng
document.getElementById("bt_findroom").addEventListener("click", function () {
    document.getElementById("find-room-modal").style.display = "flex";
});

// Khi bấm "Cancel" ẩn modal và làm rỗng dữ liệu
document.getElementById("cancel-findroom").addEventListener("click", function () {
    availableroomfound = []; // Làm rỗng danh sách phòng trống
    document.getElementById("search-room-body").innerHTML = ""; // Xóa danh sách phòng hiển thị
    document.getElementById("checkin").value = "";
    document.getElementById("checkout").value = "";
    document.getElementById("floor").value = "";
    document.getElementById("find-room-modal").style.display = "none";
});

// Xử lý tìm phòng available
document.getElementById("bt_search").addEventListener("click", function () {
    let checkinDate = document.getElementById("checkin").value;
    let checkoutDate = document.getElementById("checkout").value;
    let floor = document.getElementById("floor").value;

    if (!checkinDate || !checkoutDate) {
        alert("Vui lòng chọn ngày nhận và ngày trả.");
        return;
    }

    // Chuyển đổi định dạng ngày tháng
    let formattedCheckin = encodeURIComponent(checkinDate + ":00.000");
    let formattedCheckout = encodeURIComponent(checkoutDate + ":00.000");

    let apiUrl = `http://localhost:5222/api/Booking/FindAvailableRooms?indate=${formattedCheckin}&outdate=${formattedCheckout}&floor=${floor}`;

    fetch(apiUrl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Lỗi khi lấy dữ liệu từ server");
            }
            return response.json();
        })
        .then(data => {
            let searchRoomBody = document.getElementById("search-room-body");
            searchRoomBody.innerHTML = ""; // Xóa dữ liệu cũ trước khi thêm dữ liệu mới
            availableroomfound = data.$values || []; // Đảm bảo nếu data.$values undefined thì gán []

            if (availableroomfound.length === 0) {
                alert("Không có phòng nào trống trong khoảng thời gian đã chọn.");
                return;
            }

            availableroomfound.forEach((room, index) => {
                let row = document.createElement("tr");
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
        })
        .catch(error => {
            console.error("Lỗi khi tìm phòng:", error);
            alert("Có lỗi xảy ra khi tìm phòng.");
        });
});

// Xử lý chọn phòng
document.getElementById("choose-room").addEventListener("click", function () {
    let newlySelectedRooms = [];
    let checkinDate = document.getElementById("checkin").value;
    let checkoutDate = document.getElementById("checkout").value;

    document.querySelectorAll(".room-select:checked").forEach(checkbox => {
        let index = checkbox.getAttribute("data-index");
        let room = availableroomfound[index];

        // Kiểm tra xem roomId có tồn tại trong bảng room-table-body không
        let isAlreadySelected = Array.from(document.querySelectorAll("#room-table-body tr")).some(row => {
            return row.cells[0].querySelector("input").value === room.roomId;
        });

        if (!isAlreadySelected) {
            newlySelectedRooms.push(room);
        } else {
            alert("Room " + room.roomNumber + " is already selected");
        }
    });

    // Cập nhật danh sách phòng đã chọn vào bảng chính
    let tableBody = document.getElementById("room-table-body");

    newlySelectedRooms.forEach(room => {
        let row = document.createElement("tr");
        row.innerHTML = `
            <td><input type="text" class="small-input" value="${room.roomId}" readonly></td>
            <td><input type="text" class="small-input" value="${room.roomNumber}" readonly></td>
            <td><input type="text" class="small-input" value="${room.floor}" readonly></td>
            <td><input type="text" class="small-input" value="${room.roomType}" readonly></td>
            <td><input type="text" class="small-input" value="${room.pricePerHour}" readonly></td>
            <td><input type="datetime-local" id="checkin-${room.roomId}" class="large-input" value="${checkinDate}"></td>
            <td><input type="datetime-local" id="checkout-${room.roomId}" class="large-input" value="${checkoutDate}"></td>
            <td><button class="delete-room">Xóa</button></td>
        `;
        tableBody.appendChild(row);

        // Xóa phòng khi ấn nút "Xóa"
        row.querySelector(".delete-room").addEventListener("click", function () {
            row.remove();
        });
    });

    // Dọn dẹp dữ liệu sau khi chọn xong
    availableroomfound = [];
    document.getElementById("search-room-body").innerHTML = "";
    document.getElementById("checkin").value = "";
    document.getElementById("checkout").value = "";
    document.getElementById("floor").value = "";

    // Ẩn modal sau khi chọn xong
    document.getElementById("find-room-modal").style.display = "none";
});

//////Ấn nút booking
document.getElementById("book-room").addEventListener("click", function () {
    if (!cusid) {
        alert("Không tìm thấy ID khách hàng. Vui lòng kiểm tra lại.");
        return;
    }

    let requestBody = {
        GuestId: cusid,  // Thay guestId thành GuestId
        BRdto: Array.from(document.querySelectorAll("#room-table-body tr")).map(row => ({
            RoomId: row.cells[0].querySelector("input").value,  // Thay roomId thành RoomId
            CheckInDate: new Date(row.cells[5].querySelector("input").value).toISOString(),  // Thay checkInDate thành CheckInDate
            CheckOutDate: new Date(row.cells[6].querySelector("input").value).toISOString()  // Thay checkOutDate thành CheckOutDate
        }))
    };

    console.log("Dữ liệu gửi đi:", requestBody);

    fetch("http://localhost:5222/api/Booking/BookImmediately", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            alert("Đặt phòng thành công!");
            console.log("Phản hồi từ server:", data);
        })
        .catch(error => {
            console.error("Lỗi khi đặt phòng:", error);
            alert(`Có lỗi xảy ra khi đặt phòng: ${error.message}`);
        });
});
//////Ấn nút Pre-book
document.getElementById("pre-book").addEventListener("click", function () {
    if (!cusid) {
        alert("Không tìm thấy ID khách hàng. Vui lòng kiểm tra lại.");
        return;
    }

    let requestBody = {
        GuestId: cusid,
        Deposit: parseFloat(document.getElementById("deposit").value) || 0, // Lấy tiền đặt cọc từ input
        BRdto: Array.from(document.querySelectorAll("#room-table-body tr")).map(row => ({
            RoomId: row.cells[0].querySelector("input").value,
            CheckInDate: new Date(row.cells[5].querySelector("input").value).toISOString(),
            CheckOutDate: new Date(row.cells[6].querySelector("input").value).toISOString()
        }))
    };

    console.log("Dữ liệu gửi đi:", requestBody);

    fetch("http://localhost:5222/api/Booking/BookInAdvance", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            alert("Pre-order succesfully");
            console.log("Phản hồi từ server:", data);
        })
        .catch(error => {
            console.error("Lỗi khi đặt phòng:", error);
            alert(`Có lỗi xảy ra khi đặt phòng: ${error.message}`);
        });
});