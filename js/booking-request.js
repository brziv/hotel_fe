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
    
    // Load service requests data
    loadServiceRequests();
    
    // Set up event listeners
    const filterBtn = document.getElementById('filter-btn');
    if (filterBtn) {
        filterBtn.addEventListener('click', function() {
            loadServiceRequests();
        });
    }
    
    // Add event listener for approve request button
    const approveBtn = document.getElementById('approveRequestBtn');
    if (approveBtn) {
        approveBtn.addEventListener('click', function() {
            if (selectedRequest) {
                approveRequest(selectedRequest);
            }
        });
    }
});

// Function to load service requests
async function loadServiceRequests() {
    try {
        // Show loading state
        const tableBody = document.getElementById('service-requests-body');
        if (tableBody) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center">Loading requests...</td>
                </tr>
            `;
        }
        
        const customerName = document.getElementById('customer-name')?.value || '';
        const room = document.getElementById('room')?.value || '';
        const status = document.getElementById('request-status')?.value || 'all';

        // Build query parameters
        let queryParams = [];
        if (customerName) queryParams.push(`customerName=${encodeURIComponent(customerName)}`);
        if (room) queryParams.push(`room=${encodeURIComponent(room)}`);
        if (status && status !== 'all') queryParams.push(`status=${encodeURIComponent(status)}`);

        const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
        
        // Call API to get service requests
        const response = await fetch(`http://localhost:5222/api/Package/FindServiceRequest${queryString}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        serviceRequests = data.data;
        
        // Sort service requests by createdAt in ascending order
        serviceRequests.sort((a, b) => {
            const dateA = parseDate(a.createdAt);
            const dateB = parseDate(b.createdAt);
            return dateB-dateA;
        });
        console.log(serviceRequests);
        
        // Display service requests
        displayServiceRequests(serviceRequests);
        
        // Update statistics
        updateStatistics(serviceRequests);
    } catch (error) {
        console.error('Error fetching service requests:', error);
        showErrorMessage("service-requests-body", "Failed to load service requests. Please try again later.");
    }
}

// Helper function to parse date from format "HH:MM:SS-DD/MM/YYYY"
function parseDate(dateStr) {
    if (!dateStr) return new Date(0);
    
    // Split the date string into time and date parts
    const [timePart, datePart] = dateStr.split('-');
    if (!timePart || !datePart) return new Date(0);
    
    // Parse time part (HH:MM:SS)
    const [hours, minutes, seconds] = timePart.split(':').map(Number);
    
    // Parse date part (DD/MM/YYYY)
    const [day, month, year] = datePart.split('/').map(Number);
    
    // Create a new Date object
    return new Date(year, month - 1, day, hours, minutes, seconds);
}

// Function to display service requests in the table
function displayServiceRequests(requests) {
    const tableBody = document.getElementById('service-requests-body');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';

    if (requests.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = '<td colspan="6" class="text-center">No service requests found</td>';
        tableBody.appendChild(emptyRow);
        return;
    }

    requests.forEach(request => {
        const row = document.createElement('tr');
        
        // Add background color based on status
        if (request.status === 'Pending') {
            row.classList.add('table-warning');
        } else if (request.status === 'Confirmed') {
            row.classList.add('table-success');
        }

        // Format service list as HTML
        const serviceListHtml = request.serviceList.map(service => 
            `<div>${service.serviceName} (x${service.quantity})</div>`
        ).join('');

        row.innerHTML = `
            <td>${request.customerName}</td>
            <td>${request.room}</td>
            <td>${serviceListHtml}</td>
            <td>${request.createdAt}</td>
            <td><span class="badge ${request.status === 'Pending' ? 'bg-warning' : 'bg-success'}">${request.status}</span></td>
            <td>
                <button class="btn btn-sm btn-info view-details" data-request='${JSON.stringify(request)}'>
                    <i class="bi bi-eye"></i> View
                </button>
                ${request.status === 'Pending' ? 
                    `<button class="btn btn-sm btn-success approve-request" data-request='${JSON.stringify(request)}'>
                        <i class="bi bi-check-circle"></i> Approve
                    </button>` : 
                    ''}
            </td>
        `;

        tableBody.appendChild(row);
    });

    // Add event listeners to view details buttons
    document.querySelectorAll('.view-details').forEach(button => {
        button.addEventListener('click', function() {
            const request = JSON.parse(this.getAttribute('data-request'));
            showRequestDetails(request);
        });
    });

    // Add event listeners to approve request buttons
    document.querySelectorAll('.approve-request').forEach(button => {
        button.addEventListener('click', function() {
            const request = JSON.parse(this.getAttribute('data-request'));
            approveRequest(request);
        });
    });
}

