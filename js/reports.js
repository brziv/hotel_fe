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

    const [totalData, statusData, timelineData] = await Promise.all([
        fetchData('BookingTotal'),
        fetchData('BookingStatus'),
        fetchData('RoomTimeline')
    ]);

    // Total Rooms Booked (Column Chart)
    const totalChart = new google.visualization.ColumnChart(document.getElementById('totalBookingsChart'));
    const totalChartData = new google.visualization.DataTable();
    totalChartData.addColumn('string', 'Room Number');
    totalChartData.addColumn('number', 'Bookings');
    // totalData.forEach(d => totalChartData.addRow([d.roomNumber, d.totalBookings]));
    // totalChart.draw(totalChartData, { title: 'Total Rooms Booked', height: 400 });
    const aggregatedTotal = {};
    totalData.forEach(d => {
        if (aggregatedTotal[d.roomNumber]) {
            aggregatedTotal[d.roomNumber] += d.totalBookings;
        } else {
            aggregatedTotal[d.roomNumber] = d.totalBookings;
        }
    });
    Object.entries(aggregatedTotal).forEach(([roomNumber, bookings]) => {
        totalChartData.addRow([roomNumber, bookings]);
    });
    totalChart.draw(totalChartData, {
        title: 'Total Rooms Booked',
        height: 400,
        titleTextStyle: { fontSize: 16 },
        hAxis: { textStyle: { fontSize: 14 } },
        vAxis: { textStyle: { fontSize: 14 } }
    });

    // Booking Status (Pie Chart)
    const statusChart = new google.visualization.PieChart(document.getElementById('bookingStatusChart'));
    const statusChartData = new google.visualization.DataTable();
    statusChartData.addColumn('string', 'Status');
    statusChartData.addColumn('number', 'Rooms');
    // statusData.forEach(d => statusChartData.addRow([d.bookingStatus, d.roomCount]));
    // statusChart.draw(statusChartData, { title: 'Booking Status', height: 400 });
    const aggregatedStatus = {};
    statusData.forEach(d => {
        if (aggregatedStatus[d.bookingStatus]) {
            aggregatedStatus[d.bookingStatus] += d.roomCount;
        } else {
            aggregatedStatus[d.bookingStatus] = d.roomCount;
        }
    });
    Object.entries(aggregatedStatus).forEach(([bookingStatus, roomCount]) => {
        statusChartData.addRow([bookingStatus, roomCount]);
    });
    statusChart.draw(statusChartData, {
        title: 'Booking Status',
        height: 400,
        titleTextStyle: { fontSize: 16 },
        legend: { textStyle: { fontSize: 14 } }
    });

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
// 2. Revenue Charts
async function drawRevenueCharts() {
    const activeTab = document.querySelector('#revenue-tab').classList.contains('active');
    if (!activeTab) return;

    // Get the current interval for labeling
    const interval = document.getElementById('interval').value;

    try {
        // Fetch all revenue data
        const [totalData, bookingData, serviceData] = await Promise.all([
            fetchData('Revenue/Total'),
            fetchData('Revenue/Bookings'),
            fetchData('Revenue/Services')
        ]);

        console.log('Revenue data:', { totalData, bookingData, serviceData });

        // Create combined dataset of all periods
        const allPeriods = new Set([
            ...totalData.map(d => d.period),
            ...bookingData.map(d => d.period),
            ...serviceData.map(d => d.period)
        ]);
        const periodArray = Array.from(allPeriods).sort((a, b) => a - b);

        // Create the data table
        const revenueChart = new google.visualization.ComboChart(document.getElementById('revenueChart'));
        const revenueChartData = new google.visualization.DataTable();

        // First column is string for better labels according to interval type
        revenueChartData.addColumn('string', 'Period');
        revenueChartData.addColumn('number', 'Total Revenue');
        revenueChartData.addColumn('number', 'Booking Revenue');
        revenueChartData.addColumn('number', 'Service Revenue');

        // Add data rows for each period
        periodArray.forEach(period => {
            const totalItem = totalData.find(d => d.period === period);
            const bookingItem = bookingData.find(d => d.period === period);
            const serviceItem = serviceData.find(d => d.period === period);

            // Format period label based on interval
            let periodLabel = String(period);
            if (interval === 'monthly') {
                // Convert month number to name (1-12)
                const monthNames = [
                    'January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'
                ];
                periodLabel = monthNames[period - 1] || `Month ${period}`;
            } else if (interval === 'weekly') {
                periodLabel = `Week ${period}`;
            } else {
                periodLabel = `Day ${period}`;
            }

            revenueChartData.addRow([
                periodLabel,
                totalItem ? totalItem.amount : 0,
                bookingItem ? bookingItem.amount : 0,
                serviceItem ? serviceItem.amount : 0
            ]);
        });

        // Format options
        const chartOptions = {
            title: 'Revenue Over Time',
            height: 400,
            titleTextStyle: { fontSize: 16, bold: true },
            hAxis: {
                title: getIntervalLabel(),
                titleTextStyle: { fontSize: 14, bold: true },
                textStyle: { fontSize: 12 }
            },
            vAxis: {
                title: 'Revenue (USD)',
                titleTextStyle: { fontSize: 14, bold: true },
                textStyle: { fontSize: 12 },
                format: 'currency'
            },
            seriesType: 'bars',
            series: {
                0: { type: 'line', color: '#4285F4', lineWidth: 4 }, // Total as line
                1: { color: '#34A853' }, // Booking as bar
                2: { color: '#FBBC05' }  // Service as bar
            },
            legend: {
                position: 'top',
                alignment: 'center',
                textStyle: { fontSize: 12 }
            },
            animation: {
                startup: true,
                duration: 1000,
                easing: 'out'
            },
            tooltip: { showColorCode: true }
        };

        // Draw chart
        revenueChart.draw(revenueChartData, chartOptions);
    } catch (error) {
        console.error('Error drawing revenue charts:', error);
        document.getElementById('revenueChart').innerHTML = `
            <div class="alert alert-danger">
                Error loading revenue data. Please try again later.
            </div>
        `;
    }
}

