document.addEventListener("DOMContentLoaded", function() {
    const bookedRoomsElement = document.getElementById("booked-rooms");
    const availableRoomsElement = document.getElementById("available-rooms");
    const totalRevenueElement = document.getElementById("total-revenue");
    const totalCustomersElement = document.getElementById("total-customers");

    // Assuming allData is available globally or imported from gantt.js
    const allData = {
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
        ]
    };

    function calculateReports(data) {
        let bookedRooms = 0;
        let totalRevenue = 0;
        let totalCustomers = 0;
        const totalRooms = 20; // Assuming there are 20 rooms in total

        for (let floor in data) {
            bookedRooms += data[floor].length;
            totalCustomers += data[floor].length;
            data[floor].forEach(booking => {
                const start = booking[2];
                const end = booking[3];
                const duration = (end - start) / (1000 * 60 * 60); // Duration in hours
                totalRevenue += duration * 200000; // Assuming 200,000 VND per hour
            });
        }

        const availableRooms = totalRooms - bookedRooms;

        return { bookedRooms, availableRooms, totalRevenue, totalCustomers };
    }

    const reports = calculateReports(allData);

    bookedRoomsElement.textContent = reports.bookedRooms;
    availableRoomsElement.textContent = reports.availableRooms;
    totalRevenueElement.textContent = reports.totalRevenue.toLocaleString() + " VND";
    totalCustomersElement.textContent = reports.totalCustomers;
});