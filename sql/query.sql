-- Table: tbl_Guests
CREATE TABLE tbl_Guests (
    g_GuestID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    g_FirstName NVARCHAR(50) NOT NULL,
    g_LastName NVARCHAR(50) NOT NULL,
    g_Email NVARCHAR(100) UNIQUE,
    g_PhoneNumber NVARCHAR(15) NOT NULL
);
go
CREATE TABLE tbl_Floors (
    f_FloorID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    f_Floor NVARCHAR(10) NOT NULL
);
-- Table: tbl_Rooms
go
CREATE TABLE tbl_Rooms (
    r_RoomID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    r_RoomNumber NVARCHAR(10) UNIQUE NOT NULL,
    r_FloorID UNIQUEIDENTIFIER NOT NULL,
    r_RoomType NVARCHAR(50) NOT NULL,
    r_PricePerHour DECIMAL(10,2) NOT NULL,
    r_Status NVARCHAR(20) NOT NULL,
    FOREIGN KEY (r_FloorID) REFERENCES tbl_Floors(f_FloorID),
	CONSTRAINT chk_PricePerHour CHECK (r_PricePerHour >= 0),
    CONSTRAINT chk_RoomStatus CHECK (r_Status IN ('Available', 'Occupied'))
);
go
-- Table: tbl_Bookings
CREATE TABLE tbl_Bookings (
    b_BookingID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    b_GuestID UNIQUEIDENTIFIER NOT NULL,
    b_CheckInDate DATETIME NOT NULL,
    b_CheckOutDate DATETIME NOT NULL,
    b_BookingStatus NVARCHAR(20) NOT NULL,
	b_TotalMoney DECIMAL(10,2) DEFAULT 0,
	b_Deposit DECIMAL(10,2),
    b_CreatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (b_GuestID) REFERENCES tbl_Guests(g_GuestID),
	CONSTRAINT chk_CheckOutDate CHECK (b_CheckOutDate > b_CheckInDate)
);
go
-- Table: tbl_Payments
CREATE TABLE tbl_Payments (
    p_PaymentID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    p_BookingID UNIQUEIDENTIFIER NOT NULL,
    p_AmountPaid DECIMAL(10,2) NOT NULL,
    p_PaymentMethod NVARCHAR(50) NOT NULL,
	p_PaymentDate DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (p_BookingID) REFERENCES tbl_Bookings(b_BookingID)
);
go
-- Table: tbl_Employees
CREATE TABLE tbl_Employees (
    e_EmployeeID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    e_FirstName NVARCHAR(50) NOT NULL,
    e_LastName NVARCHAR(50) NOT NULL,
    e_Email NVARCHAR(100) UNIQUE NOT NULL,
    e_PhoneNumber NVARCHAR(15),
    e_Position NVARCHAR(50) NOT NULL,
    e_Salary DECIMAL(10,2) NOT NULL
);
go
-- Table: tbl_Services
CREATE TABLE tbl_Services (
    s_ServiceID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    s_ServiceName NVARCHAR(100) NOT NULL,
    s_ServiceCostPrice DECIMAL(10,2) NOT NULL,
	s_ServiceSellPrice DECIMAL(10,2) NOT NULL,
	CONSTRAINT chk_ServicePrice CHECK (s_ServiceSellPrice >= 0 AND s_ServiceCostPrice >= 0)
);
go
-- Table: tbl_BookingServices (For additional services booked)
CREATE TABLE tbl_BookingServices (                                       
	bs_BookingServicesID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    bs_BookingID UNIQUEIDENTIFIER NOT NULL,
    bs_ServiceID UNIQUEIDENTIFIER NOT NULL,
    bs_Quantity INT NOT NULL,
	bs_CreatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (bs_BookingID) REFERENCES tbl_Bookings(b_BookingID),
    FOREIGN KEY (bs_ServiceID) REFERENCES tbl_Services(s_ServiceID)
);

