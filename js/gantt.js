let upcomingBookings = [];
let currentBookings = [];
let pastBookings = [];
let allBookings = [];
let chart;
let dataTable;

async function fetchBookings() {
    let floor = document.getElementById("floorSelect").value;
    let inDate = document.getElementById("startDate").value;
    let outDate = document.getElementById("endDate").value;

    if (!inDate || !outDate) {
        let today = new Date();
        let sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 7);

        const formatDateTimeLocal = date => date.toISOString().slice(0, 16);

        inDate = formatDateTimeLocal(sevenDaysAgo);
        outDate = formatDateTimeLocal(today);

        document.getElementById("startDate").value = inDate;
        document.getElementById("endDate").value = outDate;
    }

    let formattedInDate = encodeURIComponent(inDate.replace("T", " ") + ":00.000");
    let formattedOutDate = encodeURIComponent(outDate.replace("T", " ") + ":00.000");

    let apiUrl = `http://localhost:5222/api/Booking/FindBookings?indate=${formattedInDate}&outdate=${formattedOutDate}&floornum=${floor}`;

    try {
        let response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Lỗi khi tải dữ liệu!");

        let data = await response.json();
        allBookings = [];
        upcomingBookings = [];
        currentBookings = [];
        pastBookings = [];
        allBookings = data.bookings;
        processBookings(data.bookings);
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
    }
}

function processBookings(bookings) {
    if (!bookings || !Array.isArray(bookings)) {
        console.error("Bookings data is invalid:", bookings);
        return;
    }

    bookings.forEach(booking => {
        let checkinDate = new Date(booking.checkInDate);
        let checkoutDate = new Date(booking.checkOutDate);

        if (booking.bookingStatus === "Pending") {
            upcomingBookings.push([
                booking.bookingId,
                booking.firstName,
                booking.lastName,
                booking.roomnum,
                booking.bookingStatus,
                booking.totalMoney,
                booking.deposit,
                checkinDate,
                checkoutDate
            ]);
        } else if (booking.bookingStatus === "Confirmed") {
            currentBookings.push([
                booking.bookingId,
                booking.firstName,
                booking.lastName,
                booking.roomnum,
                booking.bookingStatus,
                booking.totalMoney,
                booking.deposit,
                checkinDate,
                checkoutDate
            ]);
        } else if (booking.bookingStatus === "Paid") {
            pastBookings.push([
                booking.bookingId,
                booking.firstName,
                booking.lastName,
                booking.roomnum,
                booking.bookingStatus,
                booking.totalMoney,
                booking.deposit,
                checkinDate,
                checkoutDate
            ]);
        }
    });

    console.log("Upcoming:", upcomingBookings);
    console.log("Current:", currentBookings);
    console.log("Past:", pastBookings);

    drawChart();
}

function changeTimePeriod() {
    fetchBookings();
}

function changeFloor() {
    fetchBookings();
}

