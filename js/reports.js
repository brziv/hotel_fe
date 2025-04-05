google.charts.load('current', { packages: ['corechart', 'timeline'] });
google.charts.setOnLoadCallback(fetchAndDrawCharts);

const baseUrl = 'http://localhost:5222/api/Report';

function getFilterParams() {
    return {
        interval: document.getElementById('interval').value,
        startDate: document.getElementById('startDate').value,
        endDate: document.getElementById('endDate').value
    };
}

async function fetchData(endpoint) {
    const params = new URLSearchParams(getFilterParams()).toString();
    const response = await fetch(`${baseUrl}/${endpoint}?${params}`);
    return await response.json();
}

function fetchAndDrawCharts() {
    drawBookingCharts();
    drawRevenueCharts();
    drawInventoryCharts();
    drawTrendsCharts();

    // Redraw on filter change
    document.getElementById('interval').addEventListener('change', fetchAndDrawCharts);
    document.getElementById('startDate').addEventListener('change', fetchAndDrawCharts);
    document.getElementById('endDate').addEventListener('change', fetchAndDrawCharts);

    // Redraw on tab switch
    document.querySelectorAll('.nav-link').forEach(tab => {
        tab.addEventListener('shown.bs.tab', fetchAndDrawCharts);
    });
}

// 1. Booking Charts
async function drawBookingCharts() {
    const activeTab = document.querySelector('#booking-tab').classList.contains('active');
    if (!activeTab) return;

    const [totalData, statusData, occupancyData, timelineData] = await Promise.all([
        fetchData('BookingTotal'),
        fetchData('BookingStatus'),
        fetchData('Occupancy'),
        fetchData('RoomTimeline')
    ]);

    // Total Rooms Booked (Column Chart)
    const totalChart = new google.visualization.ColumnChart(document.getElementById('totalBookingsChart'));
    const totalChartData = new google.visualization.DataTable();
    totalChartData.addColumn('string', 'Room Number');
    totalChartData.addColumn('number', 'Bookings');
    totalData.forEach(d => totalChartData.addRow([d.roomNumber, d.totalBookings]));
    totalChart.draw(totalChartData, { title: 'Total Rooms Booked', height: 400 });

    // Booking Status (Pie Chart)
    const statusChart = new google.visualization.PieChart(document.getElementById('bookingStatusChart'));
    const statusChartData = new google.visualization.DataTable();
    statusChartData.addColumn('string', 'Status');
    statusChartData.addColumn('number', 'Rooms');
    statusData.forEach(d => statusChartData.addRow([d.bookingStatus, d.roomCount]));
    statusChart.draw(statusChartData, { title: 'Booking Status', height: 400 });

    // Occupancy Rate (Line Chart)
    const occupancyChart = new google.visualization.LineChart(document.getElementById('occupancyRateChart'));
    const occupancyChartData = new google.visualization.DataTable();
    occupancyChartData.addColumn('number', 'Period');
    const floors = [...new Set(occupancyData.map(d => d.floor))];
    floors.forEach(floor => occupancyChartData.addColumn('number', `Floor ${floor}`));
    const periods = [...new Set(occupancyData.map(d => d.period))];
    periods.forEach(period => {
        const row = [period];
        floors.forEach(floor => {
            const entry = occupancyData.find(d => d.floor === floor && d.period === period);
            row.push(entry ? entry.occupancyRate : 0);
        });
        occupancyChartData.addRow(row);
    });
    occupancyChart.draw(occupancyChartData, { title: 'Occupancy Rate', height: 400 });

    // Room Timeline (Timeline Chart)
    const timelineChart = new google.visualization.Timeline(document.getElementById('roomTimelineChart'));
    const timelineChartData = new google.visualization.DataTable();
    timelineChartData.addColumn({ type: 'string', id: 'Room' });
    timelineChartData.addColumn({ type: 'date', id: 'Start' });
    timelineChartData.addColumn({ type: 'date', id: 'End' });
    timelineData.forEach(d => {
        timelineChartData.addRow([
            d.roomNumber,
            new Date(d.checkInDate),
            new Date(d.checkOutDate)
        ]);
    });
    timelineChart.draw(timelineChartData, { height: 400 });
}