// Helper function to get interval label
function getIntervalLabel() {
    const interval = document.getElementById('interval').value;
    switch (interval) {
        case 'daily':
            return 'Day';
        case 'weekly':
            return 'Week';
        case 'monthly':
            return 'Month';
        default:
            return 'Period';
    }
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
    importChart.draw(importChartData, {
        title: 'Cost of Imported Goods',
        height: 400,
        titleTextStyle: { fontSize: 16 },
        hAxis: { textStyle: { fontSize: 14 } },
        vAxis: { textStyle: { fontSize: 14 } }
    });

    // Service Cost (Line Chart)
    const serviceChart = new google.visualization.LineChart(document.getElementById('serviceCostChart'));
    const serviceChartData = new google.visualization.DataTable();
    serviceChartData.addColumn('number', 'Period');
    serviceChartData.addColumn('number', 'Cost');
    serviceData.forEach(d => serviceChartData.addRow([d.period, d.amount]));
    serviceChart.draw(serviceChartData, {
        title: 'Cost of Services',
        height: 400,
        titleTextStyle: { fontSize: 16 },
        hAxis: { textStyle: { fontSize: 14 } },
        vAxis: { textStyle: { fontSize: 14 } }
    });

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
    // roomTypesData.forEach(d => roomTypesChartData.addRow([d.roomType, d.bookingCount]));
    // roomTypesChart.draw(roomTypesChartData, { title: 'Popular Room Types', height: 400 });
    const aggregatedRoomTypes = {};
    roomTypesData.forEach(d => {
        if (aggregatedRoomTypes[d.roomType]) {
            aggregatedRoomTypes[d.roomType] += d.bookingCount;
        } else {
            aggregatedRoomTypes[d.roomType] = d.bookingCount;
        }
    });
    Object.entries(aggregatedRoomTypes).forEach(([roomType, bookingCount]) => {
        roomTypesChartData.addRow([roomType, bookingCount]);
    });
    roomTypesChart.draw(roomTypesChartData, {
        title: 'Popular Room Types',
        height: 400,
        titleTextStyle: { fontSize: 16 },
        hAxis: { textStyle: { fontSize: 14 } },
        vAxis: { textStyle: { fontSize: 14 } }
    });

    // Popular Services (Column Chart)
    const servicesChart = new google.visualization.ColumnChart(document.getElementById('servicesChart'));
    const servicesChartData = new google.visualization.DataTable();
    servicesChartData.addColumn('string', 'Service');
    servicesChartData.addColumn('number', 'Usage');
    // servicesData.forEach(d => servicesChartData.addRow([d.packageName, d.usageCount]));
    // servicesChart.draw(servicesChartData, { title: 'Popular Services', height: 400 });
    const aggregatedServices = {};
    servicesData.forEach(d => {
        if (aggregatedServices[d.packageName]) {
            aggregatedServices[d.packageName] += d.usageCount;
        } else {
            aggregatedServices[d.packageName] = d.usageCount;
        }
    });
    Object.entries(aggregatedServices).forEach(([packageName, usageCount]) => {
        servicesChartData.addRow([packageName, usageCount]);
    });
    servicesChart.draw(servicesChartData, {
        title: 'Popular Service Packages',
        height: 400,
        titleTextStyle: { fontSize: 16 },
        hAxis: { textStyle: { fontSize: 14 } },
        vAxis: { textStyle: { fontSize: 14 } }
    });
}