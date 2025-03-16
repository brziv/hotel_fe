let upcomingBookings = [];
let currentBookings = [];
let pastBookings = [];
let allBookings = [];

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

    let apiUrl = `https://hotel-bed.onrender.com/api/Booking/FindBookings?indate=${formattedInDate}&outdate=${formattedOutDate}&floornum=${floor}`;

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

    var chart = new google.visualization.Timeline(container);
    var dataTable = new google.visualization.DataTable();

    dataTable.addColumn({ type: "string", id: "RoomNumber" });
    dataTable.addColumn({ type: "string", id: "GuestName" });
    dataTable.addColumn({ type: "datetime", id: "Start" });
    dataTable.addColumn({ type: "datetime", id: "End" });

    if (!allBookings || allBookings.length === 0) {
        container.innerHTML = "<p>No booking data available.</p>";
        return;
    }

    let formattedData = allBookings.map(booking => {
        try {
            return [
                String(booking.roomnum),
                `${booking.firstName} ${booking.lastName}`,
                new Date(booking.checkInDate),
                new Date(booking.checkOutDate)
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

    dataTable.addRows(formattedData);

    var options = {
        timeline: {
            showRowLabels: true,
            colorByRowLabel: true
        },
        hAxis: {
            format: "EEE, dd/MM HH:mm",
            gridlines: { count: 12 }
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
            var name = dataTable.getValue(row, 1);
            var start = dataTable.getValue(row, 2);
            var end = dataTable.getValue(row, 3);
            var duration = (end - start) / (1000 * 60 * 60);
            var bill = "insert a number";
            showModal(name, "123456789", duration, bill);
        }
    });

    chart.draw(dataTable, options);
}

function changeBookingType() {
    var selectedFloor = parseInt(document.getElementById("floorSelect").value);
    drawChart(selectedFloor, selectedType);
}

function showModal(name, phone, time, bill) {
    document.getElementById('cust-name').textContent = name;
    document.getElementById('cust-phone').textContent = phone;
    document.getElementById('cust-time').textContent = time;
    document.getElementById('cust-bill').textContent = bill;

    document.getElementById('modal').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';

    document.body.classList.add("modal-open");
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';

    document.body.classList.remove("modal-open");
}