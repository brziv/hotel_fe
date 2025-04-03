let upcomingBookings = [];
let currentBookings = [];
let pastBookings = [];
let allBookings = [];
let chart;
let dataTable;
let bookingid;
let guestName;
let deposit;
let initialtotalMoney;
let servicesList = [];

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
                booking.totalMoney||0,
                booking.deposit||0,
                checkinDate,
                checkoutDate,
                booking.priceperhour
            ]);
        } else if (booking.bookingStatus === "Confirmed") {
            currentBookings.push([
                booking.bookingId,
                booking.firstName,
                booking.lastName,
                booking.roomnum,
                booking.bookingStatus,
                booking.totalMoney||0,
                booking.deposit||0,
                checkinDate,
                checkoutDate,
                booking.priceperhour
            ]);
        } else if (booking.bookingStatus === "Paid" || booking.bookingStatus === "Cancel") {
            pastBookings.push([
                booking.bookingId,
                booking.firstName,
                booking.lastName,
                booking.roomnum,
                booking.bookingStatus,
                booking.totalMoney,
                booking.deposit||0,
                checkinDate,
                checkoutDate,
                booking.priceperhour
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

    // Colors
    let upcomingColor = "#FFA500"; // Orange (Pending)
    let currentColor = "#00FF7F";  // Green (Confirmed)
    let pastColor = "#CCCCCC";     // Gray (Paid)

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

            // Set color based on booking status
            let bookingColor;
            if (booking[4] === "Pending") {
                bookingColor = upcomingColor;
            } else if (booking[4] === "Confirmed") {
                bookingColor = currentColor;
            } else if (booking[4] === "Paid") {
                bookingColor = pastColor;
            } else {
                bookingColor = "#CCCCCC"; // Default to gray
            }

            return [
                String(booking[3]),  // Room number
                "", 
                tooltipContent,
                bookingColor,  // Color
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

    // Add empty rooms to the timeline
    const floor = document.getElementById("floorSelect").value;
    const roomsPerFloor = 10; // Suppose each floor has 10 rooms
    const roomsOnSelectedFloor = [];
    
    // Create room numbers for the selected floor
    for (let i = 1; i <= roomsPerFloor; i++) {
        const roomNumber = `${floor}${i.toString().padStart(2, '0')}`;
        roomsOnSelectedFloor.push(roomNumber);
    }
    
    // Find all booked rooms
    const bookedRooms = formattedData.map(row => row[0]);
    
    // Find empty rooms
    const emptyRooms = roomsOnSelectedFloor.filter(room => !bookedRooms.includes(room));
    
    // Add empty rooms to the timeline
    const startDate = new Date(document.getElementById("startDate").value);
    const endDate = new Date(document.getElementById("endDate").value);
    
    emptyRooms.forEach(roomNum => {
        formattedData.push([
            roomNum,
            "",
            `<div style="padding:10px;"><strong>Room:</strong> ${roomNum} <br><strong>Status:</strong> Available</div>`,
            "#DDDDDD", // Light gray
            startDate,
            startDate // Set start and end date to the same date
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
                bookingid = booking[0];
                initialtotalMoney = booking[5];
                break;
            }
        }

    }
    const bookServiceBtn = document.getElementById('book-service-btn');
    const checkoutBtn = document.getElementById('checkout-btn');
    const checkinBtn = document.getElementById('checkin-btn');
    const cancelBtn = document.getElementById('cancel-btn');

    bookServiceBtn.style.display = 'none';
    checkoutBtn.style.display = 'none';
    checkinBtn.style.display = 'none';
    cancelBtn.style.display = 'none';
    
    // Show buttons based on status
    if (bookingStatus === "Confirmed") {
        // If confirmed, show check out and book service
        checkoutBtn.style.display = 'inline-block';
        bookServiceBtn.style.display = 'inline-block';
    } else if (bookingStatus === "Pending") {
        // If pending, only show check in
        checkinBtn.style.display = 'inline-block';
        cancelBtn.style.display = 'inline-block';
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

async function checkin() {
    var selection = chart.getSelection();
    if (selection.length > 0) {
        var row = selection[0].row;
        // Get booking status from dataTable or use booking array
        var bookingId = "";
        
        // Find the corresponding booking in our arrays
        const roomNumber = dataTable.getValue(row, 0); // Assuming room number is in column 0
        const checkinDate = dataTable.getValue(row, 4);
        
        // Search in all booking arrays to find matching booking
        for (let booking of [...upcomingBookings, ...currentBookings, ...pastBookings]) {
            if (booking[3] === roomNumber && booking[7].getTime() === checkinDate.getTime()) { // booking[3] contains the room number
                
                bookingId = booking[0];
                break;
            }
        }

    }
    let apiUrl = `https://hotel-bed.onrender.com/api/Booking/Checkin?id=${bookingId}`;

    try {
        let response = await fetch(apiUrl, {
            method: "POST", 
            headers: { "Content-Type": "application/json" }
        });
        if (!response.ok) throw new Error("Lỗi khi tải dữ liệu!");
        fetchBookings();
        closeModal();
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
    }
}

async function bookService() {
    document.getElementById('addservice-modal').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('modal').style.display = 'none';

    document.getElementById('addservice-customerName').value = document.getElementById('cust-name').textContent;
    document.getElementById('addservice-roomNumber').value = document.getElementById('cust-room-num').textContent;

    try {
        const response = await fetch(`https://hotel-bed.onrender.com/api/Package/GetPackageList`);
        const data = await response.json();
        servicesList = data.data;

        document.getElementById('addserviceTableBody').innerHTML = "";
        servicesList.forEach((service) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${service.spPackageName}</td>
                <td>${service.productsInfo.split('\n').join('<br>')}</td>
                <td>${service.sServiceSellPrice.toLocaleString()}</td>
                <td><button class="btn btn-add" onclick="addService(this)">+</button></td>
            `;
            document.getElementById('addserviceTableBody').appendChild(row);
        });
    } catch (error) {
        console.error("Error fetching services:", error);
    }

    try {
        const response = await fetch(`https://hotel-bed.onrender.com/api/Package/FindUsedService?bookingId=${bookingid}`);
        const data = await response.json();
        var UsedservicesList = data.data;
      
        document.getElementById('addservice-UsedServices').querySelector('tbody').innerHTML = "";
        UsedservicesList.forEach((service) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${service.spPackageName}</td>
                <td>${service.productsInfo.split('\n').join('<br>')}</td>
                <td>${service.sServiceSellPrice.toLocaleString()}</td>
                <td>${service.quantity}</td>
                <td>${(service.sServiceSellPrice * service.quantity).toLocaleString()}</td>
            `;
            document.getElementById('addservice-UsedServices').querySelector('tbody').appendChild(row);
        });
    } catch (error) {
        console.error("Error fetching services:", error);
    }
}
function filterServices() {
    const searchValue = document.getElementById("searchService").value.toLowerCase();
    const rows = document.querySelectorAll("#addserviceTableBody tr");

    rows.forEach(row => {
        const serviceName = row.cells[0].innerText.toLowerCase(); // Cột Service Name
        row.style.display = serviceName.includes(searchValue) ? "" : "none";
    });
}

function addService(button) {
    let row = button.parentElement.parentElement;
    let serviceName = row.cells[0].innerText;
    let serviceDetail = row.cells[1].innerText;
    let price = parseInt(row.cells[2].innerText.replace(/,/g, ''));

    let selectedTable = document.getElementById('addservice-selectedServices').querySelector('tbody');

    let existingRow = [...selectedTable.rows].find(r => r.cells[0].innerText === serviceName);
    
    if (existingRow) {
        let qtyCell = existingRow.cells[3];
        let totalCell = existingRow.cells[4];
        let qty = parseInt(qtyCell.querySelector('input').value) +1;
        qtyCell.querySelector('input').value=qty;
        totalCell.innerText = (qty * price).toLocaleString();
    } else {
        let newRow = selectedTable.insertRow();
        newRow.innerHTML = `
            <td>${serviceName}</td>
            <td>${serviceDetail}</td>
            <td>${price.toLocaleString()}</td>
            <td><input type="number" id="addservice-quantity" class="quantity-input" value="1"></td>
            <td>${price.toLocaleString()}</td>
            <td><button class="btn btn-remove" onclick="removeService(this)">-</button></td>
        `;
    }
    document.getElementById('searchService').value ="";
}
document.addEventListener("DOMContentLoaded", function() {
    let tableBody = document.getElementById('addservice-selectedServices')?.querySelector('tbody');
    if (tableBody) {
        tableBody.addEventListener('input', function(event) {
            let targetCell = event.target; 
            if (targetCell.classList.contains("quantity-input")) {
                let row = targetCell.closest('tr'); 
                let qty = parseInt(targetCell.value) || 0; 
                let price = parseInt(row.cells[2].innerText.replace(/,/g, '')) || 0; 
                let totalCell = row.cells[4]; 
                totalCell.innerText = (qty * price).toLocaleString();
            }
        });
    } else {
        console.error(" addservice-selectedServices table not exist");
    }
});

function removeService(button) {
    let row = button.parentElement.parentElement;
    row.remove();
}
async function addServicetoBooking() {
    try {
        // Lấy thông tin từ bảng dịch vụ đã chọn
        const selectedTable = document.getElementById('addservice-selectedServices').querySelector('tbody');
        
        // Nếu không có dịch vụ nào được chọn
        if (selectedTable.rows.length === 0) {
            alert("Vui lòng chọn ít nhất một dịch vụ!");
            return;
        }
        
        // Tạo mảng dữ liệu cho API
        const servicesData = [];
        
        // Lặp qua từng dòng trong bảng đã chọn
        for (let i = 0; i < selectedTable.rows.length; i++) {
            const row = selectedTable.rows[i];
            const serviceName = row.cells[0].innerText;
            const quantity = parseInt(row.cells[3].querySelector('input').value);
            
            
            // Tìm serviceID từ tên dịch vụ trong servicesList
            const service = servicesList.find(s => s.spPackageName === serviceName);
            if (!service) {
                console.error(`Không tìm thấy dịch vụ có tên: ${serviceName}`);
                continue;
            }
        
            servicesData.push({
                "packageID": service.spPackageId,
                "quantity": quantity
            });
        }
        
        if (servicesData.length === 0) {
            alert("Không thể tìm thấy ID cho các dịch vụ đã chọn!");
            return;
        }
        
        // Gọi API để thêm dịch vụ với BookingID và danh sách dịch vụ
        const response = await fetch(`https://hotel-bed.onrender.com/api/Package/AddService?BookingID=${bookingid}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(servicesData)
        });
          
        if(response.ok){
            console.log('Add services successfully');
        }
        // Đóng modal và làm mới dữ liệu
        closeAddServiceModal();
        fetchBookings();

    } catch (error) {
        console.error('ERROR:', error);
        alert('ERROR!');
    }
}

function closeAddServiceModal() {
    document.getElementById('addservice-modal').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('addservice-UsedServices').querySelector('tbody').innerHTML = "";
    document.getElementById('addservice-selectedServices').querySelector('tbody').innerHTML = "";
    document.getElementById('searchService').value ="";

    document.body.classList.remove("modal-open");
}

async function showCheckoutModal() {
    // Ẩn modal booking details
    document.getElementById('modal').style.display = 'none';
    
    // Lấy thông tin từ modal booking details
    const guestName = document.getElementById('cust-name').textContent;
    const deposit = document.getElementById('cust-deposit').textContent;
    
    // Hiển thị thông tin trong modal checkout
    document.getElementById('checkout-guest-name').textContent = guestName;
    
    // Lấy thời gian hiện tại cho checkout
    const now = new Date();
    

    // Tìm tất cả phòng trong currentBookings có cùng bookingid
    const checkoutRooms = currentBookings.filter(booking => booking[0] === bookingid);
    console.log(now);
    // Chuẩn bị HTML cho bảng thông tin phòng
    let roomDetailsHTML = '';
    let totalRoomPrice = 0;
    
    if (checkoutRooms.length > 0) {
        checkoutRooms.forEach(room => {
            const roomNumber = room[3];
            const timeIn = new Date(room[7]);
            
            const timeInFormatted = formatDateTimeLocal(timeIn);
            const timeOutFormatted = formatDateTimeLocal(now);
            
            const roomPrice = room[9] ; 
            
            const timeUsed = Math.ceil((now - timeIn) / (1000 * 60 * 60));
            
            const roomTotalPrice = timeUsed * roomPrice;
            totalRoomPrice += roomTotalPrice;
            
            roomDetailsHTML += `
                <tr>
                    <td>${roomNumber}</td>
                    <td>
                        <input type="datetime-local" value="${timeInFormatted}" class="checkout-time-input" id="checkout-time-in" readonly>
                    </td>
                    <td>
                        <input type="datetime-local" value="${timeOutFormatted}" class="checkout-time-input" id="checkout-time-out" >
                    </td>
                    <td>${timeUsed.toFixed(2)}</td>
                    <td>${roomPrice.toLocaleString()} USD/h</td>
                    <td>${roomTotalPrice.toLocaleString()} USD</td>
                </tr>
            `;
        });
    } else {
        roomDetailsHTML = `<tr><td colspan="6" class="text-center">Fan't find room infomation</td></tr>`;
    }
    
    document.getElementById('checkout-room-details').innerHTML = roomDetailsHTML;
    
    // Thêm event listener cho input datetime để tính lại thời gian sử dụng và tổng tiền khi thay đổi
    setTimeout(() => {
        const timeInputs = document.querySelectorAll('.checkout-time-input');
        timeInputs.forEach(input => {
            input.addEventListener('change', updateCheckoutCalculations);
        });
    }, 100);
    

    try {
        const response = await fetch(`https://hotel-bed.onrender.com/api/Package/FindUsedService?bookingId=${bookingid}`);
        const data = await response.json();
        var checkoutUsedservicesList = data.data;
        var totalServicePrice = 0;
        if(checkoutUsedservicesList.length > 0){
            document.getElementById('checkout-services-details').innerHTML = "";
            checkoutUsedservicesList.forEach((service) => {
                const row = document.createElement("tr");
                var servicetotalprice = service.sServiceSellPrice * service.quantity;
                totalServicePrice += servicetotalprice;
                row.innerHTML = `
                    <td>${service.spPackageName}</td>
                    <td>${service.productsInfo.split('\n').join('<br>')}</td>
                    <td>${service.sServiceSellPrice.toLocaleString()}</td>
                    <td>${service.quantity}</td>
                    <td>${servicetotalprice.toLocaleString()}</td>
                `;
                document.getElementById('checkout-services-details').appendChild(row);        
            });
        }
        else{
            document.getElementById('checkout-services-details').innerHTML = `<tr><td colspan="5" class="text-center">There is no service</td></tr>`;
        }   
    } catch (error) {
        console.error("Error fetching services:", error);
    }
      
    // Tính tổng tiền
    const grandTotal = totalRoomPrice + totalServicePrice;
    const depositAmount = parseInt(deposit) || 0;
    const remaining = grandTotal - depositAmount;
        
    document.getElementById('checkout-total-price').textContent = grandTotal.toLocaleString();
    document.getElementById('checkout-deposit').textContent = depositAmount.toLocaleString();
    document.getElementById('checkout-remaining').textContent = remaining.toLocaleString();
    
    
    // Hiển thị modal checkout
    document.getElementById('checkoutdetail-modal').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
}

function updateCheckoutCalculations() {
    const timeInInput = document.getElementById('checkout-time-in');
    const timeOutInput = document.getElementById('checkout-time-out');
    
    if (!timeInInput || !timeOutInput) return;
    
    const timeIn = new Date(timeInInput.value);
    const timeOut = new Date(timeOutInput.value);
    
    if (isNaN(timeIn) || isNaN(timeOut)) return;
    
    // Tìm phòng hiện tại trong currentBookings
    const room = currentBookings.find(b => b[0] === bookingid);
    if (!room) return;
    
    const roomPrice = room[9] || initialtotalMoney / 24;
    
    // Tính thời gian sử dụng (giờ)
    const timeUsed = (timeOut - timeIn) / (1000 * 60 * 60);
    
    // Tính tổng tiền phòng
    const roomTotalPrice = timeUsed * roomPrice;
    
    // Cập nhật UI
    const row = timeInInput.closest('tr');
    if (row) {
        row.cells[3].textContent = timeUsed.toFixed(2);
        row.cells[5].textContent = roomTotalPrice.toLocaleString() + ' USD';
    }
    
    // Cập nhật tổng cộng
    const servicesTotal = document.querySelectorAll('#checkout-services-details tr')
        .reduce((total, row) => {
            const priceCell = row.cells[4];
            if (priceCell) {
                const price = parseInt(priceCell.textContent.replace(/[^\d]/g, '')) || 0;
                return total + price;
            }
            return total;
        }, 0);
    
    const grandTotal = roomTotalPrice + servicesTotal;
    const depositAmount = parseInt(document.getElementById('checkout-deposit').textContent.replace(/[^\d]/g, '')) || 0;
    const remaining = grandTotal - depositAmount;
    
    document.getElementById('checkout-total-price').textContent = grandTotal.toLocaleString();
    document.getElementById('checkout-remaining').textContent = remaining.toLocaleString();
}

function closeCheckoutModal() {
    document.getElementById('checkoutdetail-modal').style.display = 'none';
    document.getElementById('modal').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
    document.body.classList.remove("modal-open");
}


async function checkout() {
    try {
        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
        const grandTotalText = document.getElementById('checkout-total-price').textContent;

        const grandTotal = parseFloat(grandTotalText.replace(/,/g, ''));
                
        const response = await fetch(
            `https://hotel-bed.onrender.com/api/Booking/Checkout?id=${bookingid}&paymethod=${paymentMethod}&total=${grandTotal}`, 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );
        
        if (!response.ok) {
            throw new Error('Error when checkout');
        }
        
        // Thông báo thành công
        alert('Payment successfully!');
        
        // Đóng modal và làm mới dữ liệu
        closeCheckoutModal();
        fetchBookings();
        document.body.classList.remove("modal-open");
        
    } catch (error) {
        console.error('Error when checkout:', error);
    }
}

// Thêm hàm mới để định dạng đúng thời gian cho input datetime-local
function formatDateTimeLocal(date) {
    // Chuyển đổi thời gian để phù hợp với múi giờ địa phương
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function showCancelBookingModal() {
    // Ẩn modal booking details
    document.getElementById('modal').style.display = 'none';
    
    // Lấy thông tin từ modal booking details
    const guestName = document.getElementById('cust-name').textContent;
    const deposit = document.getElementById('cust-deposit').textContent;
    
    // Hiển thị thông tin trong modal cancel booking
    document.getElementById('cancelbooking-guest-name').textContent = guestName;
    document.getElementById('cancelbooking-deposit').textContent = deposit;
    
    // Hiển thị modal cancel booking
    document.getElementById('cancelbooking-modal').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
}

function closeCancelBookingModal() {
    document.getElementById('cancelbooking-modal').style.display = 'none';
    document.getElementById('modal').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
    document.body.classList.remove("modal-open");
}

async function confirmCancelBooking() {
    try {
        const paymentMethod = document.querySelector('input[name="cancelPaymentMethod"]:checked').value;
        const depositText = document.getElementById('cancelbooking-deposit').textContent;
        const deposit = parseFloat(depositText.replace(/,/g, ''));
        
        console.log('Cancel booking với ID:', bookingid, 'và phương thức thanh toán:', paymentMethod, 'và deposit:', deposit);
        
        // Gọi API cancel booking
        const response = await fetch(`https://hotel-bed.onrender.com/api/Booking/Cancelbooking`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: bookingid,
                paymethod: paymentMethod,
                total: deposit
            })
        });
        
        if (!response.ok) {
            throw new Error('Error when cancel booking');
        }
        
        // Thông báo thành công
        alert('Cancel booking successfully!');
        
        // Đóng modal và làm mới dữ liệu
        closeCancelBookingModal();
        fetchBookings();
        document.body.classList.remove("modal-open");
        
    } catch (error) {
        console.error('Error when cancel booking:', error);
    }
}
