// Check if user is logged in
document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    loadProfile();
    loadBookingHistory();

    // Set role badge
    const badgeElement = document.getElementById('role-badge');
    badgeElement.textContent = role;
    if (role === 'User') {
        badgeElement.classList.add('role-user');
    } else if (role === 'Staff') {
        badgeElement.classList.add('role-staff');
    }
});

// Toggle edit profile form
document.getElementById('edit-profile-btn').addEventListener('click', function () {
    document.getElementById('info-display').classList.add('hidden');
    document.getElementById('info-edit').classList.remove('hidden');

    // Populate form with current values
    document.getElementById('edit-first-name').value = document.getElementById('first-name').textContent;
    document.getElementById('edit-last-name').value = document.getElementById('last-name').textContent;
    document.getElementById('edit-email').value = document.getElementById('email').textContent;
    document.getElementById('edit-phone').value = document.getElementById('phone').textContent;
});

document.getElementById('cancel-edit-btn').addEventListener('click', function () {
    document.getElementById('info-display').classList.remove('hidden');
    document.getElementById('info-edit').classList.add('hidden');
});

// Toggle password change form
document.getElementById('change-password-btn').addEventListener('click', function () {
    document.getElementById('password-form').classList.remove('hidden');
    document.getElementById('change-password-btn').classList.add('hidden');
});

document.getElementById('cancel-password-btn').addEventListener('click', function () {
    document.getElementById('password-form').classList.add('hidden');
    document.getElementById('change-password-btn').classList.remove('hidden');
});

// Handle profile form submission
document.getElementById('edit-profile-form').addEventListener('submit', function (e) {
    e.preventDefault();
    updateProfile();
});

// Handle password form submission
document.getElementById('change-password-form').addEventListener('submit', function (e) {
    e.preventDefault();
    changePassword();
});

// Booking filter functionality
document.querySelectorAll('#booking-filters button').forEach(button => {
    button.addEventListener('click', function () {
        // Remove active class from all buttons
        document.querySelectorAll('#booking-filters button').forEach(btn => {
            btn.classList.remove('active');
        });

        // Add active class to clicked button
        this.classList.add('active');

        // Get filter type
        const filterType = this.getAttribute('data-filter');
        filterBookings(filterType);
    });
});