go
CREATE TABLE tbl_Partner (
    p_PartnerID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),  
    p_PartnerName NVARCHAR(255) NOT NULL,         
    p_PartnerType NVARCHAR(100),                  -- Type of partner (e.g., Travel Agency, Supplier...)
    p_PhoneNumber NVARCHAR(15) NOT NULL,                   
    p_Email NVARCHAR(255) UNIQUE,             
    p_Address NVARCHAR(50)                           
);
go
CREATE TABLE tbl_BookingRooms (
	br_BookingRoomsID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),  
    br_BookingID UNIQUEIDENTIFIER NOT NULL,
    br_RoomID UNIQUEIDENTIFIER NOT NULL,
    FOREIGN KEY (br_BookingID) REFERENCES tbl_Bookings(b_BookingID),
    FOREIGN KEY (br_RoomID) REFERENCES tbl_Rooms(r_RoomID)
);
go
CREATE TABLE tbl_Goods (
    g_GoodsID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),  
    g_GoodsName NVARCHAR(255) NOT NULL,         
    g_Category NVARCHAR(100),                   
    g_Quantity INT DEFAULT 0,                  
    g_Unit NVARCHAR(30),                        --a bottle, a case, a pack...
	g_CostPrice DECIMAL(10,2) NOT NULL,
	g_SellingPrice DECIMAL(10,2) NOT NULL,
	g_Currency NVARCHAR(30) NOT NULL                      ---- VND,USD                         
);
go
CREATE TABLE tbl_ServiceGoods (
	tsg_ServiceGoodsID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),  
    sg_ServiceID UNIQUEIDENTIFIER NOT NULL,
    sg_GoodsID UNIQUEIDENTIFIER NOT NULL,
    sg_Quantity INT NOT NULL,
    FOREIGN KEY (sg_ServiceID) REFERENCES tbl_Services(s_ServiceID),
    FOREIGN KEY (sg_GoodsID) REFERENCES tbl_Goods(g_GoodsID)
);
go
CREATE TABLE tbl_ImportGoods (
    ig_ImportID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),  
    ig_GoodsID UNIQUEIDENTIFIER NOT NULL,  
    ig_Quantity INT NOT NULL,  
    ig_CostPrice DECIMAL(10,2) NOT NULL,  
    ig_Currency NVARCHAR(30) NOT NULL,  
    ig_ImportDate DATETIME DEFAULT GETDATE(),  
    ig_Supplier NVARCHAR(200),  
    FOREIGN KEY (ig_GoodsID) REFERENCES tbl_Goods(g_GoodsID)
);
-------------------------------data
INSERT INTO tbl_Guests (g_FirstName, g_LastName, g_Email, g_PhoneNumber) VALUES
('John', 'Doe', 'johndoe@example.com', '0123456789'),
('Alice', 'Smith', 'alice.smith@example.com', '0987654321'),
('Robert', 'Brown', 'robert.brown@example.com', '0912345678'),
('Emily', 'Davis', 'emily.davis@example.com', '0965432109'),
('Michael', 'Wilson', 'michael.wilson@example.com', '0932109876');

INSERT INTO tbl_Floors (f_Floor) VALUES
('1'),
('2'),
('3'),
('4'),
('5');

INSERT INTO tbl_Rooms (r_RoomNumber, r_FloorID, r_RoomType, r_PricePerHour, r_Status) VALUES
('101', (SELECT f_FloorID FROM tbl_Floors WHERE f_Floor = '1'), 'Single', 100000, 'Available'),
('102', (SELECT f_FloorID FROM tbl_Floors WHERE f_Floor = '1'), 'Double', 150000, 'Occupied'),
('103', (SELECT f_FloorID FROM tbl_Floors WHERE f_Floor = '1'), 'Suite', 250000, 'Available'),
('104', (SELECT f_FloorID FROM tbl_Floors WHERE f_Floor = '1'), 'Single', 100000, 'Maintenance'),
('105', (SELECT f_FloorID FROM tbl_Floors WHERE f_Floor = '1'), 'Double', 150000, 'Available');

INSERT INTO tbl_Bookings (b_GuestID, b_CheckInDate, b_CheckOutDate, b_BookingStatus, b_TotalMoney, b_Deposit) VALUES
((SELECT g_GuestID FROM tbl_Guests WHERE g_FirstName = 'John'), '2025-03-01', '2025-03-03', 'Confirmed', 300000, 50000),
((SELECT g_GuestID FROM tbl_Guests WHERE g_FirstName = 'Alice'), '2025-03-02', '2025-03-05', 'Pending', 450000, 100000),
((SELECT g_GuestID FROM tbl_Guests WHERE g_FirstName = 'Robert'), '2025-03-03', '2025-03-07', 'Confirmed', 600000, 150000),
((SELECT g_GuestID FROM tbl_Guests WHERE g_FirstName = 'Emily'), '2025-03-04', '2025-03-06', 'Cancelled', 200000, 0),
((SELECT g_GuestID FROM tbl_Guests WHERE g_FirstName = 'Michael'), '2025-03-05', '2025-03-08', 'Confirmed', 500000, 100000);

