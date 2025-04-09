// Global variables to store fetched data
let allRequests = [];
let bookingRequests = [];
let serviceRequests = [];
let selectedRequest = null;
let staffId = localStorage.getItem("userId");

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if staff is logged in
    if (!staffId) {
        window.location.href = 'login.html';
        return;
    }
    
    // Load all requests data
    loadAllRequests();
    
    // Set up event listeners
    document.getElementById('filter-btn').addEventListener('click', applyFilters);
    document.getElementById('updateStatusBtn').addEventListener('click', updateRequestStatus);
    
    // Set up tab change event listeners to refresh data
    const tabs = document.querySelectorAll('button[data-bs-toggle="tab"]');
    tabs.forEach(tab => {
        tab.addEventListener('shown.bs.tab', function(event) {
            const targetId = event.target.getAttribute('data-bs-target');
            if (targetId === '#booking-requests') {
                refreshBookingRequestsTable();
            } else if (targetId === '#service-requests') {
                refreshServiceRequestsTable();
            } else {
                refreshAllRequestsTable();
            }
        });
    });
});

// Function to load all requests
async function loadAllRequests() {
    try {
        // Show loading state
        document.getElementById('all-requests-body').innerHTML = `
            <tr>
                <td colspan="7" class="text-center">Loading requests...</td>
            </tr>
        `;
        
        // Fetch booking requests
        await loadBookingRequests();
        
        // Fetch service requests
        await loadServiceRequests();
        
        // Combine both types of requests into the allRequests array
        allRequests = [
            ...bookingRequests.map(booking => ({
                id: booking.bookingId,
                type: 'booking',
                guest: `${booking.guestFirstName} ${booking.guestLastName}`,
                details: `${booking.rooms.length} room(s), Check-in: ${formatDate(booking.checkInDate)}`,
                status: booking.status,
                created: new Date(booking.createdAt),
                originalData: booking
            })),
            ...serviceRequests.map(service => ({
                id: service.serviceId,
                type: 'service',
                guest: service.guestName,
                details: `${service.serviceName} for Booking: ${service.bookingId.substring(0, 8)}...`,
                status: service.status,
                created: new Date(service.requestDate),
                originalData: service
            }))
        ];
        
        // Sort all requests by date (newest first)
        allRequests.sort((a, b) => b.created - a.created);
        
        // Refresh the tables
        refreshAllRequestsTable();
        refreshBookingRequestsTable();
        refreshServiceRequestsTable();
        
        // Update counters
        updateCounters();
    } catch (error) {
        console.error("Error loading requests:", error);
        showErrorMessage("all-requests-body", "Failed to load requests. Please try again later.");
    }
}

// Function to load booking requests
async function loadBookingRequests() {
    try {
        const response = await fetch('http://localhost:5222/api/Room/GetAllBookings');
        if (!response.ok) throw new Error("Error loading booking requests!");
        
        const data = await response.json();
        bookingRequests = data.data;
    } catch (error) {
        console.error("Error loading booking requests:", error);
        bookingRequests = [];
        showErrorMessage("booking-requests-body", "Failed to load booking requests. Please try again later.");
    }
}

// Function to load service requests
async function loadServiceRequests() {
    try {
        const response = await fetch('http://localhost:5222/api/Room/GetAllServices');
        if (!response.ok) throw new Error("Error loading service requests!");
        
        const data = await response.json();
        serviceRequests = data.data;
    } catch (error) {
        console.error("Error loading service requests:", error);
        serviceRequests = [];
        showErrorMessage("service-requests-body", "Failed to load service requests. Please try again later.");
    }
}

