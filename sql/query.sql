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
    b_BookingStatus NVARCHAR(20) NOT NULL,--Pending, Confirmed, paid
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
    p_PaymentMethod NVARCHAR(50) NOT NULL,--cash, visa, 
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
	sg_ServiceGoodsID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),  
    sg_ServiceID UNIQUEIDENTIFIER NOT NULL,
    sg_GoodsID UNIQUEIDENTIFIER NOT NULL,
    sg_Quantity INT NOT NULL,
    FOREIGN KEY (sg_ServiceID) REFERENCES tbl_Services(s_ServiceID),
    FOREIGN KEY (sg_GoodsID) REFERENCES tbl_Goods(g_GoodsID)
);
go
CREATE TABLE tbl_ImportGoods (
    ig_ImportID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),   
    ig_SumPrice DECIMAL(10,2) NOT NULL,  
    ig_Currency NVARCHAR(30) NOT NULL,  
    ig_ImportDate DATETIME DEFAULT GETDATE(),  
    ig_Supplier NVARCHAR(200),  
);
go
CREATE TABLE tbl_ImportGoodsDetails (
    igd_ID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    igd_ImportID UNIQUEIDENTIFIER NOT NULL,
    igd_GoodsID UNIQUEIDENTIFIER NOT NULL,
    igd_Quantity INT NOT NULL,
    igd_CostPrice DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (igd_ImportID) REFERENCES tbl_ImportGoods(ig_ImportID),
    FOREIGN KEY (igd_GoodsID) REFERENCES tbl_Goods(g_GoodsID)
);


-------------------------------data
-- tbl_Guests
INSERT INTO tbl_Guests (g_FirstName, g_LastName, g_Email, g_PhoneNumber)
VALUES 
('John', 'Doe', 'john.doe@example.com', '123456789'),
('Jane', 'Smith', 'jane.smith@example.com', '987654321'),
('Alice', 'Brown', 'alice.brown@example.com', '555123456');

-- tbl_Floors
INSERT INTO tbl_Floors (f_Floor) 
VALUES 
('1'),
('2'),
('3');

-- tbl_Rooms
INSERT INTO tbl_Rooms (r_RoomNumber, r_FloorID, r_RoomType, r_PricePerHour, r_Status)
VALUES 
('101', (SELECT f_FloorID FROM tbl_Floors WHERE f_Floor = '1'), 'Standard', 50.00, 'Available'),
('102', (SELECT f_FloorID FROM tbl_Floors WHERE f_Floor = '1'), 'Deluxe', 80.00, 'Available'),
('301', (SELECT f_FloorID FROM tbl_Floors WHERE f_Floor = '3'), 'Suite', 120.00, 'Occupied');

-- tbl_Bookings
INSERT INTO tbl_Bookings (b_GuestID, b_CheckInDate, b_CheckOutDate, b_BookingStatus, b_TotalMoney, b_Deposit)
VALUES 
((SELECT g_GuestID FROM tbl_Guests WHERE g_Email = 'john.doe@example.com'), '2025-03-01', '2025-03-05', 'Confirmed', 200.00, 50.00),
((SELECT g_GuestID FROM tbl_Guests WHERE g_Email = 'jane.smith@example.com'), '2025-03-02', '2025-03-06', 'Pending', 320.00, 100.00),
((SELECT g_GuestID FROM tbl_Guests WHERE g_Email = 'alice.brown@example.com'), '2025-03-03', '2025-03-07', 'Paid', 480.00, 200.00);

-- tbl_Payments
INSERT INTO tbl_Payments (p_BookingID, p_AmountPaid, p_PaymentMethod)
VALUES 
((SELECT b_BookingID FROM tbl_Bookings WHERE b_TotalMoney = 200.00), 50.00, 'Cash'),
((SELECT b_BookingID FROM tbl_Bookings WHERE b_TotalMoney = 320.00), 100.00, 'Visa'),
((SELECT b_BookingID FROM tbl_Bookings WHERE b_TotalMoney = 480.00), 200.00, 'Cash');

-- tbl_Employees
INSERT INTO tbl_Employees (e_FirstName, e_LastName, e_Email, e_PhoneNumber, e_Position, e_Salary)
VALUES 
('Michael', 'Johnson', 'michael.j@example.com', '111222333', 'Manager', 1500.00),
('Emily', 'Davis', 'emily.d@example.com', '222333444', 'Receptionist', 800.00),
('David', 'Wilson', 'david.w@example.com', '333444555', 'Housekeeping', 600.00);

