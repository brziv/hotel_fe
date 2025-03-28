// Load Google Charts
google.charts.load('current', {
    'packages': ['corechart', 'line', 'bar']
});
google.charts.setOnLoadCallback(initializeCharts);

// Global variables
let startDate = document.getElementById('startDate');
let endDate = document.getElementById('endDate');
let generateReportBtn = document.getElementById('generateReport');

// Initialize date inputs with default values
const today = new Date();
const thirtyDaysAgo = new Date(today);
thirtyDaysAgo.setDate(today.getDate() - 30);

startDate.value = thirtyDaysAgo.toISOString().split('T')[0];
endDate.value = today.toISOString().split('T')[0];

// Event listeners
generateReportBtn.addEventListener('click', generateReports);
document.querySelectorAll('.nav-link').forEach(tab => {
    tab.addEventListener('click', (e) => {
        const targetId = e.target.getAttribute('data-bs-target').substring(1);
        refreshChart(targetId);
    });
});

// Initialize charts
function initializeCharts() {
    generateReports();
}

// Main report generation function
async function generateReports() {
    const start = new Date(startDate.value);
    const end = new Date(endDate.value);

    try {
        // Fetch all required data
        const [bookingData, roomData, serviceData, costData] = await Promise.all([
            fetchBookingData(start, end),
            fetchRoomData(start, end),
            fetchServiceData(start, end),
            fetchCostData(start, end)
        ]);

        // Generate all charts
        generateBookingTrendChart(bookingData);
        generateRevenueTrendChart(bookingData);
        generateRoomOccupancyChart(roomData);
        generatePopularRoomChart(roomData);
        generateServiceRevenueChart(serviceData);
        generateProfitChart(bookingData, serviceData, costData);

        // Update summary data
        updateProfitSummary(bookingData, serviceData, costData);
    } catch (error) {
        console.error('Error generating reports:', error);
        alert('Error generating reports. Please try again.');
    }
}

const API_BASE_URL = "http://localhost:5222/api";

// Data fetching functions
async function fetchBookingData(start, end) {
    const response = await fetch(`${API_BASE_URL}/Report/GetBookingData?start=${start.toISOString()}&end=${end.toISOString()}`);
    if (!response.ok) throw new Error('Failed to fetch booking data');
    return await response.json();
}

async function fetchRoomData(start, end) {
    const response = await fetch(`${API_BASE_URL}/Report/GetRoomData?start=${start.toISOString()}&end=${end.toISOString()}`);
    if (!response.ok) throw new Error('Failed to fetch room data');
    return await response.json();
}

async function fetchServiceData(start, end) {
    const response = await fetch(`${API_BASE_URL}/Report/GetServiceData?start=${start.toISOString()}&end=${end.toISOString()}`);
    if (!response.ok) throw new Error('Failed to fetch service data');
    return await response.json();
}

async function fetchCostData(start, end) {
    const response = await fetch(`${API_BASE_URL}/Report/GetCostData?start=${start.toISOString()}&end=${end.toISOString()}`);
    if (!response.ok) throw new Error('Failed to fetch cost data');
    return await response.json();
}

// Chart generation functions
function generateBookingTrendChart(data) {
    const chartData = new google.visualization.DataTable();
    chartData.addColumn('date', 'Date');
    chartData.addColumn('number', 'Number of Bookings');

    // Process data
    const bookingsByDate = new Map();
    data.bookings.forEach(booking => {
        const date = new Date(booking.checkInTime);
        const dateStr = date.toDateString();
        bookingsByDate.set(dateStr, (bookingsByDate.get(dateStr) || 0) + 1);
    });

    // Convert to chart data
    const rows = Array.from(bookingsByDate.entries()).map(([dateStr, count]) => {
        return [new Date(dateStr), count];
    });
    chartData.addRows(rows);

    const options = {
        title: 'Booking Trend',
        curveType: 'function',
        legend: { position: 'bottom' },
        hAxis: { title: 'Date' },
        vAxis: { title: 'Number of Bookings' }
    };

    const chart = new google.visualization.LineChart(document.getElementById('bookingTrendChart'));
    chart.draw(chartData, options);
}

function generateRevenueTrendChart(data) {
    const chartData = new google.visualization.DataTable();
    chartData.addColumn('date', 'Date');
    chartData.addColumn('number', 'Revenue (USD)');

    // Process data
    const revenueByDate = new Map();
    data.bookings.forEach(booking => {
        if (booking.status === 'Paid') {
            const date = new Date(booking.checkInTime);
            const dateStr = date.toDateString();
            revenueByDate.set(dateStr, (revenueByDate.get(dateStr) || 0) + booking.totalMoney);
        }
    });

    // Convert to chart data
    const rows = Array.from(revenueByDate.entries()).map(([dateStr, revenue]) => {
        return [new Date(dateStr), revenue];
    });
    chartData.addRows(rows);

    const options = {
        title: 'Revenue Trend',
        curveType: 'function',
        legend: { position: 'bottom' },
        hAxis: { title: 'Date' },
        vAxis: { 
            title: 'Revenue (USD)',
            format: 'short'
        }
    };

    const chart = new google.visualization.LineChart(document.getElementById('revenueTrendChart'));
    chart.draw(chartData, options);
}

