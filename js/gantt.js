google.charts.load("current", { packages: ["timeline"] });
google.charts.setOnLoadCallback(drawChart);

var allData = {
    1: [
        ["Phòng 101", "Nguyễn Văn A", new Date(2025, 2, 3, 10, 0, 0), new Date(2025, 2, 3, 18, 0, 0)],
        ["Phòng 101", "Trần Thị B", new Date(2025, 2, 3, 19, 0, 0), new Date(2025, 2, 4, 5, 0, 0)],
        ["Phòng 102", "Lê Văn C", new Date(2025, 2, 3, 10, 0, 0), new Date(2025, 2, 3, 20, 0, 0)],
        ["Phòng 102", "Phạm Thị D", new Date(2025, 2, 4, 8, 0, 0), new Date(2025, 2, 4, 16, 0, 0)],
        ["Phòng 103", "Hoàng Văn E", new Date(2025, 2, 3, 12, 0, 0), new Date(2025, 2, 3, 22, 0, 0)],
        ["Phòng 104", "Bùi Thị F", new Date(2025, 2, 4, 14, 0, 0), new Date(2025, 2, 4, 23, 0, 0)],
        ["Phòng 105", "Đỗ Văn G", new Date(2025, 2, 3, 9, 0, 0), new Date(2025, 2, 3, 17, 0, 0)],
        ["Phòng 106", "Nguyễn Văn H", new Date(2025, 2, 5, 7, 0, 0), new Date(2025, 2, 5, 15, 0, 0)],
        ["Phòng 107", "Lê Thị I", new Date(2025, 2, 4, 10, 0, 0), new Date(2025, 2, 4, 18, 0, 0)],
        ["Phòng 108", "Phạm Văn J", new Date(2025, 2, 3, 11, 0, 0), new Date(2025, 2, 3, 19, 0, 0)],
        ["Phòng 109", "Trần Văn K", new Date(2025, 2, 4, 13, 0, 0), new Date(2025, 2, 4, 21, 0, 0)]
    ],
    2: [
        ["Phòng 201", "Nguyễn Văn L", new Date(2025, 2, 3, 9, 30, 0), new Date(2025, 2, 3, 17, 30, 0)],
        ["Phòng 201", "Trần Thị M", new Date(2025, 2, 3, 18, 30, 0), new Date(2025, 2, 4, 4, 30, 0)],
        ["Phòng 202", "Lê Văn N", new Date(2025, 2, 3, 11, 0, 0), new Date(2025, 2, 3, 21, 0, 0)],
        ["Phòng 203", "Hoàng Văn O", new Date(2025, 2, 4, 7, 0, 0), new Date(2025, 2, 4, 15, 0, 0)],
        ["Phòng 204", "Bùi Thị P", new Date(2025, 2, 4, 13, 30, 0), new Date(2025, 2, 4, 22, 30, 0)],
        ["Phòng 205", "Đỗ Văn Q", new Date(2025, 2, 3, 8, 0, 0), new Date(2025, 2, 3, 16, 0, 0)]
    ] ,
    3: [
        ["Phòng 301", "Nguyễn Văn R", new Date(2025, 2, 3, 9, 0, 0), new Date(2025, 2, 3, 17, 0, 0)],
        ["Phòng 301", "Trần Thị S", new Date(2025, 2, 3, 18, 0, 0), new Date(2025, 2, 4, 4, 0, 0)],
        ["Phòng 302", "Lê Văn T", new Date(2025, 2, 3, 11, 0, 0), new Date(2025, 2, 3, 21, 0, 0)],
        ["Phòng 303", "Hoàng Văn U", new Date(2025, 2, 4, 7, 0, 0), new Date(2025, 2, 4, 15, 0, 0)],
        ["Phòng 304", "Bùi Thị V", new Date(2025, 2, 4, 13, 0, 0), new Date(2025, 2, 4, 22, 0, 0)],
        ["Phòng 305", "Đỗ Văn W", new Date(2025, 2, 3, 8, 0, 0), new Date(2025, 2, 3, 16, 0, 0)]
    ]
    
};

function drawChart(floor = 1) {
    var container = document.getElementById("timeline");
    var chart = new google.visualization.Timeline(container);
    var dataTable = new google.visualization.DataTable();

    dataTable.addColumn({ type: "string", id: "Phòng" });
    dataTable.addColumn({ type: "string", id: "Khách hàng" });
    dataTable.addColumn({ type: "datetime", id: "Bắt đầu" });
    dataTable.addColumn({ type: "datetime", id: "Kết thúc" });

    var filteredData = filterDataByTimePeriod(allData[floor]);
    if (filteredData.length === 0) {
        document.getElementById("timeline").innerHTML = "<p>Không có dữ liệu để hiển thị.</p>";
        return;
    }

    dataTable.addRows(filteredData);

    var options = {
        timeline: { showRowLabels: true },
        hAxis: {
            format: "HH:mm dd/MM",
            gridlines: { count: 12 }
        }
    };

    chart.draw(dataTable, options);

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
            var bill = duration * 200000;
            showModal(name, "0123456789", duration, bill);
        }
    });
}