-- tbl_Services
INSERT INTO tbl_Services (s_ServiceName, s_ServiceCostPrice, s_ServiceSellPrice)
VALUES 
('Laundry', 10.00, 15.00),
('Breakfast', 5.00, 10.00),
('Spa', 20.00, 30.00);

-- tbl_BookingServices
INSERT INTO tbl_BookingServices (bs_BookingID, bs_ServiceID, bs_Quantity)
VALUES 
((SELECT b_BookingID FROM tbl_Bookings WHERE b_TotalMoney = 200.00), (SELECT s_ServiceID FROM tbl_Services WHERE s_ServiceName = 'Laundry'), 2),
((SELECT b_BookingID FROM tbl_Bookings WHERE b_TotalMoney = 320.00), (SELECT s_ServiceID FROM tbl_Services WHERE s_ServiceName = 'Breakfast'), 3),
((SELECT b_BookingID FROM tbl_Bookings WHERE b_TotalMoney = 480.00), (SELECT s_ServiceID FROM tbl_Services WHERE s_ServiceName = 'Spa'), 1);

-- tbl_Partner
INSERT INTO tbl_Partner (p_PartnerName, p_PartnerType, p_PhoneNumber, p_Email, p_Address)
VALUES 
('ABC Travel Agency', 'Travel Agency', '123123123', 'contact@abctravel.com', '123 Main St'),
('XYZ Suppliers', 'Supplier', '456456456', 'info@xyzsuppliers.com', '456 Market St'),
('Luxury Car Rentals', 'Car Rental', '789789789', 'support@luxurycarrentals.com', '789 Auto St');

-- tbl_BookingRooms
INSERT INTO tbl_BookingRooms (br_BookingID, br_RoomID)
VALUES 
((SELECT b_BookingID FROM tbl_Bookings WHERE b_TotalMoney = 200.00), (SELECT r_RoomID FROM tbl_Rooms WHERE r_RoomNumber = '101')),
((SELECT b_BookingID FROM tbl_Bookings WHERE b_TotalMoney = 320.00), (SELECT r_RoomID FROM tbl_Rooms WHERE r_RoomNumber = '102')),
((SELECT b_BookingID FROM tbl_Bookings WHERE b_TotalMoney = 480.00), (SELECT r_RoomID FROM tbl_Rooms WHERE r_RoomNumber = '301'));

-- tbl_Goods
INSERT INTO tbl_Goods (g_GoodsName, g_Category, g_Quantity, g_Unit, g_CostPrice, g_SellingPrice, g_Currency)
VALUES 
('Shampoo', 'Toiletries', 100, 'Bottle', 2.00, 5.00, 'VND'),
('Towel', 'Linen', 50, 'Piece', 10.00, 20.00, 'VND'),
('Water Bottle', 'Beverages', 200, 'Bottle', 1.00, 3.00, 'VND');

-- tbl_ServiceGoods
INSERT INTO tbl_ServiceGoods (sg_ServiceID, sg_GoodsID, sg_Quantity)
VALUES 
((SELECT s_ServiceID FROM tbl_Services WHERE s_ServiceName = 'Laundry'), (SELECT g_GoodsID FROM tbl_Goods WHERE g_GoodsName = 'Shampoo'), 2),
((SELECT s_ServiceID FROM tbl_Services WHERE s_ServiceName = 'Breakfast'), (SELECT g_GoodsID FROM tbl_Goods WHERE g_GoodsName = 'Water Bottle'), 3),
((SELECT s_ServiceID FROM tbl_Services WHERE s_ServiceName = 'Spa'), (SELECT g_GoodsID FROM tbl_Goods WHERE g_GoodsName = 'Towel'), 1);

-- tbl_ImportGoods
INSERT INTO tbl_ImportGoods (ig_SumPrice, ig_Currency, ig_Supplier)
VALUES 
(500.00, 'VND', 'XYZ Suppliers'),
(300.00, 'VND', 'ABC Travel Agency'),
(700.00, 'VND', 'Luxury Car Rentals');