function generateRoomOccupancyChart(data) {
    const chartData = new google.visualization.DataTable();
    chartData.addColumn('string', 'Status');
    chartData.addColumn('number', 'Rooms');

    const totalRooms = data.totalRooms;
    const occupiedRooms = data.occupiedRooms;
    const availableRooms = totalRooms - occupiedRooms;

    chartData.addRows([
        ['Occupied', occupiedRooms],
        ['Available', availableRooms]
    ]);

    const options = {
        title: 'Room Occupancy',
        pieHole: 0.4,
        colors: ['#007bff', '#28a745']
    };

    const chart = new google.visualization.PieChart(document.getElementById('roomOccupancyChart'));
    chart.draw(chartData, options);
}

function generatePopularRoomChart(data) {
    const chartData = new google.visualization.DataTable();
    chartData.addColumn('string', 'Room Type');
    chartData.addColumn('number', 'Revenue');

    // Process data
    const rows = data.roomTypes.map(type => [type.name, type.revenue]);
    chartData.addRows(rows);

    const options = {
        title: 'Revenue by Room Type',
        legend: { position: 'none' },
        hAxis: { title: 'Revenue (USD)' },
        vAxis: { title: 'Room Type' }
    };

    const chart = new google.visualization.BarChart(document.getElementById('popularRoomChart'));
    chart.draw(chartData, options);
}

function generateServiceRevenueChart(data) {
    const chartData = new google.visualization.DataTable();
    chartData.addColumn('string', 'Service');
    chartData.addColumn('number', 'Revenue');

    // Process data
    const rows = data.services.map(service => [service.name, service.revenue]);
    chartData.addRows(rows);

    const options = {
        title: 'Service Revenue Distribution',
        pieHole: 0.4
    };

    const chart = new google.visualization.PieChart(document.getElementById('serviceRevenueChart'));
    chart.draw(chartData, options);

    // Update service revenue table
    const tableBody = document.getElementById('serviceRevenueTable');
    tableBody.innerHTML = data.services
        .sort((a, b) => b.revenue - a.revenue)
        .map(service => `
            <tr>
                <td>${service.name}</td>
                <td>${service.revenue.toLocaleString()} USD</td>
                <td>${service.count}</td>
            </tr>
        `).join('');
}

function generateProfitChart(bookingData, serviceData, costData) {
    const chartData = new google.visualization.DataTable();
    chartData.addColumn('string', 'Category');
    chartData.addColumn('number', 'Amount (USD)');

    const totalRevenue = calculateTotalRevenue(bookingData, serviceData);
    const totalCosts = calculateTotalCosts(costData);

    chartData.addRows([
        ['Revenue', totalRevenue],
        ['Costs', totalCosts]
    ]);

    const options = {
        title: 'Revenue vs Costs',
        legend: { position: 'none' },
        colors: ['#28a745', '#dc3545']
    };

    const chart = new google.visualization.ColumnChart(document.getElementById('profitChart'));
    chart.draw(chartData, options);
}

// Helper functions
function calculateTotalRevenue(bookingData, serviceData) {
    const roomRevenue = bookingData.bookings
        .filter(booking => booking.status === 'Paid')
        .reduce((sum, booking) => sum + booking.totalMoney, 0);

    const serviceRevenue = serviceData.services
        .reduce((sum, service) => sum + service.revenue, 0);

    return roomRevenue + serviceRevenue;
}

function calculateTotalCosts(costData) {
    return costData.costs.reduce((sum, cost) => sum + cost.amount, 0);
}

function updateProfitSummary(bookingData, serviceData, costData) {
    const totalRevenue = calculateTotalRevenue(bookingData, serviceData);
    const totalCosts = calculateTotalCosts(costData);
    const netProfit = totalRevenue - totalCosts;

    document.getElementById('totalRevenue').textContent = `${totalRevenue.toLocaleString()} USD`;
    document.getElementById('totalCosts').textContent = `${totalCosts.toLocaleString()} USD`;
    document.getElementById('netProfit').textContent = `${netProfit.toLocaleString()} USD`;
}

// Chart refresh function
function refreshChart(tabId) {
    switch (tabId) {
        case 'overview':
            generateBookingTrendChart(window.lastBookingData);
            generateRevenueTrendChart(window.lastBookingData);
            break;
        case 'room-revenue':
            generateRoomOccupancyChart(window.lastRoomData);
            generatePopularRoomChart(window.lastRoomData);
            break;
        case 'service-revenue':
            generateServiceRevenueChart(window.lastServiceData);
            break;
        case 'profit':
            generateProfitChart(window.lastBookingData, window.lastServiceData, window.lastCostData);
            break;
    }
}