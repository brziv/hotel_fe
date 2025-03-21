# Hotel Management System

## Overview
The **Hotel Management System** is a web-based application designed to streamline hotel operations, including room booking, customer management, employee management, partner management, supply management, and service management. The system also features a room state view using a Gantt chart and generates reports to assist in decision-making.

## Features
- **Room Booking:**
  - Check available rooms
  - Book immediately or prebook
- **Customer Management:**
  - Add, edit, delete, and view customer information
- **Employee Management:**
  - Manage employee data (CRUD operations)
- **Partner Management:**
  - Maintain partner information
- **Supply Management:**
  - Manage goods, import stock, and view import history
- **Service Management:**
  - Create and manage services containing multiple goods
- **Room State Management:**
  - Visualize room states using a Gantt chart
  - Perform check-in, check-out, service booking, and payment
- **Reports:**
  - Generate reports based on weekly, monthly, or yearly data
- **User Role Management:**
  - Three roles: Admin, Staff, and User
  - Role-based access control using JWT and Entity Framework Identity

## User Roles and Permissions
- **Admin:** Access to all functions.
- **Staff:** Access to booking, customer management, and supply management.
- **User:** Access to room booking only.

## Technologies Used
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** ASP.NET WebAPI
- **Database:** SQL Server
- **Libraries and Frameworks:**
  - Bootstrap for responsive design
  - Google Charts for data visualization
- **Testing:**
  - Swagger UI for API documentation and testing
  - Postman for endpoint verification
- **Version Control:** Git and GitHub

## Installation
### Backend (ASP.NET WebAPI)
1. Clone the backend repository:
    ```bash
    git clone https://github.com/brziv/hotel_be
    ```
2. Restore dependencies using the following command:
    ```bash
    dotnet restore
    ```
3. Start the backend API using Visual Studio (press the green **Run** button) or with:
    ```bash
    dotnet run
    ```

### Frontend (HTML, CSS, JavaScript)
1. Clone the frontend repository:
    ```bash
    git clone https://github.com/brziv/hotel_fe
    ```
2. Open `index.html` in a browser or use a local server (e.g., Live Server for Visual Studio Code).  
3. Ensure the API is running and update API endpoint URLs in the JavaScript files if necessary.  


## Future Plans
- Implement report generation.
- Enhance Gantt chart interactions.
- Add additional authentication and authorization features.