function filterDataByTimePeriod(data) {
    var startDate = new Date(document.getElementById("startDate").value);
    var endDate = new Date(document.getElementById("endDate").value);

    if (isNaN(startDate) || isNaN(endDate)) {
        return data; // If no dates are selected, return the original data
    }

    return data.filter(function (booking) {
        var bookingStart = booking[2];
        var bookingEnd = booking[3];
        return (bookingStart >= startDate && bookingEnd <= endDate);
    });
}

function showModal(name, phone, time, bill) {
    document.getElementById('cust-name').textContent = name;
    document.getElementById('cust-phone').textContent = phone;
    document.getElementById('cust-time').textContent = time;
    document.getElementById('cust-bill').textContent = bill;

    // Lấy dữ liệu dịch vụ từ LocalStorage
    let bookingServices = JSON.parse(localStorage.getItem("bookingServices")) || {};
    let booking = bookingServices[phone];

    if (booking) {
        if (booking.services.includes("Dịch vụ ăn uống")) {
            document.getElementById('service-food').checked = true;
        }
        if (booking.services.includes("Giặt ủi")) {
            document.getElementById('service-laundry').checked = true;
        }
        if (booking.services.includes("Spa")) {
            document.getElementById('service-spa').checked = true;
        }
        document.getElementById('cust-bill').textContent = booking.totalCost;
    } else {
        // Bỏ chọn nếu không có dữ liệu dịch vụ
        document.getElementById('service-food').checked = false;
        document.getElementById('service-laundry').checked = false;
        document.getElementById('service-spa').checked = false;
    }

    document.getElementById('modal').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';

    document.body.classList.add("modal-open");
}




function closeModal() {
    document.getElementById('modal').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';

    document.body.classList.remove("modal-open");
}
function bookService() {
    let services = [];
    let totalCost = parseInt(document.getElementById('cust-bill').textContent);
    let name = document.getElementById('cust-name').textContent;
    let phone = document.getElementById('cust-phone').textContent;

    if (document.getElementById('service-food').checked) {
        services.push("Dịch vụ ăn uống");
        totalCost += 100000;
    }
    if (document.getElementById('service-laundry').checked) {
        services.push("Giặt ủi");
        totalCost += 50000;
    }
    if (document.getElementById('service-spa').checked) {
        services.push("Spa");
        totalCost += 200000;
    }

    if (services.length === 0) {
        alert("Bạn chưa chọn dịch vụ nào!");
        return;
    }

    // Lưu dữ liệu vào LocalStorage
    let bookingServices = JSON.parse(localStorage.getItem("bookingServices")) || {};
    bookingServices[phone] = { services, totalCost };
    localStorage.setItem("bookingServices", JSON.stringify(bookingServices));

    alert(
        "Bạn đã đặt các dịch vụ: " + services.join(", ") +
        "\nTổng tiền mới: " + totalCost.toLocaleString() + " VND"
    );

    // Cập nhật tổng hóa đơn trong modal
    document.getElementById('cust-bill').textContent = totalCost;
}



function checkout() {
    alert("Chức năng trả phòng đang phát triển!");
}

function changeFloor() {
    var selectedFloor = document.getElementById("floorSelect").value;
    drawChart(parseInt(selectedFloor));
}

function changeTimePeriod() {
    drawChart(parseInt(document.getElementById("floorSelect").value));
}

function loadBookings() {
    var bookings = JSON.parse(localStorage.getItem("bookings")) || [];

    // Duyệt qua từng đặt phòng và thêm vào dữ liệu của tầng
    bookings.forEach(booking => {
        let room = `Phòng ${booking.room}`;
        let name = booking.name;
        let checkin = new Date(booking.checkin);
        let checkout = new Date(booking.checkout);

        let floor = Math.floor(parseInt(booking.room) / 100); // Xác định tầng từ số phòng
        if (!allData[floor]) {
            allData[floor] = [];
        }

        allData[floor].push([room, name, checkin, checkout]);
    });

    // Vẽ lại biểu đồ Gantt với dữ liệu mới
    drawChart(parseInt(document.getElementById("floorSelect").value));
}

document.addEventListener("DOMContentLoaded", loadBookings);