// Function to update statistics
function updateStatistics(requests) {
    const totalCount = requests.length;
    const pendingCount = requests.filter(request => request.status === 'Pending').length;
    const confirmedCount = requests.filter(request => request.status === 'Confirmed').length;

    const totalCountElement = document.getElementById('total-count');
    const pendingCountElement = document.getElementById('pending-count');
    const confirmedCountElement = document.getElementById('confirmed-count');
    
    if (totalCountElement) totalCountElement.textContent = totalCount;
    if (pendingCountElement) pendingCountElement.textContent = pendingCount;
    if (confirmedCountElement) confirmedCountElement.textContent = confirmedCount;
}

// Function to show request details in modal
function showRequestDetails(request) {
    const modalContent = document.getElementById('requestDetailsContent');
    if (!modalContent) return;
    
    // Store the selected request
    selectedRequest = request;
    
    // Format service list as HTML
    const serviceListHtml = request.serviceList.map(service => 
        `<div class="mb-2">
            <strong>${service.serviceName}</strong> - Quantity: ${service.quantity}
            <br>Price: $${service.serviceSellPrice.toLocaleString()} x ${service.quantity} = $${service.totalSellPrice.toLocaleString()}
        </div>`
    ).join('');

    modalContent.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <p><strong>Customer Name:</strong> ${request.customerName}</p>
                <p><strong>Room:</strong> ${request.room}</p>
                <p><strong>Created At:</strong> ${request.createdAt}</p>
                <p><strong>Status:</strong> <span class="badge ${request.status === 'Pending' ? 'bg-warning' : 'bg-success'}">${request.status}</span></p>
                <p><strong>Total Amount:</strong> $${request.totalAmount.toLocaleString()}</p>
            </div>
            <div class="col-md-6">
                <h6>Service List:</h6>
                ${serviceListHtml}
            </div>
        </div>
    `;

    // Show/hide approve button based on status
    const approveButton = document.getElementById('approveRequestBtn');
    if (approveButton) {
        if (request.status === 'Pending') {
            approveButton.style.display = 'block';
        } else {
            approveButton.style.display = 'none';
        }
    }

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('requestDetailsModal'));
    modal.show();
}

// Function to approve request
async function approveRequest(request) {
    try {
        // Prepare the request body according to the DTO format
        const bookingServiceIds = [];
        request.serviceList.forEach(service => {
            if (service.bookingServiceIds && service.bookingServiceIds.length > 0) {
                bookingServiceIds.push(...service.bookingServiceIds);
            }
        });

        const requestBody = {
            bookingId: request.bookingId,
            totalAmount: request.totalAmount,
            bookingServiceIds: bookingServiceIds
        };

        console.log('Approving request with data:', requestBody);

        const response = await fetch('http://localhost:5222/api/Package/ApproveServiceRequest', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error('Failed to approve request');
        }

        const result = await response.json();

        // Hiển thị thông báo thành công từ server (nếu có)
        alert(result.message || 'Request approved successfully!');

        // Đóng modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('requestDetailsModal'));
        if (modal) {
            modal.hide();
        }

        // Tải lại danh sách yêu cầu
        loadServiceRequests();

    } catch (error) {
        console.error('Error approving request:', error);
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

// Helper function to show error message
function showErrorMessage(elementId, message) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    element.innerHTML = `
        <tr>
            <td colspan="6" class="text-center text-danger">
                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                ${message}
            </td>
        </tr>
    `;
} 