// 2. Revenue Charts
async function drawRevenueCharts() {
    const activeTab = document.querySelector('#revenue-tab').classList.contains('active');
    if (!activeTab) return;

    const [totalData, bookingData, serviceData] = await Promise.all([
        fetchData('Revenue/Total'),
        fetchData('Revenue/Bookings'),
        fetchData('Revenue/Services')
    ]);

    const revenueChart = new google.visualization.LineChart(document.getElementById('revenueChart'));
    const revenueChartData = new google.visualization.DataTable();
    revenueChartData.addColumn('number', 'Period');
    revenueChartData.addColumn('number', 'Total Revenue');
    revenueChartData.addColumn('number', 'Booking Revenue');
    revenueChartData.addColumn('number', 'Service Revenue');
    const periods = [...new Set(totalData.map(d => d.period))];
    periods.forEach(period => {
        const total = totalData.find(d => d.period === period)?.amount || 0;
        const booking = bookingData.find(d => d.period === period)?.amount || 0;
        const service = serviceData.find(d => d.period === period)?.amount || 0;
        revenueChartData.addRow([period, total, booking, service]);
    });
    revenueChart.draw(revenueChartData, { title: 'Revenue Over Time', height: 400 });
}

// 3. Inventory Charts
async function drawInventoryCharts() {
    const activeTab = document.querySelector('#inventory-tab').classList.contains('active');
    if (!activeTab) return;

    const [importData, serviceData, stockData] = await Promise.all([
        fetchData('Inventory/Imports'),
        fetchData('Inventory/Services'),
        fetchData('Inventory/Stock')
    ]);

    // Import Cost (Line Chart)
    const importChart = new google.visualization.LineChart(document.getElementById('importCostChart'));
    const importChartData = new google.visualization.DataTable();
    importChartData.addColumn('number', 'Period');
    importChartData.addColumn('number', 'Cost');
    importData.forEach(d => importChartData.addRow([d.period, d.amount]));
    importChart.draw(importChartData, { title: 'Cost of Imported Goods', height: 400 });

    // Service Cost (Line Chart)
    const serviceChart = new google.visualization.LineChart(document.getElementById('serviceCostChart'));
    const serviceChartData = new google.visualization.DataTable();
    serviceChartData.addColumn('number', 'Period');
    serviceChartData.addColumn('number', 'Cost');
    serviceData.forEach(d => serviceChartData.addRow([d.period, d.amount]));
    serviceChart.draw(serviceChartData, { title: 'Cost of Services', height: 400 });

    // Stock Levels (Column Chart)
    const stockChart = new google.visualization.ColumnChart(document.getElementById('stockLevelsChart'));
    const stockChartData = new google.visualization.DataTable();
    stockChartData.addColumn('string', 'Product');
    stockChartData.addColumn('number', 'Stock');
    stockData.forEach(d => stockChartData.addRow([d.productName, d.stockLevel]));
    stockChart.draw(stockChartData, { title: 'Stock Levels', height: 400 });
}

// 4. Trends Charts
async function drawTrendsCharts() {
    const activeTab = document.querySelector('#trends-tab').classList.contains('active');
    if (!activeTab) return;

    const [roomTypesData, servicesData] = await Promise.all([
        fetchData('Trends/RoomTypes'),
        fetchData('Trends/Services')
    ]);

    // Popular Room Types (Column Chart)
    const roomTypesChart = new google.visualization.ColumnChart(document.getElementById('roomTypesChart'));
    const roomTypesChartData = new google.visualization.DataTable();
    roomTypesChartData.addColumn('string', 'Room Type');
    roomTypesChartData.addColumn('number', 'Bookings');
    roomTypesData.forEach(d => roomTypesChartData.addRow([d.roomType, d.bookingCount]));
    roomTypesChart.draw(roomTypesChartData, { title: 'Popular Room Types', height: 400 });

    // Popular Services (Column Chart)
    const servicesChart = new google.visualization.ColumnChart(document.getElementById('servicesChart'));
    const servicesChartData = new google.visualization.DataTable();
    servicesChartData.addColumn('string', 'Service');
    servicesChartData.addColumn('number', 'Usage');
    servicesData.forEach(d => servicesChartData.addRow([d.packageName, d.usageCount]));
    servicesChart.draw(servicesChartData, { title: 'Popular Services', height: 400 });
}