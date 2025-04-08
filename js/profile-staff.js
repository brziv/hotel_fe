// Check if user is logged in
document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    loadProfile();

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

// Load user profile data
async function loadProfile() {
    try {
        const userId = localStorage.getItem('userId');

        // API endpoints
        let apiUrl = `http://localhost:5222/api/Employee/GetEmployeeByUserId?userId=${userId}`;

        const response = await fetch(apiUrl, {
            headers: {
            }
        });

        if (!response.ok) {
            throw new Error('Failed to load profile data');
        }

        const data = await response.json();

        // Staff profile
        const employee = data.data;
        document.getElementById('profile-name').textContent = `${employee.eFirstName} ${employee.eLastName}`;
        document.getElementById('first-name').textContent = employee.eFirstName;
        document.getElementById('last-name').textContent = employee.eLastName;
        document.getElementById('email').textContent = employee.eEmail;
        document.getElementById('phone').textContent = employee.ePhoneNumber;
        document.getElementById('profile-email').textContent = employee.eEmail;
        document.getElementById('profile-phone').textContent = employee.ePhoneNumber;
        document.getElementById('employee-position').textContent = employee.ePosition;
        document.getElementById('employee-salary').textContent = `$${employee.eSalary}`;

        // Set profile initial
        document.getElementById('profile-initial').textContent = (employee.eFirstName[0] || '') + (employee.eLastName[0] || '');

    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

// Update user profile
async function updateProfile() {
    try {
        const firstName = document.getElementById('edit-first-name').value;
        const lastName = document.getElementById('edit-last-name').value;
        const email = document.getElementById('edit-email').value;
        const phone = document.getElementById('edit-phone').value;

        let apiUrl, requestBody;

        // Update employee profile
        apiUrl = 'http://localhost:5222/api/Employee/UpdateTblEmployee';
        requestBody = {
            eEmployeeId: localStorage.getItem('userId'),
            eFirstName: firstName,
            eLastName: lastName,
            eEmail: email,
            ePhoneNumber: phone,
            // Preserve other fields
            ePosition: document.getElementById('employee-position').textContent,
            eSalary: parseFloat(document.getElementById('employee-salary').textContent.replace(/[^\d.]/g, ''))
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
        const username = localStorage.getItem('username');
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
                username: username,
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
