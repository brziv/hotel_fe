google.charts.load("current", { packages: ["timeline"] });
google.charts.setOnLoadCallback(drawChart);

var allData = {
    1: [
        ["Phòng 101", "Nguyễn Văn A", new Date(2024, 1, 14, 10, 0, 0), new Date(2024, 1, 14, 18, 0, 0)],
        ["Phòng 101", "Trần Thị B", new Date(2024, 1, 14, 19, 0, 0), new Date(2024, 1, 15, 5, 0, 0)],
        ["Phòng 102", "Lê Văn C", new Date(2024, 1, 14, 10, 0, 0), new Date(2024, 1, 14, 20, 0, 0)],
        ["Phòng 102", "Phạm Thị D", new Date(2024, 1, 15, 8, 0, 0), new Date(2024, 1, 15, 16, 0, 0)],
        ["Phòng 103", "Hoàng Văn E", new Date(2024, 1, 14, 12, 0, 0), new Date(2024, 1, 14, 22, 0, 0)],
        ["Phòng 104", "Bùi Thị F", new Date(2024, 1, 15, 14, 0, 0), new Date(2024, 1, 15, 23, 0, 0)],
        ["Phòng 105", "Đỗ Văn G", new Date(2024, 1, 14, 9, 0, 0), new Date(2024, 1, 14, 17, 0, 0)],
        ["Phòng 106", "Nguyễn Văn H", new Date(2024, 1, 16, 7, 0, 0), new Date(2024, 1, 16, 15, 0, 0)],
        ["Phòng 107", "Lê Thị I", new Date(2024, 1, 15, 10, 0, 0), new Date(2024, 1, 15, 18, 0, 0)],
        ["Phòng 108", "Phạm Văn J", new Date(2024, 1, 14, 11, 0, 0), new Date(2024, 1, 14, 19, 0, 0)],
        ["Phòng 109", "Trần Văn K", new Date(2024, 1, 15, 13, 0, 0), new Date(2024, 1, 15, 21, 0, 0)]
    ],
    2: [
        ["Phòng 201", "Nguyễn Văn L", new Date(2024, 1, 14, 9, 30, 0), new Date(2024, 1, 14, 17, 30, 0)],
        ["Phòng 201", "Trần Thị M", new Date(2024, 1, 14, 18, 30, 0), new Date(2024, 1, 15, 4, 30, 0)],
        ["Phòng 202", "Lê Văn N", new Date(2024, 1, 14, 11, 0, 0), new Date(2024, 1, 14, 21, 0, 0)],
        ["Phòng 203", "Hoàng Văn O", new Date(2024, 1, 15, 7, 0, 0), new Date(2024, 1, 15, 15, 0, 0)],
        ["Phòng 204", "Bùi Thị P", new Date(2024, 1, 15, 13, 30, 0), new Date(2024, 1, 15, 22, 30, 0)],
        ["Phòng 205", "Đỗ Văn Q", new Date(2024, 1, 14, 8, 0, 0), new Date(2024, 1, 14, 16, 0, 0)],
    ],
};

function drawChart(floor = 1) {
    var container = document.getElementById("timeline");
    var chart = new google.visualization.Timeline(container);
    var dataTable = new google.visualization.DataTable();

    dataTable.addColumn({ type: "string", id: "Phòng" });
    dataTable.addColumn({ type: "string", id: "Khách hàng" });
    dataTable.addColumn({ type: "datetime", id: "Bắt đầu" });
    dataTable.addColumn({ type: "datetime", id: "Kết thúc" });

    dataTable.addRows(allData[floor]);

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

function bookService() {
    alert("Chức năng đặt dịch vụ đang phát triển!");
}

function checkout() {
    alert("Chức năng trả phòng đang phát triển!");
}

function changeFloor() {
    var selectedFloor = document.getElementById("floorSelect").value;
    drawChart(parseInt(selectedFloor));
}