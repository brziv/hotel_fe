let cusid = localStorage.getItem("userId");
let cusname;
let servicePackages = [];
let selectedService = null;
let bookings = [];
let selectedBookingId = null;
let selectedBooking = null;
let selectedServices = [];
let usedServices = [];

// Function to get customer name from ID
async function getCustomerName() {
    try {
        const response = await fetch(`https://hotel-bed.onrender.com/api/Guest/GetGuestByUserId?userId=${cusid}`);

        const data = await response.json();
        cusname = data.data.gFirstName + ' ' + data.data.gLastName;
    } catch (error) {
        console.log("Error fetching customer name:", error);
    }
}

// Function to load bookings from API
async function loadBookings() {
    try {
        const response = await fetch(`https://hotel-bed.onrender.com/api/Room/GetConfirmedBookingsByGuestId?guestId=${cusid}`);
        if (!response.ok) throw new Error("Error loading bookings!");

        const data = await response.json();
        bookings = data.data;

        // Display bookings in modal
        displayBookings();
    } catch (error) {
        console.error("Error:", error);
        document.getElementById('bookingList').innerHTML = `
                    <div class="alert alert-danger">
                        Could not load booking data. Please try again later.
                    </div>
                `;
    }
}

// Function to display bookings in modal
function displayBookings() {
    const container = document.getElementById('bookingList');
    container.innerHTML = '';

    if (bookings.length === 0) {
        container.innerHTML = `
                    <div class="alert alert-info">
                        You don't have any bookings yet.
                    </div>
                `;
        return;
    }

    bookings.forEach(booking => {
        // Determine status class and badge
        let statusClass = '';
        let statusText = '';
        let statusBadgeClass = '';

        if (booking.status === 'Confirmed') {
            statusClass = 'confirmed';
            statusText = 'Confirmed';
            statusBadgeClass = 'status-confirmed';
        } else if (booking.status === 'Pending') {
            statusClass = 'pending';
            statusText = 'Pending';
            statusBadgeClass = 'status-pending';
        } else {
            statusClass = 'cancelled';
            statusText = 'Cancelled';
            statusBadgeClass = 'status-cancelled';
        }

        // Format dates
        const createdAt = new Date(booking.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        // Create booking card
        const card = document.createElement('div');
        card.className = `booking-card ${statusClass}`;
        card.innerHTML = `
                    <div class="booking-header d-flex justify-content-between align-items-center">
                        <div>
                            <span class="status-badge ${statusBadgeClass}">${statusText}</span>
                            <span class="ms-2">Booking ID: ${booking.bookingId.substring(0, 8)}...</span>
                        </div>
                        <div>
                            <span class="fw-bold">$${booking.totalMoney.toLocaleString()}</span>
                        </div>
                    </div>
                    <div class="booking-body">
                        <p><strong>Created:</strong> ${createdAt}</p>
                        <div class="rooms-list">
                            <p><strong>Rooms:</strong></p>
                            <ul class="list-unstyled">
                                ${booking.rooms.map(room => {
            const checkIn = new Date(room.checkInDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            const checkOut = new Date(room.checkOutDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            return `
                                        <li class="mb-1">
                                            <i class="fas fa-door-open me-2"></i> Room ${room.roomNumber}
                                            <br>
                                            <small class="text-muted ms-4">
                                                Check-in: ${checkIn}<br>
                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Check-out: ${checkOut}
                                            </small>
                                        </li>
                                    `;
        }).join('')}
                            </ul>
                        </div>
                    </div>
                    <div class="booking-footer d-flex justify-content-between align-items-center">
                        <div>
                            <small class="text-muted">Total: $${booking.totalMoney.toLocaleString()}</small>
                        </div>
                        ${booking.status === 'Confirmed' ? `
                            <button class="btn btn-choose" onclick="selectBooking('${booking.bookingId}')">
                                Choose
                            </button>
                        ` : ''}
                    </div>
                `;

        container.appendChild(card);
    });
}

// Function to select a booking
function selectBooking(bookingId) {
    selectedBookingId = bookingId;
    selectedBooking = bookings.find(b => b.bookingId === bookingId);

    if (!selectedBooking) return;

    // Format dates
    const createdAt = new Date(selectedBooking.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    // Display selected booking
    const selectedBookingDisplay = document.getElementById('selectedBookingDisplay');
    const selectedBookingDetails = document.getElementById('selectedBookingDetails');

    selectedBookingDetails.innerHTML = `
                <div class="selected-booking-detail">
                    <h5>Booking Information</h5>
                    <p><strong>Booking ID:</strong> ${selectedBooking.bookingId.substring(0, 8)}...</p>
                    <p><strong>Status:</strong> <span class="status-badge status-confirmed">Confirmed</span></p>
                    <p><strong>Created:</strong> ${createdAt}</p>
                    <p><strong>Total:</strong> $${selectedBooking.totalMoney.toLocaleString()}</p>
                </div>
                <div class="selected-booking-detail">
                    <h5>Room Details</h5>
                    ${selectedBooking.rooms.map(room => {
        const checkIn = new Date(room.checkInDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        const checkOut = new Date(room.checkOutDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        return `
                            <div class="mb-2">
                                <p><strong>Room ${room.roomNumber}</strong></p>
                                <p><small>Check-in: ${checkIn}</small></p>
                                <p><small>Check-out: ${checkOut}</small></p>
                            </div>
                        `;
    }).join('')}
                </div>
            `;

    selectedBookingDisplay.style.display = 'block';

    // Close modal
    const bookingModal = bootstrap.Modal.getInstance(document.getElementById('bookingModal'));
    bookingModal.hide();
}

// Function to load service packages from API
async function loadServicePackages() {
    try {
        const response = await fetch('https://hotel-bed.onrender.com/api/Package/GetPackageList');
        if (!response.ok) throw new Error("Error loading data!");

        const data = await response.json();
        servicePackages = data.data;

        // Display service packages
        displayServicePackages();
    } catch (error) {
        console.error("Error:", error);
        document.getElementById('servicePackages').innerHTML = `
                    <div class="col-12 text-center">
                        <div class="alert alert-danger">
                            Could not load service data. Please try again later.
                        </div>
                    </div>
                `;
    }
}

// Function to display service packages
function displayServicePackages() {
    const container = document.getElementById('servicePackages');
    container.innerHTML = '';

    // Sample images for service packages
    const sampleImages = [
        'https://images.unsplash.com/photo-1544148103-0773bf10d330?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        'https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    ];

    servicePackages.forEach((service, index) => {
        // Get sample image based on index
        const imageUrl = sampleImages[index % sampleImages.length];

        // Create card for service package
        const card = document.createElement('div');
        card.className = 'col-md-6 col-lg-4';
        card.innerHTML = `
                    <div class="service-card">
                        <div class="service-image" style="background-image: url('${imageUrl}')"></div>
                        <div class="service-content">
                            <h3 class="service-title">${service.spPackageName}</h3>
                            <div class="service-price">${service.sServiceSellPrice.toLocaleString()} USD</div>
                            <p class="service-description">Experience our amazing ${service.spPackageName} service.</p>
                            <div class="service-features">
                                ${service.productsInfo.split('\n').map(item => `
                                    <div class="service-feature">
                                        <i class="fas fa-check-circle"></i> ${item}
                                    </div>
                                `).join('')}
                            </div>
                            <button class="btn btn-order" onclick="openOrderModal('${service.spPackageId}')">
                                Order Now
                            </button>
                        </div>
                    </div>
                `;

        container.appendChild(card);
    });
}

// Function to open booking selection modal
function openBookingModal() {
    // Load bookings if not already loaded
    if (bookings.length === 0) {
        loadBookings();
    }

    // Show modal
    const bookingModal = new bootstrap.Modal(document.getElementById('bookingModal'));
    bookingModal.show();
}

// Function to open service order modal
function openOrderModal(serviceId) {
    // Check if a booking is selected
    if (!selectedBookingId) {
        // Show booking selection modal first
        openBookingModal();
        return;
    }

    // Reset the order modal
    resetOrderModal();

    // Load used services for the selected booking
    loadUsedServices(selectedBookingId);

    // Populate service list
    populateServiceList();

    // Add the initial service if provided
    if (serviceId) {
        const service = servicePackages.find(s => s.spPackageId === serviceId);
        if (service) {
            addServiceToSelection(service);
        }
    }

    // Update customer and room information
    updateBookingInfo();

    // Show modal
    const orderModal = new bootstrap.Modal(document.getElementById('orderModal'));
    orderModal.show();
}

// Function to load used services for a booking
async function loadUsedServices(bookingId) {
    try {
        const response = await fetch(`https://hotel-bed.onrender.com/api/Package/FindUsedService?bookingId=${bookingId}`);
        const data = await response.json();
        usedServices = data.data;

        // Display used services
        displayUsedServices();
    } catch (error) {
        console.error("Error fetching used services:", error);
        usedServices = [];
        displayUsedServices();
    }
}

// Function to display used services
function displayUsedServices() {
    const tbody = document.getElementById('usedServicesTable').querySelector('tbody');
    tbody.innerHTML = '';

    if (usedServices.length === 0) {
        tbody.innerHTML = `
                    <tr>
                        <td colspan="5" class="text-center">No services used yet</td>
                    </tr>
                `;
        return;
    }

    usedServices.forEach(service => {
        const row = document.createElement('tr');
        row.innerHTML = `
                    <td>${service.spPackageName}</td>
                    <td>${service.productsInfo.split('\n').join('<br>')}</td>
                    <td>${service.sServiceSellPrice.toLocaleString()}</td>
                    <td>${service.quantity}</td>
                    <td>${(service.sServiceSellPrice * service.quantity).toLocaleString()}</td>
                `;
        tbody.appendChild(row);
    });
}

// Function to populate service list
function populateServiceList() {
    const tbody = document.getElementById('serviceList');
    tbody.innerHTML = '';

    servicePackages.forEach(service => {
        const row = document.createElement('tr');
        row.innerHTML = `
                    <td>${service.spPackageName}</td>
                    <td>${service.sServiceSellPrice.toLocaleString()} USD</td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="addServiceToSelection('${service.spPackageId}')">
                            Add
                        </button>
                    </td>
                `;
        tbody.appendChild(row);
    });

    // Add search functionality
    document.getElementById('serviceSearch').addEventListener('input', function () {
        const searchTerm = this.value.toLowerCase();
        const rows = tbody.querySelectorAll('tr');

        rows.forEach(row => {
            const serviceName = row.querySelector('td:first-child').textContent.toLowerCase();
            if (serviceName.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });
}

// Function to add service to selection
function addServiceToSelection(serviceId) {
    // If serviceId is a string, find the service object
    const service = typeof serviceId === 'string'
        ? servicePackages.find(s => s.spPackageId === serviceId)
        : serviceId;

    if (!service) return;

    // Check if service is already in selection
    const existingService = selectedServices.find(s => s.spPackageId === service.spPackageId);

    if (existingService) {
        // Increment quantity
        existingService.quantity += 1;
    } else {
        // Add new service
        selectedServices.push({
            ...service,
            quantity: 1
        });
    }

    // Update selected services table
    displaySelectedServices();

    // Update order summary
    updateOrderSummary();
}

// Function to display selected services
function displaySelectedServices() {
    const tbody = document.getElementById('selectedServicesTable').querySelector('tbody');
    tbody.innerHTML = '';

    if (selectedServices.length === 0) {
        tbody.innerHTML = `
                    <tr>
                        <td colspan="6" class="text-center">No services selected</td>
                    </tr>
                `;
        return;
    }

    selectedServices.forEach(service => {
        const row = document.createElement('tr');
        row.innerHTML = `
                    <td>${service.spPackageName}</td>
                    <td>${service.productsInfo.split('\n').join('<br>')}</td>
                    <td>${service.sServiceSellPrice.toLocaleString()}</td>
                    <td>
                        <div class="input-group input-group-sm">
                            <button class="btn btn-outline-secondary" type="button" onclick="updateServiceQuantity('${service.spPackageId}', ${service.quantity - 1})">-</button>
                            <input type="number" class="form-control text-center" value="${service.quantity}" min="1" onchange="updateServiceQuantity('${service.spPackageId}', this.value)">
                            <button class="btn btn-outline-secondary" type="button" onclick="updateServiceQuantity('${service.spPackageId}', ${service.quantity + 1})">+</button>
                        </div>
                    </td>
                    <td>${(service.sServiceSellPrice * service.quantity).toLocaleString()}</td>
                    <td>
                        <button class="btn btn-sm btn-danger" onclick="removeService('${service.spPackageId}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
        tbody.appendChild(row);
    });
}

// Function to update service quantity
function updateServiceQuantity(serviceId, newQuantity) {
    newQuantity = parseInt(newQuantity);

    if (isNaN(newQuantity) || newQuantity < 1) {
        newQuantity = 1;
    }

    const service = selectedServices.find(s => s.spPackageId === serviceId);
    if (service) {
        service.quantity = newQuantity;
        displaySelectedServices();
        updateOrderSummary();
    }
}

// Function to remove service from selection
function removeService(serviceId) {
    selectedServices = selectedServices.filter(s => s.spPackageId !== serviceId);
    displaySelectedServices();
    updateOrderSummary();
}

// Function to update order summary
function updateOrderSummary() {
    const totalServices = selectedServices.reduce((sum, service) => sum + service.quantity, 0);
    const totalAmount = selectedServices.reduce((sum, service) => sum + (service.sServiceSellPrice * service.quantity), 0);

    document.getElementById('totalServices').textContent = totalServices;
    document.getElementById('totalAmount').textContent = totalAmount.toLocaleString();
}

// Function to update booking information in modal
function updateBookingInfo() {
    if (!selectedBooking) return;

    document.getElementById('modalCustomerName').textContent = cusname;

    const roomNumbers = selectedBooking.rooms.map(room => room.roomNumber).join(', ');
    document.getElementById('modalRoomNumbers').textContent = roomNumbers;
}

// Function to reset order modal
function resetOrderModal() {
    selectedServices = [];
    displaySelectedServices();
    updateOrderSummary();
}

// Function to show toast notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toastNotification');
    const toastMessage = document.getElementById('toastMessage');
    const toastHeader = toast.querySelector('.toast-header');

    // Set message
    toastMessage.textContent = message;

    // Set type (success, warning, danger)
    toastHeader.className = 'toast-header';
    if (type === 'success') {
        toastHeader.classList.add('bg-success', 'text-white');
    } else if (type === 'warning') {
        toastHeader.classList.add('bg-warning', 'text-dark');
    } else if (type === 'danger') {
        toastHeader.classList.add('bg-danger', 'text-white');
    }

    // Show toast with 5 seconds delay
    const bsToast = new bootstrap.Toast(toast, {
        delay: 5000 // 5 seconds
    });
    bsToast.show();
}

// Function to confirm order
function confirmOrder() {
    if (!selectedBookingId || selectedServices.length === 0) {
        showToast('Please select at least one service to order.', 'warning');
        return;
    }

    // Prepare data for API call
    const orderData = selectedServices.map(service => ({
        packageId: service.spPackageId,
        quantity: service.quantity
    }));

    // Call API to add services
    fetch(`https://hotel-bed.onrender.com/api/Package/AddService?BookingID=${selectedBookingId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // Không cần parse JSON nếu API không trả về dữ liệu
            return response.text().then(text => {
                // Kiểm tra xem text có phải là JSON hợp lệ không
                try {
                    return text ? JSON.parse(text) : {};
                } catch (e) {
                    console.log('Response is not valid JSON:', text);
                    return {};
                }
            });
        })
        .then(data => {
            // Show success message
            showToast(`Successfully ordered ${selectedServices.length} service(s)!`, 'success');

            // Close modal
            const orderModal = bootstrap.Modal.getInstance(document.getElementById('orderModal'));
            orderModal.hide();

            // Reset the order modal
            resetOrderModal();

            // Reload used services to update the list
            loadUsedServices(selectedBookingId);
        })
        .catch(error => {
            console.error('Error adding services:', error);
            showToast('Failed to order services. Please try again.', 'danger');
        });
}

// Add event listeners when page is loaded
document.addEventListener('DOMContentLoaded', async function () {
    // Load service packages
    await loadServicePackages();
    await getCustomerName();

    // Add button to select booking if none is selected
    const servicePackagesContainer = document.getElementById('servicePackages');
    const bookingSelectionButton = document.createElement('div');
    bookingSelectionButton.className = 'col-12 text-center mb-3 booking-selection-btn';
    bookingSelectionButton.innerHTML = `
                <button class="btn btn-primary" onclick="openBookingModal()">
                    <i class="fas fa-calendar-check me-2"></i> Select Your Booking
                </button>
            `;
    servicePackagesContainer.parentNode.insertBefore(bookingSelectionButton, servicePackagesContainer);
});