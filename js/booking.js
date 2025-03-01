document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("booking-form");
    const nameInput = document.getElementById("name");
    const phoneInput = document.getElementById("phone");
    const roomInput = document.getElementById("room-number");
    const checkinInput = document.getElementById("checkin");
    const checkoutInput = document.getElementById("checkout");

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Ngăn chặn reload trang
        let valid = true;

        // Kiểm tra số điện thoại (10-11 chữ số)
        const phonePattern = /^\d{10,11}$/;
        if (!phonePattern.test(phoneInput.value)) {
            alert("Số điện thoại không hợp lệ. Vui lòng nhập 10-11 chữ số.");
            valid = false;
        }

        // Kiểm tra ngày nhận và trả phòng
        const checkinDate = new Date(checkinInput.value);
        const checkoutDate = new Date(checkoutInput.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (checkinDate < today) {
            alert("Ngày nhận phòng phải từ hôm nay trở đi.");
            valid = false;
        }
        if (checkoutDate <= checkinDate) {
            alert("Ngày trả phòng phải sau ngày nhận phòng.");
            valid = false;
        }

        if (!valid) return;

        // Lấy danh sách đặt phòng từ localStorage
        var bookings = JSON.parse(localStorage.getItem("bookings")) || [];

        // Lưu dữ liệu mới vào danh sách
        bookings.push({
            room: roomInput.value,
            name: nameInput.value,
            phone: phoneInput.value,
            checkin: checkinInput.value,
            checkout: checkoutInput.value
        });

        // Cập nhật localStorage
        localStorage.setItem("bookings", JSON.stringify(bookings));

        alert("Đặt phòng thành công!");
        parent.document.getElementsByName("contentFrame")[0].src = "gantt.html"; // Chuyển về trang chính trong iframe
    });
});