// Function to refresh the All Requests table
function refreshAllRequestsTable(filteredRequests = null) {
    const tableBody = document.getElementById('all-requests-body');
    const requests = filteredRequests || allRequests;
    
    if (requests.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center">No requests found</td>
            </tr>
        `;
        return;
    }
    
    tableBody.innerHTML = '';
    
    requests.forEach(request => {
        const row = document.createElement('tr');
        
        // Determine status badge class
        let statusClass = '';
        if (request.status === 'New' || request.status === 'Pending') {
            statusClass = 'status-new';
        } else if (request.status === 'In Progress') {
            statusClass = 'status-in-progress';
        } else if (request.status === 'Completed' || request.status === 'Confirmed') {
            statusClass = 'status-completed';
        }
        
        const formattedDate = formatDate(request.created);
        const truncatedId = request.id.substring(0, 8) + '...';
        
        row.innerHTML = `
            <td>${truncatedId}</td>
            <td>${request.type === 'booking' ? 'Room Booking' : 'Service Request'}</td>
            <td>${request.guest}</td>
            <td>${request.details}</td>
            <td><span class="status-badge ${statusClass}">${request.status}</span></td>
            <td>${formattedDate}</td>
            <td>
                <button class="btn btn-action btn-view" onclick="viewRequestDetails('${request.id}', '${request.type}')">
                    <i class="bi bi-eye"></i> View
                </button>
                <button class="btn btn-action btn-status" onclick="updateStatus('${request.id}', '${request.type}')">
                    <i class="bi bi-check-circle"></i> Status
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Update the badge count
    document.getElementById('all-badge').textContent = requests.length;
}

// Function to refresh the Booking Requests table
function refreshBookingRequestsTable(filteredRequests = null) {
    const tableBody = document.getElementById('booking-requests-body');
    const requests = filteredRequests || bookingRequests;
    
    if (requests.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center">No booking requests found</td>
            </tr>
        `;
        return;
    }
    
    tableBody.innerHTML = '';
    
    requests.forEach(booking => {
        const row = document.createElement('tr');
        
        // Determine status badge class
        let statusClass = '';
        if (booking.status === 'Pending') {
            statusClass = 'status-new';
        } else if (booking.status === 'In Progress') {
            statusClass = 'status-in-progress';
        } else if (booking.status === 'Confirmed') {
            statusClass = 'status-completed';
        }
        
        const truncatedId = booking.bookingId.substring(0, 8) + '...';
        const formattedCreatedDate = formatDate(new Date(booking.createdAt));
        const formattedCheckIn = formatDate(new Date(booking.checkInDate));
        const formattedCheckOut = formatDate(new Date(booking.checkOutDate));
        
        // Get room numbers
        const roomNumbers = booking.rooms.map(room => room.roomNumber).join(', ');
        
        row.innerHTML = `
            <td>${truncatedId}</td>
            <td>${booking.guestFirstName} ${booking.guestLastName}</td>
            <td>${roomNumbers}</td>
            <td>${formattedCheckIn}</td>
            <td>${formattedCheckOut}</td>
            <td><span class="status-badge ${statusClass}">${booking.status}</span></td>
            <td>${formattedCreatedDate}</td>
            <td>
                <button class="btn btn-action btn-view" onclick="viewRequestDetails('${booking.bookingId}', 'booking')">
                    <i class="bi bi-eye"></i> View
                </button>
                <button class="btn btn-action btn-status" onclick="updateStatus('${booking.bookingId}', 'booking')">
                    <i class="bi bi-check-circle"></i> Status
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Update the badge count
    document.getElementById('booking-badge').textContent = requests.length;
}

// Function to refresh the Service Requests table
function refreshServiceRequestsTable(filteredRequests = null) {
    const tableBody = document.getElementById('service-requests-body');
    const requests = filteredRequests || serviceRequests;
    
    if (requests.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center">No service requests found</td>
            </tr>
        `;
        return;
    }
    
    tableBody.innerHTML = '';
    
    requests.forEach(service => {
        const row = document.createElement('tr');
        
        // Determine status badge class
        let statusClass = '';
        if (service.status === 'New' || service.status === 'Pending') {
            statusClass = 'status-new';
        } else if (service.status === 'In Progress') {
            statusClass = 'status-in-progress';
        } else if (service.status === 'Completed') {
            statusClass = 'status-completed';
        }
        
        const truncatedServiceId = service.serviceId.substring(0, 8) + '...';
        const truncatedBookingId = service.bookingId.substring(0, 8) + '...';
        const formattedDate = formatDate(new Date(service.requestDate));
        const requestedFor = formatDate(new Date(service.requestedFor));
        
        row.innerHTML = `
            <td>${truncatedServiceId}</td>
            <td>${truncatedBookingId}</td>
            <td>${service.guestName}</td>
            <td>${service.serviceName}</td>
            <td>${requestedFor}</td>
            <td><span class="status-badge ${statusClass}">${service.status}</span></td>
            <td>${formattedDate}</td>
            <td>
                <button class="btn btn-action btn-view" onclick="viewRequestDetails('${service.serviceId}', 'service')">
                    <i class="bi bi-eye"></i> View
                </button>
                <button class="btn btn-action btn-status" onclick="updateStatus('${service.serviceId}', 'service')">
                    <i class="bi bi-check-circle"></i> Status
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Update the badge count
    document.getElementById('service-badge').textContent = requests.length;
}

// Function to update counters
function updateCounters() {
    document.getElementById('total-count').textContent = allRequests.length;
    
    const newRequests = allRequests.filter(req => 
        req.status === 'New' || req.status === 'Pending').length;
    document.getElementById('new-count').textContent = newRequests;
    
    const inProgressRequests = allRequests.filter(req => 
        req.status === 'In Progress').length;
    document.getElementById('in-progress-count').textContent = inProgressRequests;
    
    const completedRequests = allRequests.filter(req => 
        req.status === 'Completed' || req.status === 'Confirmed').length;
    document.getElementById('completed-count').textContent = completedRequests;
}

// Function to apply filters
function applyFilters() {
    const requestType = document.getElementById('request-type').value;
    const status = document.getElementById('request-status').value;
    const dateRange = document.getElementById('date-range').value;
    
    // Filter all requests
    let filteredAllRequests = [...allRequests];
    
    // Filter by request type
    if (requestType !== 'all') {
        filteredAllRequests = filteredAllRequests.filter(req => req.type === requestType);
    }
    
    // Filter by status
    if (status !== 'all') {
        filteredAllRequests = filteredAllRequests.filter(req => {
            if (status === 'new') {
                return req.status === 'New' || req.status === 'Pending';
            } else if (status === 'in-progress') {
                return req.status === 'In Progress';
            } else if (status === 'completed') {
                return req.status === 'Completed' || req.status === 'Confirmed';
            }
            return true;
        });
    }
    
    // Filter by date range
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    const lastMonth = new Date(today);
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    if (dateRange === 'today') {
        filteredAllRequests = filteredAllRequests.filter(req => req.created >= today);
    } else if (dateRange === 'yesterday') {
        filteredAllRequests = filteredAllRequests.filter(req => 
            req.created >= yesterday && req.created < today);
    } else if (dateRange === 'week') {
        filteredAllRequests = filteredAllRequests.filter(req => req.created >= lastWeek);
    } else if (dateRange === 'month') {
        filteredAllRequests = filteredAllRequests.filter(req => req.created >= lastMonth);
    }
    
    // Apply filters to booking and service requests
    const filteredBookingRequests = bookingRequests.filter(booking => {
        const matchingAllRequest = filteredAllRequests.find(r => 
            r.id === booking.bookingId && r.type === 'booking');
        return matchingAllRequest !== undefined;
    });
    
    const filteredServiceRequests = serviceRequests.filter(service => {
        const matchingAllRequest = filteredAllRequests.find(r => 
            r.id === service.serviceId && r.type === 'service');
        return matchingAllRequest !== undefined;
    });
    
    // Refresh tables with filtered data
    refreshAllRequestsTable(filteredAllRequests);
    refreshBookingRequestsTable(filteredBookingRequests);
    refreshServiceRequestsTable(filteredServiceRequests);
}

// Function to view request details
function viewRequestDetails(id, type) {
    // Find the selected request
    const request = type === 'booking' 
        ? bookingRequests.find(r => r.bookingId === id)
        : serviceRequests.find(r => r.serviceId === id);
        
    if (!request) {
        console.error(`Request not found: ${id}`);
        return;
    }
    
    selectedRequest = { id, type, data: request };
    const detailsContent = document.getElementById('requestDetailsContent');
    
    if (type === 'booking') {
        // Format booking details for display
        const formattedCreatedDate = formatDate(new Date(request.createdAt));
        const formattedCheckIn = formatDate(new Date(request.checkInDate));
        const formattedCheckOut = formatDate(new Date(request.checkOutDate));
        
        detailsContent.innerHTML = `
            <div class="detail-section">
                <h6>Booking Information</h6>
                <p><strong>Booking ID:</strong> ${request.bookingId}</p>
                <p><strong>Status:</strong> <span class="status-badge ${getStatusClass(request.status)}">${request.status}</span></p>
                <p><strong>Created On:</strong> ${formattedCreatedDate}</p>
                <p><strong>Check-In:</strong> ${formattedCheckIn}</p>
                <p><strong>Check-Out:</strong> ${formattedCheckOut}</p>
                <p><strong>Total Amount:</strong> $${request.totalMoney.toLocaleString()}</p>
            </div>
            <div class="detail-section">
                <h6>Guest Information</h6>
                <p><strong>Name:</strong> ${request.guestFirstName} ${request.guestLastName}</p>
                <p><strong>Email:</strong> ${request.guestEmail || 'N/A'}</p>
                <p><strong>Phone:</strong> ${request.guestPhone || 'N/A'}</p>
            </div>
            <div class="detail-section">
                <h6>Room Details</h6>
                <div class="table-responsive">
                    <table class="table table-sm">
                        <thead>
                            <tr>
                                <th>Room Number</th>
                                <th>Room Type</th>
                                <th>Check-In</th>
                                <th>Check-Out</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${request.rooms.map(room => `
                                <tr>
                                    <td>${room.roomNumber}</td>
                                    <td>${room.roomType}</td>
                                    <td>${formatDate(new Date(room.checkInDate))}</td>
                                    <td>${formatDate(new Date(room.checkOutDate))}</td>
                                    <td>$${room.price.toLocaleString()}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    } else {
        // Format service details for display
        const formattedRequestDate = formatDate(new Date(request.requestDate));
        const formattedRequestedFor = formatDate(new Date(request.requestedFor));
        
        detailsContent.innerHTML = `
            <div class="detail-section">
                <h6>Service Information</h6>
                <p><strong>Service ID:</strong> ${request.serviceId}</p>
                <p><strong>Service Name:</strong> ${request.serviceName}</p>
                <p><strong>Status:</strong> <span class="status-badge ${getStatusClass(request.status)}">${request.status}</span></p>
                <p><strong>Requested On:</strong> ${formattedRequestDate}</p>
                <p><strong>Requested For:</strong> ${formattedRequestedFor}</p>
                <p><strong>Price:</strong> $${request.price.toLocaleString()}</p>
                <p><strong>Quantity:</strong> ${request.quantity}</p>
                <p><strong>Total Amount:</strong> $${(request.price * request.quantity).toLocaleString()}</p>
            </div>
            <div class="detail-section">
                <h6>Guest Information</h6>
                <p><strong>Name:</strong> ${request.guestName}</p>
                <p><strong>Booking ID:</strong> ${request.bookingId}</p>
            </div>
            <div class="detail-section">
                <h6>Service Details</h6>
                <p>${request.description || 'No additional details available.'}</p>
            </div>
        `;
    }
    
    // Update modal title
    document.getElementById('requestDetailsModalLabel').textContent = 
        type === 'booking' ? 'Room Booking Details' : 'Service Request Details';
    
    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById('requestDetailsModal'));
    modal.show();
}

// Function to display the status update UI
function updateStatus(id, type) {
    // First open the details modal
    viewRequestDetails(id, type);
    
    // Focus the update status button
    setTimeout(() => {
        document.getElementById('updateStatusBtn').focus();
    }, 500);
}

// Function to update request status
async function updateRequestStatus() {
    if (!selectedRequest) return;
    
    const { id, type, data } = selectedRequest;
    let newStatus;
    
    // Determine next status based on current status
    if (data.status === 'New' || data.status === 'Pending') {
        newStatus = 'In Progress';
    } else if (data.status === 'In Progress') {
        newStatus = type === 'booking' ? 'Confirmed' : 'Completed';
    } else {
        // Already at final status
        alert('This request is already in its final status.');
        return;
    }
    
    try {
        let endpoint, body;
        
        if (type === 'booking') {
            endpoint = `http://localhost:5222/api/Room/UpdateBookingStatus`;
            body = JSON.stringify({
                bookingId: id,
                status: newStatus,
                staffId: staffId
            });
        } else {
            endpoint = `http://localhost:5222/api/Room/UpdateServiceStatus`;
            body = JSON.stringify({
                serviceId: id,
                status: newStatus,
                staffId: staffId
            });
        }
        
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: body
        });
        
        if (!response.ok) throw new Error(`Failed to update status`);
        
        const result = await response.json();
        
        if (result.success) {
            // Close the modal
            bootstrap.Modal.getInstance(document.getElementById('requestDetailsModal')).hide();
            
            // Reload data
            loadAllRequests();
            
            // Show success message
            alert(`Status updated to ${newStatus} successfully!`);
        } else {
            throw new Error(result.message || 'Failed to update status');
        }
    } catch (error) {
        console.error("Error updating status:", error);
        alert(`Error: ${error.message}`);
    }
}

// Helper function to format date
function formatDate(date) {
    if (!date) return 'N/A';
    
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Helper function to get status badge class
function getStatusClass(status) {
    if (status === 'New' || status === 'Pending') {
        return 'status-new';
    } else if (status === 'In Progress') {
        return 'status-in-progress';
    } else if (status === 'Completed' || status === 'Confirmed') {
        return 'status-completed';
    }
    return '';
}

// Helper function to show error message
function showErrorMessage(elementId, message) {
    document.getElementById(elementId).innerHTML = `
        <tr>
            <td colspan="8" class="text-center text-danger">
                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                ${message}
            </td>
        </tr>
    `;
} 