function drawChart() {
    var container = document.getElementById("timeline");
    if (!container) {
        console.error("Timeline container not found");
        return;
    }

    chart = new google.visualization.Timeline(container);
    dataTable = new google.visualization.DataTable();

    dataTable.addColumn({ type: "string", id: "RoomNumber" });
    dataTable.addColumn({ type: "string", id: "dummy GuestName" });
    dataTable.addColumn({ type: "string", role: "tooltip", p: { html: true } }); 
    dataTable.addColumn({ type: 'string', id: 'style', role: 'style' });
    dataTable.addColumn({ type: "datetime", id: "Start" });
    dataTable.addColumn({ type: "datetime", id: "End" });
    

    if (!allBookings || allBookings.length === 0) {
        container.innerHTML = "<p>No booking data available.</p>";
        return;
    }
    let sortedAllBooking = [...upcomingBookings, ...currentBookings, ...pastBookings];
    console.log("sortedAllBooking",sortedAllBooking);
    //corlor
    let upcomingColor = "#FFA500"; // Orange (Pending)
    let currentColor = "#0000FF";  // Blue (Confirmed)
    let pastColor = "#008000";     // Green (Paid)

    let formattedData = sortedAllBooking.map(booking => {
        try {
            let tooltipContent = `
                <div style="padding:10px;">
                    <strong>Guest:</strong> ${booking[1]} ${booking[2]} <br>
                    <strong>Room:</strong> ${booking[3]} <br>
                    <strong>Status:</strong> ${booking[4]} <br>
                    <strong>Total:</strong> $${booking[5]} <br>
                    <strong>Deposit:</strong> $${booking[6]} <br>
                    <strong>Check-in:</strong> ${new Date(booking[7]).toLocaleString()} <br>
                    <strong>Check-out:</strong> ${new Date(booking[8]).toLocaleString()}
                </div>
            `;

            // Xác định màu dựa trên trạng thái đặt phòng
            let bookingColor;
            if (booking[4] === "Pending") {
                bookingColor = upcomingColor;
            } else if (booking[4] === "Confirmed") {
                bookingColor = currentColor;
            } else if (booking[4] === "Paid") {
                bookingColor = pastColor;
            } else {
                bookingColor = "#808080"; // Mặc định màu xám nếu trạng thái không xác định
            }

            return [
                String(booking[3]),  // Room number
                "", 
                tooltipContent,
                bookingColor,  // Màu sắc
                new Date(booking[7]), // Check-in
                new Date(booking[8])  // Check-out
            ];
        } catch (e) {
            console.error("Error formatting booking:", booking, e);
            return null;
        }
    }).filter(row => row !== null);

    
    if (formattedData.length === 0) {
        container.innerHTML = "<p>No valid booking data to display.</p>";
        return;
    }
    // Thêm tất cả các phòng trống vào danh sách
    const floor = document.getElementById("floorSelect").value;
    const roomsPerFloor = 10; // Giả sử mỗi tầng có 10 phòng
    const roomsOnSelectedFloor = [];
    
    // Tạo danh sách phòng theo tầng đã chọn (vd: 101, 102, 103... cho tầng 1)
    for (let i = 1; i <= roomsPerFloor; i++) {
        const roomNumber = `${floor}${i.toString().padStart(2, '0')}`;
        roomsOnSelectedFloor.push(roomNumber);
    }
    
    // Lấy danh sách các phòng đã có booking
    const bookedRooms = formattedData.map(row => row[0]);
    
    // Tìm các phòng chưa có booking
    const emptyRooms = roomsOnSelectedFloor.filter(room => !bookedRooms.includes(room));
    
    // Thêm các phòng trống vào dataTable
    const startDate = new Date(document.getElementById("startDate").value);
    const endDate = new Date(document.getElementById("endDate").value);
    
    emptyRooms.forEach(roomNum => {
        formattedData.push([
            roomNum,
            "",
            `<div style="padding:10px;"><strong>Room:</strong> ${roomNum} <br><strong>Status:</strong> Available</div>`,
            "#DDDDDD", // Màu xám cho phòng trống
            startDate,
            startDate // Đặt cùng ngày để tạo điểm (không phải khoảng thời gian)
        ]);
    });
    
    dataTable.addRows(formattedData);
    console.log('datatable',dataTable);
    var options = {
        alternatingRowStyle: false,
        hAxis: {
            format: "EEE, dd/MM",
        },
        height: 500
    };

    // Change cursor when hovering booked rooms
    google.visualization.events.addListener(chart, "onmouseover", function () {
        container.style.cursor = "pointer";
    });

    google.visualization.events.addListener(chart, "onmouseout", function () {
        container.style.cursor = "default";
    });

    // Open modal when select a booked room
    google.visualization.events.addListener(chart, 'select', function () {
        var selection = chart.getSelection();
        if (selection.length > 0) {
            var row = selection[0].row;
        // Get booking status from dataTable or use booking array
            var name = null;
            var roomnumber = null;
            var status = null;
            var totalMoney = null;
            var deposit = null;
            var timein = null;
            var timeout = null;
            
            // Find the corresponding booking in our arrays
            const roomNumber = dataTable.getValue(row, 0); // Assuming room number is in column 0
            const checkinDate = dataTable.getValue(row, 4);
            
            // Search in all booking arrays to find matching booking
            for (let booking of [...upcomingBookings, ...currentBookings, ...pastBookings]) {
                if (booking[3] === roomNumber && booking[7].getTime() === checkinDate.getTime()) { // booking[3] contains the room number
                    
                    selectedBooking = booking;
                    name = booking[1]+' '+booking[2];
                    roomnumber = booking[3];
                    status = booking[4]; 
                    totalMoney = booking[5];
                    deposit = booking[6];
                    timein = booking[7].toLocaleString();
                    timeout = booking[8].toLocaleString();
                    break;
                }
            }
            showModal(name, roomnumber, status, totalMoney, deposit, timein, timeout);
        }
    });
    
    chart.draw(dataTable, options);
}

function changeBookingType() {
    var selectedFloor = parseInt(document.getElementById("floorSelect").value);
    drawChart(selectedFloor, selectedType);
}

function showModal(name, roomnumber, status, totalMoney, deposit, timein, timeout) {
    var selection = chart.getSelection();
    if (selection.length > 0) {
        var row = selection[0].row;
        // Get booking status from dataTable or use booking array
        var bookingStatus = "";
        
        // Find the corresponding booking in our arrays
        const roomNumber = dataTable.getValue(row, 0); // Assuming room number is in column 0
        const checkinDate = dataTable.getValue(row, 4);
        
        // Search in all booking arrays to find matching booking
        let selectedBooking = null;
        for (let booking of [...upcomingBookings, ...currentBookings, ...pastBookings]) {
            if (booking[3] === roomNumber && booking[7].getTime() === checkinDate.getTime()) { // booking[3] contains the room number
                
                selectedBooking = booking;
                bookingStatus = booking[4]; // booking[4] contains the status
                break;
            }
        }

    }
    const bookServiceBtn = document.getElementById('book-service-btn');
    const checkoutBtn = document.getElementById('checkout-btn');
    const checkinBtn = document.getElementById('checkin-btn');
    
    bookServiceBtn.style.display = 'none';
    checkoutBtn.style.display = 'none';
    checkinBtn.style.display = 'none';
    
    // Show buttons based on status
    if (bookingStatus === "Confirmed") {
        // If confirmed, show check out and book service
        checkoutBtn.style.display = 'inline-block';
        bookServiceBtn.style.display = 'inline-block';
    } else if (bookingStatus === "Pending") {
        // If pending, only show check in
        checkinBtn.style.display = 'inline-block';
    } else if (bookingStatus === "Paid") {
        // If paid, don't show any buttons except close
        // No additional buttons needed
    }

    document.getElementById('cust-name').textContent = name;
    document.getElementById('cust-room-num').textContent = roomnumber;
    document.getElementById('cust-status').textContent = status;
    document.getElementById('cust-total-money').textContent = totalMoney;
    document.getElementById('cust-deposit').textContent = deposit;
    document.getElementById('cust-time-in').textContent = timein;
    document.getElementById('cust-time-out').textContent = timeout;

    document.getElementById('modal').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';

    document.body.classList.add("modal-open");
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';

    document.body.classList.remove("modal-open");
}