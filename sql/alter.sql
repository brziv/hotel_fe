-- Rename tables and columns for better clarity and consistency
EXEC sp_rename 'tbl_Goods', 'tbl_Products';

EXEC sp_rename 'tbl_Products.g_GoodsID', 'p_ProductID', 'COLUMN';
EXEC sp_rename 'tbl_Products.g_GoodsName', 'p_ProductName', 'COLUMN';
EXEC sp_rename 'tbl_Products.g_Category', 'p_Category', 'COLUMN';
EXEC sp_rename 'tbl_Products.g_Quantity', 'p_Quantity', 'COLUMN';
EXEC sp_rename 'tbl_Products.g_Unit', 'p_Unit', 'COLUMN';
EXEC sp_rename 'tbl_Products.g_CostPrice', 'p_CostPrice', 'COLUMN';
EXEC sp_rename 'tbl_Products.g_SellingPrice', 'p_SellingPrice', 'COLUMN';
EXEC sp_rename 'tbl_Products.g_Currency', 'p_Currency', 'COLUMN';

EXEC sp_rename 'tbl_Services', 'tbl_ServicePackages';

EXEC sp_rename 'tbl_ServicePackages.s_ServiceID', 'sp_PackageID', 'COLUMN';
EXEC sp_rename 'tbl_ServicePackages.s_ServiceName', 'sp_PackageName', 'COLUMN';

EXEC sp_rename 'tbl_ServiceGoods', 'tbl_PackageDetails';

EXEC sp_rename 'tbl_PackageDetails.sg_ServiceGoodsID', 'pd_DetailID', 'COLUMN';
EXEC sp_rename 'tbl_PackageDetails.sg_ServiceID', 'pd_PackageID', 'COLUMN';
EXEC sp_rename 'tbl_PackageDetails.sg_GoodsID', 'pd_ProductID', 'COLUMN';
EXEC sp_rename 'tbl_PackageDetails.sg_Quantity', 'pd_Quantity', 'COLUMN';

EXEC sp_rename 'tbl_BookingServices.bs_BookingServicesID', 'bs_ID', 'COLUMN';
EXEC sp_rename 'tbl_BookingRooms.br_BookingRoomsID', 'br_ID', 'COLUMN';

ALTER TABLE tbl_Products
ADD p_IsService BIT DEFAULT 0; -- 0 for goods, 1 for services

ALTER TABLE tbl_BookingServices
ADD bs_Status nvarchar(20) DEFAULT 'Pending';

-- Add a new column to track the user who created the record
ALTER TABLE [dbo].[tbl_Guests]
ADD [g_UserId] [nvarchar](450) NULL;

ALTER TABLE [dbo].[tbl_Guests]
ADD CONSTRAINT [FK_tbl_Guests_AspNetUsers] 
FOREIGN KEY ([g_UserId]) 
REFERENCES [dbo].[AspNetUsers] ([Id]);

ALTER TABLE [dbo].[tbl_Employees]
ADD [e_UserId] [nvarchar](450) NULL;

ALTER TABLE [dbo].[tbl_Employees]
ADD CONSTRAINT [FK_tbl_Employees_AspNetUsers] 
FOREIGN KEY ([e_UserId]) 
REFERENCES [dbo].[AspNetUsers] ([Id]);
