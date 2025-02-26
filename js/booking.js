document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const nameInput = document.getElementById("name");
    const phoneInput = document.getElementById("phone");
    const checkinInput = document.getElementById("checkin");
    const checkoutInput = document.getElementById("checkout");

    form.addEventListener("submit", function (event) {
        let valid = true;

        const phonePattern = /^\d{10,11}$/;
        if (!phonePattern.test(phoneInput.value)) {
            alert("Số điện thoại không hợp lệ. Vui lòng nhập 10-11 chữ số.");
            valid = false;
        }
        
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

        if (!valid) {
            event.preventDefault();
        }
    });
});