INSERT INTO tbl_Payments (p_BookingID, p_AmountPaid, p_PaymentMethod) VALUES
((SELECT b_BookingID FROM tbl_Bookings WHERE b_TotalMoney = 300000), 50000, 'Credit Card'),
((SELECT b_BookingID FROM tbl_Bookings WHERE b_TotalMoney = 450000), 100000, 'Cash'),
((SELECT b_BookingID FROM tbl_Bookings WHERE b_TotalMoney = 600000), 200000, 'Bank Transfer'),
((SELECT b_BookingID FROM tbl_Bookings WHERE b_TotalMoney = 200000), 0, 'N/A'),
((SELECT b_BookingID FROM tbl_Bookings WHERE b_TotalMoney = 500000), 100000, 'Credit Card');

INSERT INTO tbl_Employees (e_FirstName, e_LastName, e_Email, e_PhoneNumber, e_Position, e_Salary) VALUES
('David', 'Lee', 'david.lee@example.com', '0123456789', 'Receptionist', 7000000),
('Sophia', 'White', 'sophia.white@example.com', '0987654321', 'Housekeeping', 6000000),
('Daniel', 'Taylor', 'daniel.taylor@example.com', '0912345678', 'Manager', 15000000),
('Olivia', 'Moore', 'olivia.moore@example.com', '0965432109', 'Security', 5000000),
('James', 'Harris', 'james.harris@example.com', '0932109876', 'Chef', 8000000);

INSERT INTO tbl_Services (s_ServiceName, s_ServiceCostPrice, s_ServiceSellPrice) VALUES
('Laundry', 50000, 70000),
('Room Cleaning', 30000, 50000),
('Breakfast', 60000, 90000),
('Airport Pickup', 100000, 150000),
('Spa', 150000, 200000);

INSERT INTO tbl_BookingServices (bs_BookingID, bs_ServiceID, bs_Quantity) VALUES
((SELECT b_BookingID FROM tbl_Bookings WHERE b_TotalMoney = 300000), (SELECT s_ServiceID FROM tbl_Services WHERE s_ServiceName = 'Laundry'), 1),
((SELECT b_BookingID FROM tbl_Bookings WHERE b_TotalMoney = 450000), (SELECT s_ServiceID FROM tbl_Services WHERE s_ServiceName = 'Room Cleaning'), 2),
((SELECT b_BookingID FROM tbl_Bookings WHERE b_TotalMoney = 600000), (SELECT s_ServiceID FROM tbl_Services WHERE s_ServiceName = 'Breakfast'), 1),
((SELECT b_BookingID FROM tbl_Bookings WHERE b_TotalMoney = 200000), (SELECT s_ServiceID FROM tbl_Services WHERE s_ServiceName = 'Airport Pickup'), 1),
((SELECT b_BookingID FROM tbl_Bookings WHERE b_TotalMoney = 500000), (SELECT s_ServiceID FROM tbl_Services WHERE s_ServiceName = 'Spa'), 1);

INSERT INTO tbl_Partner (p_PartnerName, p_PartnerType, p_PhoneNumber, p_Email, p_Address) VALUES
('ABC Travel', 'Travel Agency', '0123456789', 'abc.travel@example.com', 'Hanoi'),
('XYZ Suppliers', 'Supplier', '0987654321', 'xyz.supplier@example.com', 'Ho Chi Minh City'),
('Luxury Transport', 'Transport Service', '0912345678', 'luxury.transport@example.com', 'Da Nang'),
('Gourmet Catering', 'Food Supplier', '0965432109', 'gourmet.catering@example.com', 'Hue'),
('Wellness Spa', 'Wellness Services', '0932109876', 'wellness.spa@example.com', 'Nha Trang');

INSERT INTO tbl_BookingRooms (br_BookingID, br_RoomID) VALUES
((SELECT b_BookingID FROM tbl_Bookings WHERE b_TotalMoney = 300000), (SELECT r_RoomID FROM tbl_Rooms WHERE r_RoomNumber = '101')),
((SELECT b_BookingID FROM tbl_Bookings WHERE b_TotalMoney = 450000), (SELECT r_RoomID FROM tbl_Rooms WHERE r_RoomNumber = '102')),
((SELECT b_BookingID FROM tbl_Bookings WHERE b_TotalMoney = 600000), (SELECT r_RoomID FROM tbl_Rooms WHERE r_RoomNumber = '201')),
((SELECT b_BookingID FROM tbl_Bookings WHERE b_TotalMoney = 200000), (SELECT r_RoomID FROM tbl_Rooms WHERE r_RoomNumber = '301')),
((SELECT b_BookingID FROM tbl_Bookings WHERE b_TotalMoney = 500000), (SELECT r_RoomID FROM tbl_Rooms WHERE r_RoomNumber = '401'));


