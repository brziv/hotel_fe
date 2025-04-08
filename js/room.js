// Fetch and display floors and rooms
async function fetchFloorsAndRooms() {
    try {
        const response = await fetch('http://localhost:5222/api/Room/GetFloorsWithRooms');
        const data = await response.json();

        if (data && data.data) {
            // Sắp xếp tầng theo thứ tự tăng dần
            const sortedFloors = [...data.data].sort((a, b) => {
                return parseInt(a.fFloor) - parseInt(b.fFloor);
            });

            displayFloors(sortedFloors);
            updateFloorFilters(sortedFloors);
        }
    } catch (error) {
        console.error('Error fetching floors and rooms:', error);
        showNotification('Error', 'Failed to fetch floors and rooms', 'error');
    }
}

function displayFloors(floors) {
    const floorList = document.getElementById('floorList');
    floorList.innerHTML = '';

    floors.forEach(floor => {
        const floorCard = createFloorCard(floor);
        floorList.appendChild(floorCard);
    });
}

function createFloorCard(floor) {
    const col = document.createElement('div');
    col.className = 'col-md-4 mb-4';

    // Sắp xếp các phòng theo thứ tự tăng dần của số phòng
    const sortedRooms = [...floor.rooms].sort((a, b) => {
        // Chuyển đổi số phòng thành số để so sánh
        const roomNumA = parseInt(a.roomNumber);
        const roomNumB = parseInt(b.roomNumber);
        return roomNumA - roomNumB;
    });

    col.innerHTML = `
                <div class="card floor-card">
                    <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                        <h5 class="card-title mb-0">Floor ${floor.fFloor}</h5>
                        <div class="action-buttons">
                            <button class="btn btn-sm btn-light" data-bs-toggle="modal" data-bs-target="#addRoomModal" onclick="setSelectedFloor('${floor.fFloorId}')">
                                <i class="fas fa-plus"></i>
                            </button>
                            <button class="btn btn-sm btn-danger" onclick="deleteFloor('${floor.fFloorId}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            ${sortedRooms.map(room => createRoomItem(room)).join('')}
                        </div>
                    </div>
                </div>
            `;

    return col;
}

function createRoomItem(room) {
    return `
                <div class="col-6 mb-2">
                    <div class="room-item p-2 rounded room-status-${room.status.toLowerCase()} position-relative">
                        <div class="room-actions">
                            <button class="btn btn-sm btn-danger" onclick="deleteRoom('${room.roomId}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                        <h6 class="mb-0">Room ${room.roomNumber}</h6>
                        <div class="room-details">
                            <small>${room.roomType}</small><br>
                            <small>$${room.pricePerHour}/hour</small><br>
                            <small>${room.status}</small>
                        </div>
                    </div>
                </div>
            `;
}

function updateFloorFilters(floors) {
    const floorFilter = document.getElementById('floorFilter');
    const roomFloor = document.getElementById('roomFloor');

    // Lọc tầng cho dropdown
    const floorOptions = floors.map(floor =>
        `<option value="${floor.fFloor}">Floor ${floor.fFloor}</option>`
    ).join('');

    // Lọc tầng cho modal add room (sử dụng floorId làm value)
    const floorOptionsForModal = floors.map(floor =>
        `<option value="${floor.fFloorId}">Floor ${floor.fFloor}</option>`
    ).join('');

    floorFilter.innerHTML = '<option value="">All Floors</option>' + floorOptions;
    roomFloor.innerHTML = floorOptionsForModal;
}

function setSelectedFloor(floorId) {
    // Cập nhật giá trị được chọn cho dropdown
    const roomFloor = document.getElementById('roomFloor');
    roomFloor.value = floorId;
}

// Filter functions
document.getElementById('floorFilter').addEventListener('change', filterRooms);
document.getElementById('statusFilter').addEventListener('change', filterRooms);

function filterRooms() {
    const selectedFloor = document.getElementById('floorFilter').value;
    const selectedStatus = document.getElementById('statusFilter').value;

    const rooms = document.querySelectorAll('.room-item');
    rooms.forEach(room => {
        const floor = room.closest('.floor-card').querySelector('.card-title').textContent.split(' ')[1];
        const status = room.querySelector('.room-details small:last-child').textContent;

        const floorMatch = !selectedFloor || floor === selectedFloor;
        const statusMatch = !selectedStatus || status === selectedStatus;

        room.closest('.col-6').style.display = floorMatch && statusMatch ? 'block' : 'none';
    });
}

// Custom notification function
function showNotification(title, message, type = 'success') {
    const notification = document.getElementById('customNotification');
    const icon = notification.querySelector('.notification-icon i');
    const titleElement = notification.querySelector('.notification-title');
    const messageElement = notification.querySelector('.notification-message');

    // Set notification content
    titleElement.textContent = title;
    messageElement.textContent = message;

    // Set notification type
    notification.className = 'custom-notification';
    if (type === 'success') {
        notification.classList.add('notification-success');
        icon.className = 'fas fa-check-circle';
    } else if (type === 'error') {
        notification.classList.add('notification-error');
        icon.className = 'fas fa-exclamation-circle';
    }

    // Show notification
    notification.style.display = 'block';

    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 2s ease-in forwards';
        setTimeout(() => {
            notification.style.display = 'none';
            notification.style.animation = '';
        }, 500);
    }, 3000);
}