-- tbl_ImportGoodsDetails
INSERT INTO tbl_ImportGoodsDetails (igd_ImportID, igd_GoodsID, igd_Quantity, igd_CostPrice)
VALUES 
((SELECT ig_ImportID FROM tbl_ImportGoods WHERE ig_Supplier = 'XYZ Suppliers'), (SELECT g_GoodsID FROM tbl_Goods WHERE g_GoodsName = 'Shampoo'), 50, 2.00),
((SELECT ig_ImportID FROM tbl_ImportGoods WHERE ig_Supplier = 'ABC Travel Agency'), (SELECT g_GoodsID FROM tbl_Goods WHERE g_GoodsName = 'Water Bottle'), 100, 1.00),
((SELECT ig_ImportID FROM tbl_ImportGoods WHERE ig_Supplier = 'Luxury Car Rentals'), (SELECT g_GoodsID FROM tbl_Goods WHERE g_GoodsName = 'Towel'), 30, 10.00);


---------------------------------Procedure, Fuction, Trigger

--1) Nhan phong(finished)
go
CREATE or alter PROCEDURE pro_check_in
    @BookingID UNIQUEIDENTIFIER
AS
BEGIN
    UPDATE tbl_Bookings
    SET b_BookingStatus = 'Confirmed'
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
CREATE or alter PROCEDURE pro_check_out
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
CREATE or alter PROCEDURE pro_edit_services
    @BookingID UNIQUEIDENTIFIER,
    @ServiceID UNIQUEIDENTIFIER,
    @Quantity INT
AS
BEGIN
    DECLARE @ServicePrice DECIMAL(10,2);

    -- take service sell price
    SELECT @ServicePrice = s_ServiceSellPrice 
    FROM tbl_Services 
    WHERE s_ServiceID = @ServiceID;

    -- add to bookingservices
    INSERT INTO tbl_BookingServices (bs_BookingID, bs_ServiceID, bs_Quantity)
    VALUES (@BookingID, @ServiceID, @Quantity);

    -- update totalmoney in bookings
    UPDATE tbl_Bookings
    SET b_TotalMoney = b_TotalMoney + (@ServicePrice * @Quantity)
    WHERE b_BookingID = @BookingID;
END;
go
select * from tbl_BookingServices
go
EXEC pro_edit_services '9A734537-0955-4A33-9277-1F572E7EE3BE', 'CFBD0209-8188-455E-9391-05FAAB388E87', 3;
--4)Find booking for index graph(finished)
GO
CREATE or alter PROCEDURE pro_find_bookings
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
        (@CheckInDate < b.b_CheckOutDate AND @CheckOutDate > b.b_CheckInDate)
        AND f.f_Floor = @Floor;
END;
GO
select * from tbl_Bookings
exec pro_find_bookings '2025-03-04 00:00:00.000','2025-03-05 00:00:00.000','1';
--5) Create User --hoac la dung curd
INSERT INTO tbl_Guests (g_FirstName, g_LastName, g_Email, g_PhoneNumber) 
VALUES ('Thanh', 'Le Xuan', 'xuanthanhle@gmail.com', '0988718567');
select * from tbl_Guests
--6) Find emty rooms(Room is available 1 hour after previous guest checked out)
go
alter PROCEDURE pro_FindAvailableRooms
    @CheckInDate DATETIME,
    @CheckOutDate DATETIME
AS
BEGIN
    -- find rooms are occupied
    WITH BookedRooms AS (
        SELECT DISTINCT br.br_RoomID
        FROM tbl_Bookings b
        JOIN tbl_BookingRooms br ON b.b_BookingID = br.br_BookingID
        WHERE 
            (@CheckInDate < DATEADD(HOUR, 1, b.b_CheckOutDate)  AND @CheckOutDate > b.b_CheckInDate) 
    )
    
    -- get room list not occupied
    SELECT r.r_RoomID, r.r_RoomNumber, r.r_RoomType, r.r_PricePerHour
    FROM tbl_Rooms r
    WHERE r.r_RoomID NOT IN (SELECT br_RoomID FROM BookedRooms)
END;
go
select b_CheckInDate,b_CheckOutDate, r_RoomNumber from tbl_Bookings
join tbl_BookingRooms on b_BookingID=br_BookingID
join tbl_Rooms on br_RoomID = r_RoomID
go
EXEC pro_FindAvailableRooms '2025-03-05 01:00:00.000', '2025-03-08 00:00:00.000';
go
--7.1)

--7.2)
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