---------------------------------Procedure, Fuction, Trigger

--1) Nhan phong(finished)
go
CREATE PROCEDURE pro_check_in
    @BookingID UNIQUEIDENTIFIER
AS
BEGIN
    UPDATE tbl_Bookings
    SET b_BookingStatus = 'Checked In'
    WHERE b_BookingID = @BookingID;

    UPDATE tbl_Rooms
    SET r_Status = 'Occupied'
    WHERE r_RoomID IN (
        SELECT br_RoomID
        FROM tbl_BookingRooms
        WHERE br_BookingID = @BookingID
    );
END;
go
exec pro_check_in '6063325b-c01b-4e9d-8a8c-4a4e6dc0fd1b';
go
--2) Tra phong(finished)
CREATE PROCEDURE pro_check_out
    @BookingID UNIQUEIDENTIFIER,
    @PaymentMethod NVARCHAR(50)
AS
BEGIN
    DECLARE @TotalMoney DECIMAL(10,2);

    -- Sum from Booking
    SELECT @TotalMoney = b_TotalMoney
    FROM tbl_Bookings
    WHERE b_BookingID = @BookingID;

    -- Add to Payments
    INSERT INTO tbl_Payments (p_BookingID, p_AmountPaid, p_PaymentMethod)
    VALUES (@BookingID, @TotalMoney, @PaymentMethod);

    -- Update Booking to "Paid"
    UPDATE tbl_Bookings
    SET b_BookingStatus = 'Paid'
    WHERE b_BookingID = @BookingID;

    -- Update Room status to "Available"
    UPDATE tbl_Rooms
    SET r_Status = 'Available'
    WHERE r_RoomID IN (
        SELECT br_RoomID
        FROM tbl_BookingRooms
        WHERE br_BookingID = @BookingID
    );
END;
exec pro_check_out '6063325b-c01b-4e9d-8a8c-4a4e6dc0fd1b','cashhhhhh';
go
--3) edit service(finished)
CREATE PROCEDURE pro_edit_services
    @BookingID UNIQUEIDENTIFIER,
    @ServiceID UNIQUEIDENTIFIER,
    @Quantity INT
AS
BEGIN
    -- add to BookingServices
    INSERT INTO tbl_BookingServices (bs_BookingID, bs_ServiceID, bs_Quantity)
    VALUES (@BookingID, @ServiceID, @Quantity);
END;
go
select * from tbl_BookingServices
go
EXEC pro_edit_services '9A734537-0955-4A33-9277-1F572E7EE3BE', 'CFBD0209-8188-455E-9391-05FAAB388E87', 3;
--4)Find booking for index graph(finished)
GO
CREATE PROCEDURE pro_find_bookings
    @CheckInDate DATETIME,
    @CheckOutDate DATETIME,
    @Floor NVARCHAR(10)
AS
BEGIN
    -- FIND booking with date and floor
    SELECT DISTINCT b.*
    FROM tbl_Bookings b
    JOIN tbl_BookingRooms br ON b.b_BookingID = br.br_BookingID
    JOIN tbl_Rooms r ON br.br_RoomID = r.r_RoomID
    JOIN tbl_Floors f ON r.r_FloorID = f.f_FloorID
    WHERE 
        (b.b_CheckInDate BETWEEN @CheckInDate AND @CheckOutDate 
         OR b.b_CheckOutDate BETWEEN @CheckInDate AND @CheckOutDate)
        AND f.f_Floor = @Floor;
END;
GO
select * from tbl_Bookings
exec pro_find_bookings '2025-03-04 00:00:00.000','2025-03-05 00:00:00.000','1';
--5) Create User --hoac la dung curd
INSERT INTO tbl_Guests (g_FirstName, g_LastName, g_Email, g_PhoneNumber) 
VALUES ('Thanh', 'Le Xuan', 'xuanthanhle@gmail.com', '0988718567');
select * from tbl_Guests
--6) 
--7)
--8) dung curd
--9)
--10) dung curd
--11) dung curd
--12) 
--13)
--14) 
--15)
--16) 
--17)