// Initialize
document.addEventListener('DOMContentLoaded', function () {
    fetchFloorsAndRooms();

    // Reset form when modal is closed
    const addFloorModal = document.getElementById('addFloorModal');
    addFloorModal.addEventListener('hidden.bs.modal', function () {
        document.getElementById('floorNumber').value = '';
    });

    const addRoomModal = document.getElementById('addRoomModal');
    addRoomModal.addEventListener('hidden.bs.modal', function () {
        document.getElementById('roomNumber').value = '';
        document.getElementById('roomType').value = '';
        document.getElementById('pricePerHour').value = '';
    });
});

// CRUD functions
async function addFloor() {
    const floorNumber = document.getElementById('floorNumber').value;

    try {
        const response = await fetch(`http://localhost:5222/api/Room/AddFloor?floornum=${floorNumber}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 200 || response.status === 201) {
            showNotification('Success', 'Floor added successfully!', 'success');
            const addFloorModal = bootstrap.Modal.getInstance(document.getElementById('addFloorModal'));
            addFloorModal.hide();
            await fetchFloorsAndRooms(); // Refresh the list
        } else {
            try {
                const data = await response.json();
                showNotification('Error', 'Failed to add floor: ' + (data.message || 'Unknown error'), 'error');
            } catch (e) {
                showNotification('Error', 'Failed to add floor. Status: ' + response.status, 'error');
            }
        }
    } catch (error) {
        console.error('Error adding floor:', error);
        showNotification('Error', 'Error adding floor. Please try again.', 'error');
    }
}

async function addRoom() {
    const floorId = document.getElementById('roomFloor').value;
    const roomNumber = document.getElementById('roomNumber').value;
    const roomType = document.getElementById('roomType').value;
    const pricePerHour = document.getElementById('pricePerHour').value;

    try {
        const response = await fetch(`http://localhost:5222/api/Room/AddRoom?roomNumber=${roomNumber}&floorId=${floorId}&roomType=${roomType}&pricePerHour=${pricePerHour}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 200 || response.status === 201) {
            showNotification('Success', 'Room added successfully!', 'success');
            const addRoomModal = bootstrap.Modal.getInstance(document.getElementById('addRoomModal'));
            addRoomModal.hide();
            await fetchFloorsAndRooms(); // Refresh the list
        } else {
            try {
                const data = await response.json();
                showNotification('Error', 'Failed to add room: ' + (data.message || 'Unknown error'), 'error');
            } catch (e) {
                showNotification('Error', 'Failed to add room. Status: ' + response.status, 'error');
            }
        }
    } catch (error) {
        console.error('Error adding room:', error);
        showNotification('Error', 'Error adding room. Please try again.', 'error');
    }
}

async function deleteFloor(floorId) {
    if (confirm('Are you sure you want to delete this floor?')) {
        try {
            const response = await fetch(`http://localhost:5222/api/Room/DeleteFloor?floorId=${floorId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 204 || response.status === 200) {
                showNotification('Success', 'Floor deleted successfully!', 'success');
                await fetchFloorsAndRooms(); // Refresh the list
            } else {
                try {
                    const data = await response.json();
                    showNotification('Error', 'Failed to delete floor: ' + (data.message || 'Unknown error'), 'error');
                } catch (e) {
                    showNotification('Error', 'Failed to delete floor. Status: ' + response.status, 'error');
                }
            }
        } catch (error) {
            showNotification('Error', 'There are still rooms in floor. Please delete room fisrt.', 'error');
        }
    }
}

async function deleteRoom(roomId) {
    if (confirm('Are you sure you want to delete this room?')) {
        try {
            const response = await fetch(`http://localhost:5222/api/Room/DeleteRoom?roomId=${roomId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 204 || response.status === 200) {
                showNotification('Success', 'Room deleted successfully!', 'success');
                await fetchFloorsAndRooms(); // Refresh the list
            } else {

                if (response.status === 500) {
                    showNotification('Error', 'Không thể xóa phòng này vì nó đã được sử dụng trong các đặt phòng. Vui lòng xóa các đặt phòng liên quan trước.', 'error');
                } else {
                    try {
                        const data = await response.json();
                        showNotification('Error', 'Failed to delete room: ' + (data.message || 'Unknown error'), 'error');
                    } catch (e) {
                        showNotification('Error', 'Failed to delete room. Status: ' + response.status, 'error');
                    }
                }
            }
        } catch (error) {
            if (response.status === 500) {
                showNotification('Error', 'Không thể xóa phòng này vì nó đã được sử dụng trong các đặt phòng. Vui lòng xóa các đặt phòng liên quan trước.', 'error');
            } else {
                try {
                    const data = await response.json();
                    showNotification('Error', 'Failed to delete room: ' + (data.message || 'Unknown error'), 'error');
                } catch (e) {
                    showNotification('Error', 'Failed to delete room. Status: ' + response.status, 'error');
                }
            }

        }
    }
}