// Load user profile data
async function loadProfile() {
    try {
        const userId = localStorage.getItem('userId');

        // API endpoints
        let apiUrl = `http://localhost:5222/api/Guest/GetGuestByUserId?userId=${userId}`;

        const response = await fetch(apiUrl, {
        });

        if (!response.ok) {
            throw new Error('Failed to load profile data');
        }

        const data = await response.json();

        // Customer profile
        const guest = data.data;
        document.getElementById('profile-name').textContent = `${guest.gFirstName} ${guest.gLastName}`;
        document.getElementById('first-name').textContent = guest.gFirstName;
        document.getElementById('last-name').textContent = guest.gLastName;
        document.getElementById('email').textContent = guest.gEmail;
        document.getElementById('phone').textContent = guest.gPhoneNumber;
        document.getElementById('profile-email').textContent = guest.gEmail;
        document.getElementById('profile-phone').textContent = guest.gPhoneNumber;

        // Set profile initial
        document.getElementById('profile-initial').textContent = (guest.gFirstName[0] || '') + (guest.gLastName[0] || '');
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

// Load booking history for customers
async function loadBookingHistory() {
    try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        const response = await fetch(`http://localhost:5222/api/Booking/GetBookingsByUserId?userId=${userId}`, {
            headers: {
            }
        });

        if (!response.ok) {
            throw new Error('Failed to load booking history');
        }

        const bookings = await response.json();

        // Sort bookings by check-in date (newest first)
        bookings.sort((a, b) => new Date(b.checkInDate) - new Date(a.checkInDate));

        if (bookings.length === 0) {
            document.getElementById('bookings-container').innerHTML = `
                        <div class="text-center py-5">
                            <i class="bi bi-calendar-x" style="font-size: 48px; color: #ddd;"></i>
                            <p class="mt-3">You don't have any bookings yet.</p>
                            <a href="booking-user.html" class="btn btn-primary mt-2">Make a Booking</a>
                        </div>
                    `;
            return;
        }

        // Render bookings
        const bookingsHTML = bookings.map(booking => {
            const checkInDate = new Date(booking.checkInDate);
            const checkOutDate = new Date(booking.checkOutDate);

            // Determine status class
            let statusClass = '';
            switch (booking.bookingStatus) {
                case 'Pending':
                    statusClass = 'status-pending';
                    break;
                case 'Confirmed':
                    statusClass = 'status-confirmed';
                    break;
                case 'Paid':
                    statusClass = 'status-paid';
                    break;
                case 'Cancelled':
                    statusClass = 'status-cancelled';
                    break;
            }

            return `
                        <div class="booking-card" data-status="${booking.bookingStatus.toLowerCase()}">
                            <div class="booking-header">
                                <div class="booking-room">Room ${booking.roomNumber}</div>
                                <div class="booking-status ${statusClass}">${booking.bookingStatus}</div>
                            </div>
                            <div class="booking-date">
                                <div>
                                    <span class="date-label">Check In</span>
                                    <span class="date-value">${checkInDate.toLocaleString()}</span>
                                </div>
                                <div>
                                    <span class="date-label">Check Out</span>
                                    <span class="date-value">${checkOutDate.toLocaleString()}</span>
                                </div>
                            </div>
                            <div class="booking-price">
                                <div>
                                    <span class="date-label">Deposit</span>
                                    <span class="date-value">$${booking.deposit}</span>
                                </div>
                                <div>
                                    <span class="date-label">Total</span>
                                    <span class="date-value">$${booking.totalMoney}</span>
                                </div>
                            </div>
                        </div>
                    `;
        }).join('');

        document.getElementById('bookings-container').innerHTML = bookingsHTML;

    } catch (error) {
        console.error('Error loading booking history:', error);
        document.getElementById('bookings-container').innerHTML = `
                    <div class="alert alert-danger">
                        Failed to load booking history. Please try again later.
                    </div>
                `;
    }
}

// Update user profile
async function updateProfile() {
    try {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        const firstName = document.getElementById('edit-first-name').value;
        const lastName = document.getElementById('edit-last-name').value;
        const email = document.getElementById('edit-email').value;
        const phone = document.getElementById('edit-phone').value;

        let apiUrl, requestBody;

        // Update guest profile
        apiUrl = 'http://localhost:5222/api/Guest/UpdateGuestProfile';
        requestBody = {
            gGuestId: localStorage.getItem('userId'),
            gFirstName: firstName,
            gLastName: lastName,
            gEmail: email,
            gPhoneNumber: phone
        };

        const response = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error('Failed to update profile');
        }

        // Update displayed info
        document.getElementById('first-name').textContent = firstName;
        document.getElementById('last-name').textContent = lastName;
        document.getElementById('email').textContent = email;
        document.getElementById('phone').textContent = phone;
        document.getElementById('profile-name').textContent = `${firstName} ${lastName}`;
        document.getElementById('profile-email').textContent = email;
        document.getElementById('profile-phone').textContent = phone;
        document.getElementById('profile-initial').textContent = (firstName[0] || '') + (lastName[0] || '');

        // Hide edit form
        document.getElementById('info-display').classList.remove('hidden');
        document.getElementById('info-edit').classList.add('hidden');

        alert('Profile updated successfully!');

    } catch (error) {
        console.error('Error updating profile:', error);
        alert('Failed to update profile. Please try again.');
    }
}

// Change password
async function changePassword() {
    try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (newPassword !== confirmPassword) {
            alert('New passwords do not match');
            return;
        }

        const response = await fetch('http://localhost:5222/api/Auth/ChangePassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: userId,
                currentPassword: currentPassword,
                newPassword: newPassword
            })
        });

        const data = await response.json();

        if (data.code === 100) {
            alert('Password changed successfully!');
            document.getElementById('password-form').classList.add('hidden');
            document.getElementById('change-password-btn').classList.remove('hidden');
            document.getElementById('change-password-form').reset();
        } else {
            alert(data.msg || 'Failed to change password');
        }

    } catch (error) {
        console.error('Error changing password:', error);
        alert('Failed to change password. Please try again.');
    }
}

// Filter bookings based on status
function filterBookings(filterType) {
    const bookingCards = document.querySelectorAll('.booking-card');

    bookingCards.forEach(card => {
        const status = card.getAttribute('data-status');

        if (filterType === 'all') {
            card.style.display = 'block';
        } else if (filterType === 'pending' && status === 'pending') {
            card.style.display = 'block';
        } else if (filterType === 'confirmed' && (status === 'confirmed')) {
            card.style.display = 'block';
        } else if (filterType === 'paid' && status === 'paid') {
            card.style.display = 'block';
        } else if (filterType === 'cancelled' && status === 'cancelled') {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}