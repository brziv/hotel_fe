USE [master]
GO
/****** Object:  Database [N9_NHOM4]    Script Date: 4/9/2025 2:42:51 PM ******/
CREATE DATABASE [N9_NHOM4]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'N9_NHOM4', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL13.MRDBOFFLINE\MSSQL\DATA\N9_NHOM4.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'N9_NHOM4_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL13.MRDBOFFLINE\MSSQL\DATA\N9_NHOM4_log.ldf' , SIZE = 73728KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
GO
ALTER DATABASE [N9_NHOM4] SET COMPATIBILITY_LEVEL = 130
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [N9_NHOM4].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [N9_NHOM4] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [N9_NHOM4] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [N9_NHOM4] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [N9_NHOM4] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [N9_NHOM4] SET ARITHABORT OFF 
GO
ALTER DATABASE [N9_NHOM4] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [N9_NHOM4] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [N9_NHOM4] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [N9_NHOM4] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [N9_NHOM4] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [N9_NHOM4] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [N9_NHOM4] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [N9_NHOM4] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [N9_NHOM4] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [N9_NHOM4] SET  ENABLE_BROKER 
GO
ALTER DATABASE [N9_NHOM4] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [N9_NHOM4] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [N9_NHOM4] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [N9_NHOM4] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [N9_NHOM4] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [N9_NHOM4] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [N9_NHOM4] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [N9_NHOM4] SET RECOVERY FULL 
GO
ALTER DATABASE [N9_NHOM4] SET  MULTI_USER 
GO
ALTER DATABASE [N9_NHOM4] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [N9_NHOM4] SET DB_CHAINING OFF 
GO
ALTER DATABASE [N9_NHOM4] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [N9_NHOM4] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [N9_NHOM4] SET DELAYED_DURABILITY = DISABLED 
GO
EXEC sys.sp_db_vardecimal_storage_format N'N9_NHOM4', N'ON'
GO
ALTER DATABASE [N9_NHOM4] SET QUERY_STORE = OFF
GO
USE [N9_NHOM4]
GO
ALTER DATABASE SCOPED CONFIGURATION SET LEGACY_CARDINALITY_ESTIMATION = OFF;
GO
ALTER DATABASE SCOPED CONFIGURATION SET MAXDOP = 0;
GO
ALTER DATABASE SCOPED CONFIGURATION SET PARAMETER_SNIFFING = ON;
GO
ALTER DATABASE SCOPED CONFIGURATION SET QUERY_OPTIMIZER_HOTFIXES = OFF;
GO
USE [N9_NHOM4]
GO
/****** Object:  User [cmcsv]    Script Date: 4/9/2025 2:42:51 PM ******/
CREATE USER [cmcsv] FOR LOGIN [cmcsv] WITH DEFAULT_SCHEMA=[dbo]
GO
ALTER ROLE [db_owner] ADD MEMBER [cmcsv]
GO
/****** Object:  Table [dbo].[__EFMigrationsHistory]    Script Date: 4/9/2025 2:42:51 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[__EFMigrationsHistory](
	[MigrationId] [nvarchar](150) NOT NULL,
	[ProductVersion] [nvarchar](32) NOT NULL,
 CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY CLUSTERED 
(
	[MigrationId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[AspNetRoleClaims]    Script Date: 4/9/2025 2:42:51 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AspNetRoleClaims](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[RoleId] [nvarchar](450) NOT NULL,
	[ClaimType] [nvarchar](max) NULL,
	[ClaimValue] [nvarchar](max) NULL,
 CONSTRAINT [PK_AspNetRoleClaims] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[AspNetRoles]    Script Date: 4/9/2025 2:42:51 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AspNetRoles](
	[Id] [nvarchar](450) NOT NULL,
	[Name] [nvarchar](256) NULL,
	[NormalizedName] [nvarchar](256) NULL,
	[ConcurrencyStamp] [nvarchar](max) NULL,
 CONSTRAINT [PK_AspNetRoles] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[AspNetUserClaims]    Script Date: 4/9/2025 2:42:51 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AspNetUserClaims](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [nvarchar](450) NOT NULL,
	[ClaimType] [nvarchar](max) NULL,
	[ClaimValue] [nvarchar](max) NULL,
 CONSTRAINT [PK_AspNetUserClaims] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[AspNetUserLogins]    Script Date: 4/9/2025 2:42:51 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AspNetUserLogins](
	[LoginProvider] [nvarchar](450) NOT NULL,
	[ProviderKey] [nvarchar](450) NOT NULL,
	[ProviderDisplayName] [nvarchar](max) NULL,
	[UserId] [nvarchar](450) NOT NULL,
 CONSTRAINT [PK_AspNetUserLogins] PRIMARY KEY CLUSTERED 
(
	[LoginProvider] ASC,
	[ProviderKey] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[AspNetUserRoles]    Script Date: 4/9/2025 2:42:51 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AspNetUserRoles](
	[UserId] [nvarchar](450) NOT NULL,
	[RoleId] [nvarchar](450) NOT NULL,
 CONSTRAINT [PK_AspNetUserRoles] PRIMARY KEY CLUSTERED 
(
	[UserId] ASC,
	[RoleId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[AspNetUsers]    Script Date: 4/9/2025 2:42:51 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AspNetUsers](
	[Id] [nvarchar](450) NOT NULL,
	[UserName] [nvarchar](256) NULL,
	[NormalizedUserName] [nvarchar](256) NULL,
	[Email] [nvarchar](256) NULL,
	[NormalizedEmail] [nvarchar](256) NULL,
	[EmailConfirmed] [bit] NOT NULL,
	[PasswordHash] [nvarchar](max) NULL,
	[SecurityStamp] [nvarchar](max) NULL,
	[ConcurrencyStamp] [nvarchar](max) NULL,
	[PhoneNumber] [nvarchar](max) NULL,
	[PhoneNumberConfirmed] [bit] NOT NULL,
	[TwoFactorEnabled] [bit] NOT NULL,
	[LockoutEnd] [datetimeoffset](7) NULL,
	[LockoutEnabled] [bit] NOT NULL,
	[AccessFailedCount] [int] NOT NULL,
 CONSTRAINT [PK_AspNetUsers] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[AspNetUserTokens]    Script Date: 4/9/2025 2:42:51 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AspNetUserTokens](
	[UserId] [nvarchar](450) NOT NULL,
	[LoginProvider] [nvarchar](450) NOT NULL,
	[Name] [nvarchar](450) NOT NULL,
	[Value] [nvarchar](max) NULL,
 CONSTRAINT [PK_AspNetUserTokens] PRIMARY KEY CLUSTERED 
(
	[UserId] ASC,
	[LoginProvider] ASC,
	[Name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tbl_BookingRooms]    Script Date: 4/9/2025 2:42:51 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tbl_BookingRooms](
	[br_ID] [uniqueidentifier] NOT NULL,
	[br_BookingID] [uniqueidentifier] NOT NULL,
	[br_RoomID] [uniqueidentifier] NOT NULL,
	[br_CheckInDate] [datetime] NOT NULL,
	[br_CheckOutDate] [datetime] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[br_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tbl_Bookings]    Script Date: 4/9/2025 2:42:51 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tbl_Bookings](
	[b_BookingID] [uniqueidentifier] NOT NULL,
	[b_GuestID] [uniqueidentifier] NOT NULL,
	[b_BookingStatus] [nvarchar](20) NOT NULL,
	[b_TotalMoney] [decimal](10, 2) NULL,
	[b_Deposit] [decimal](10, 2) NULL,
	[b_CreatedAt] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[b_BookingID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tbl_BookingServices]    Script Date: 4/9/2025 2:42:51 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tbl_BookingServices](
	[bs_ID] [uniqueidentifier] NOT NULL,
	[bs_BookingID] [uniqueidentifier] NOT NULL,
	[bs_ServiceID] [uniqueidentifier] NOT NULL,
	[bs_Quantity] [int] NOT NULL,
	[bs_CreatedAt] [datetime] NULL,
	[bs_Status] [nvarchar](20) NULL,
PRIMARY KEY CLUSTERED 
(
	[bs_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tbl_Employees]    Script Date: 4/9/2025 2:42:51 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tbl_Employees](
	[e_EmployeeID] [uniqueidentifier] NOT NULL,
	[e_FirstName] [nvarchar](50) NOT NULL,
	[e_LastName] [nvarchar](50) NOT NULL,
	[e_Email] [nvarchar](100) NOT NULL,
	[e_PhoneNumber] [nvarchar](15) NULL,
	[e_Position] [nvarchar](50) NOT NULL,
	[e_Salary] [decimal](10, 2) NOT NULL,
	[e_UserId] [nvarchar](450) NULL,
PRIMARY KEY CLUSTERED 
(
	[e_EmployeeID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[e_Email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tbl_Floors]    Script Date: 4/9/2025 2:42:51 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tbl_Floors](
	[f_FloorID] [uniqueidentifier] NOT NULL,
	[f_Floor] [nvarchar](10) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[f_FloorID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tbl_Guests]    Script Date: 4/9/2025 2:42:51 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tbl_Guests](
	[g_GuestID] [uniqueidentifier] NOT NULL,
	[g_FirstName] [nvarchar](50) NOT NULL,
	[g_LastName] [nvarchar](50) NOT NULL,
	[g_Email] [nvarchar](100) NULL,
	[g_PhoneNumber] [nvarchar](15) NOT NULL,
	[g_UserId] [nvarchar](450) NULL,
PRIMARY KEY CLUSTERED 
(
	[g_GuestID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tbl_ImportGoods]    Script Date: 4/9/2025 2:42:51 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tbl_ImportGoods](
	[ig_ImportID] [uniqueidentifier] NOT NULL,
	[ig_SumPrice] [decimal](10, 2) NOT NULL,
	[ig_Currency] [nvarchar](30) NOT NULL,
	[ig_ImportDate] [datetime] NULL,
	[ig_Supplier] [nvarchar](200) NULL,
PRIMARY KEY CLUSTERED 
(
	[ig_ImportID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tbl_ImportGoodsDetails]    Script Date: 4/9/2025 2:42:51 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tbl_ImportGoodsDetails](
	[igd_ID] [uniqueidentifier] NOT NULL,
	[igd_ImportID] [uniqueidentifier] NOT NULL,
	[igd_GoodsID] [uniqueidentifier] NOT NULL,
	[igd_Quantity] [int] NOT NULL,
	[igd_CostPrice] [decimal](10, 2) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[igd_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tbl_PackageDetails]    Script Date: 4/9/2025 2:42:51 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tbl_PackageDetails](
	[pd_DetailID] [uniqueidentifier] NOT NULL,
	[pd_PackageID] [uniqueidentifier] NOT NULL,
	[pd_ProductID] [uniqueidentifier] NOT NULL,
	[pd_Quantity] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[pd_DetailID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tbl_Partner]    Script Date: 4/9/2025 2:42:51 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tbl_Partner](
	[p_PartnerID] [uniqueidentifier] NOT NULL,
	[p_PartnerName] [nvarchar](255) NOT NULL,
	[p_PartnerType] [nvarchar](100) NULL,
	[p_PhoneNumber] [nvarchar](15) NOT NULL,
	[p_Email] [nvarchar](255) NULL,
	[p_Address] [nvarchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[p_PartnerID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[p_Email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tbl_Payments]    Script Date: 4/9/2025 2:42:51 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tbl_Payments](
	[p_PaymentID] [uniqueidentifier] NOT NULL,
	[p_BookingID] [uniqueidentifier] NOT NULL,
	[p_AmountPaid] [decimal](10, 2) NOT NULL,
	[p_PaymentMethod] [nvarchar](50) NOT NULL,
	[p_PaymentDate] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[p_PaymentID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tbl_Products]    Script Date: 4/9/2025 2:42:51 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tbl_Products](
	[p_ProductID] [uniqueidentifier] NOT NULL,
	[p_ProductName] [nvarchar](255) NOT NULL,
	[p_Category] [nvarchar](100) NULL,
	[p_Quantity] [int] NULL,
	[p_Unit] [nvarchar](30) NULL,
	[p_CostPrice] [decimal](10, 2) NOT NULL,
	[p_SellingPrice] [decimal](10, 2) NOT NULL,
	[p_Currency] [nvarchar](30) NOT NULL,
	[p_IsService] [bit] NULL,
	[IsActive] [bit] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[p_ProductID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tbl_Rooms]    Script Date: 4/9/2025 2:42:51 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tbl_Rooms](
	[r_RoomID] [uniqueidentifier] NOT NULL,
	[r_RoomNumber] [nvarchar](10) NOT NULL,
	[r_FloorID] [uniqueidentifier] NOT NULL,
	[r_RoomType] [nvarchar](50) NOT NULL,
	[r_PricePerHour] [decimal](10, 2) NOT NULL,
	[r_Status] [nvarchar](20) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[r_RoomID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[r_RoomNumber] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tbl_ServicePackages]    Script Date: 4/9/2025 2:42:51 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tbl_ServicePackages](
	[sp_PackageID] [uniqueidentifier] NOT NULL,
	[sp_PackageName] [nvarchar](100) NOT NULL,
	[s_ServiceCostPrice] [decimal](10, 2) NOT NULL,
	[s_ServiceSellPrice] [decimal](10, 2) NOT NULL,
	[IsActive] [bit] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[sp_PackageID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_AspNetRoleClaims_RoleId]    Script Date: 4/9/2025 2:42:51 PM ******/
CREATE NONCLUSTERED INDEX [IX_AspNetRoleClaims_RoleId] ON [dbo].[AspNetRoleClaims]
(
	[RoleId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [RoleNameIndex]    Script Date: 4/9/2025 2:42:51 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [RoleNameIndex] ON [dbo].[AspNetRoles]
(
	[NormalizedName] ASC
)
WHERE ([NormalizedName] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_AspNetUserClaims_UserId]    Script Date: 4/9/2025 2:42:51 PM ******/
CREATE NONCLUSTERED INDEX [IX_AspNetUserClaims_UserId] ON [dbo].[AspNetUserClaims]
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_AspNetUserLogins_UserId]    Script Date: 4/9/2025 2:42:51 PM ******/
CREATE NONCLUSTERED INDEX [IX_AspNetUserLogins_UserId] ON [dbo].[AspNetUserLogins]
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_AspNetUserRoles_RoleId]    Script Date: 4/9/2025 2:42:51 PM ******/
CREATE NONCLUSTERED INDEX [IX_AspNetUserRoles_RoleId] ON [dbo].[AspNetUserRoles]
(
	[RoleId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [EmailIndex]    Script Date: 4/9/2025 2:42:51 PM ******/
CREATE NONCLUSTERED INDEX [EmailIndex] ON [dbo].[AspNetUsers]
(
	[NormalizedEmail] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UserNameIndex]    Script Date: 4/9/2025 2:42:51 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [UserNameIndex] ON [dbo].[AspNetUsers]
(
	[NormalizedUserName] ASC
)
WHERE ([NormalizedUserName] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_BookingRooms_BookingID]    Script Date: 4/9/2025 2:42:51 PM ******/
CREATE NONCLUSTERED INDEX [IX_BookingRooms_BookingID] ON [dbo].[tbl_BookingRooms]
(
	[br_BookingID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_BookingRooms_CheckInDate]    Script Date: 4/9/2025 2:42:51 PM ******/
CREATE NONCLUSTERED INDEX [IX_BookingRooms_CheckInDate] ON [dbo].[tbl_BookingRooms]
(
	[br_CheckInDate] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_BookingRooms_CheckOutDate]    Script Date: 4/9/2025 2:42:51 PM ******/
CREATE NONCLUSTERED INDEX [IX_BookingRooms_CheckOutDate] ON [dbo].[tbl_BookingRooms]
(
	[br_CheckOutDate] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_BookingRooms_RoomID]    Script Date: 4/9/2025 2:42:51 PM ******/
CREATE NONCLUSTERED INDEX [IX_BookingRooms_RoomID] ON [dbo].[tbl_BookingRooms]
(
	[br_RoomID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_Bookings_GuestID]    Script Date: 4/9/2025 2:42:51 PM ******/
CREATE NONCLUSTERED INDEX [IX_Bookings_GuestID] ON [dbo].[tbl_Bookings]
(
	[b_GuestID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_BookingServices_BookingID]    Script Date: 4/9/2025 2:42:51 PM ******/
CREATE NONCLUSTERED INDEX [IX_BookingServices_BookingID] ON [dbo].[tbl_BookingServices]
(
	[bs_BookingID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_BookingServices_CreatedAt]    Script Date: 4/9/2025 2:42:51 PM ******/
CREATE NONCLUSTERED INDEX [IX_BookingServices_CreatedAt] ON [dbo].[tbl_BookingServices]
(
	[bs_CreatedAt] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_BookingServices_ServiceID]    Script Date: 4/9/2025 2:42:51 PM ******/
CREATE NONCLUSTERED INDEX [IX_BookingServices_ServiceID] ON [dbo].[tbl_BookingServices]
(
	[bs_ServiceID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_Floors_Floor]    Script Date: 4/9/2025 2:42:51 PM ******/
CREATE NONCLUSTERED INDEX [IX_Floors_Floor] ON [dbo].[tbl_Floors]
(
	[f_Floor] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_ImportGoods_ImportDate]    Script Date: 4/9/2025 2:42:51 PM ******/
CREATE NONCLUSTERED INDEX [IX_ImportGoods_ImportDate] ON [dbo].[tbl_ImportGoods]
(
	[ig_ImportDate] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_Rooms_FloorID]    Script Date: 4/9/2025 2:42:51 PM ******/
CREATE NONCLUSTERED INDEX [IX_Rooms_FloorID] ON [dbo].[tbl_Rooms]
(
	[r_FloorID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[tbl_BookingRooms] ADD  DEFAULT (newid()) FOR [br_ID]
GO
ALTER TABLE [dbo].[tbl_Bookings] ADD  DEFAULT (newid()) FOR [b_BookingID]
GO
ALTER TABLE [dbo].[tbl_Bookings] ADD  DEFAULT ((0)) FOR [b_TotalMoney]
GO
ALTER TABLE [dbo].[tbl_Bookings] ADD  DEFAULT (getdate()) FOR [b_CreatedAt]
GO
ALTER TABLE [dbo].[tbl_BookingServices] ADD  DEFAULT (newid()) FOR [bs_ID]
GO
ALTER TABLE [dbo].[tbl_BookingServices] ADD  DEFAULT (getdate()) FOR [bs_CreatedAt]
GO
ALTER TABLE [dbo].[tbl_BookingServices] ADD  DEFAULT ('Pending') FOR [bs_Status]
GO
ALTER TABLE [dbo].[tbl_Employees] ADD  DEFAULT (newid()) FOR [e_EmployeeID]
GO
ALTER TABLE [dbo].[tbl_Floors] ADD  DEFAULT (newid()) FOR [f_FloorID]
GO
ALTER TABLE [dbo].[tbl_Guests] ADD  DEFAULT (newid()) FOR [g_GuestID]
GO
ALTER TABLE [dbo].[tbl_ImportGoods] ADD  DEFAULT (newid()) FOR [ig_ImportID]
GO
ALTER TABLE [dbo].[tbl_ImportGoods] ADD  DEFAULT (getdate()) FOR [ig_ImportDate]
GO
ALTER TABLE [dbo].[tbl_ImportGoodsDetails] ADD  DEFAULT (newid()) FOR [igd_ID]
GO
ALTER TABLE [dbo].[tbl_PackageDetails] ADD  DEFAULT (newid()) FOR [pd_DetailID]
GO
ALTER TABLE [dbo].[tbl_Partner] ADD  DEFAULT (newid()) FOR [p_PartnerID]
GO
ALTER TABLE [dbo].[tbl_Payments] ADD  DEFAULT (newid()) FOR [p_PaymentID]
GO
ALTER TABLE [dbo].[tbl_Payments] ADD  DEFAULT (getdate()) FOR [p_PaymentDate]
GO
ALTER TABLE [dbo].[tbl_Products] ADD  DEFAULT (newid()) FOR [p_ProductID]
GO
ALTER TABLE [dbo].[tbl_Products] ADD  DEFAULT ((0)) FOR [p_Quantity]
GO
ALTER TABLE [dbo].[tbl_Products] ADD  DEFAULT ((0)) FOR [p_IsService]
GO
ALTER TABLE [dbo].[tbl_Products] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[tbl_Rooms] ADD  DEFAULT (newid()) FOR [r_RoomID]
GO
ALTER TABLE [dbo].[tbl_ServicePackages] ADD  DEFAULT (newid()) FOR [sp_PackageID]
GO
ALTER TABLE [dbo].[tbl_ServicePackages] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[AspNetRoleClaims]  WITH NOCHECK ADD  CONSTRAINT [FK_AspNetRoleClaims_AspNetRoles_RoleId] FOREIGN KEY([RoleId])
REFERENCES [dbo].[AspNetRoles] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[AspNetRoleClaims] CHECK CONSTRAINT [FK_AspNetRoleClaims_AspNetRoles_RoleId]
GO
ALTER TABLE [dbo].[AspNetUserClaims]  WITH NOCHECK ADD  CONSTRAINT [FK_AspNetUserClaims_AspNetUsers_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[AspNetUsers] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[AspNetUserClaims] CHECK CONSTRAINT [FK_AspNetUserClaims_AspNetUsers_UserId]
GO
ALTER TABLE [dbo].[AspNetUserLogins]  WITH NOCHECK ADD  CONSTRAINT [FK_AspNetUserLogins_AspNetUsers_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[AspNetUsers] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[AspNetUserLogins] CHECK CONSTRAINT [FK_AspNetUserLogins_AspNetUsers_UserId]
GO
ALTER TABLE [dbo].[AspNetUserRoles]  WITH NOCHECK ADD  CONSTRAINT [FK_AspNetUserRoles_AspNetRoles_RoleId] FOREIGN KEY([RoleId])
REFERENCES [dbo].[AspNetRoles] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[AspNetUserRoles] CHECK CONSTRAINT [FK_AspNetUserRoles_AspNetRoles_RoleId]
GO
ALTER TABLE [dbo].[AspNetUserRoles]  WITH NOCHECK ADD  CONSTRAINT [FK_AspNetUserRoles_AspNetUsers_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[AspNetUsers] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[AspNetUserRoles] CHECK CONSTRAINT [FK_AspNetUserRoles_AspNetUsers_UserId]
GO
ALTER TABLE [dbo].[AspNetUserTokens]  WITH NOCHECK ADD  CONSTRAINT [FK_AspNetUserTokens_AspNetUsers_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[AspNetUsers] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[AspNetUserTokens] CHECK CONSTRAINT [FK_AspNetUserTokens_AspNetUsers_UserId]
GO
ALTER TABLE [dbo].[tbl_BookingRooms]  WITH NOCHECK ADD FOREIGN KEY([br_BookingID])
REFERENCES [dbo].[tbl_Bookings] ([b_BookingID])
GO
ALTER TABLE [dbo].[tbl_BookingRooms]  WITH NOCHECK ADD FOREIGN KEY([br_RoomID])
REFERENCES [dbo].[tbl_Rooms] ([r_RoomID])
GO
ALTER TABLE [dbo].[tbl_Bookings]  WITH NOCHECK ADD FOREIGN KEY([b_GuestID])
REFERENCES [dbo].[tbl_Guests] ([g_GuestID])
GO
ALTER TABLE [dbo].[tbl_BookingServices]  WITH NOCHECK ADD FOREIGN KEY([bs_BookingID])
REFERENCES [dbo].[tbl_Bookings] ([b_BookingID])
GO
ALTER TABLE [dbo].[tbl_BookingServices]  WITH NOCHECK ADD FOREIGN KEY([bs_ServiceID])
REFERENCES [dbo].[tbl_ServicePackages] ([sp_PackageID])
GO
ALTER TABLE [dbo].[tbl_Employees]  WITH CHECK ADD  CONSTRAINT [FK_tbl_Employees_AspNetUsers] FOREIGN KEY([e_UserId])
REFERENCES [dbo].[AspNetUsers] ([Id])
GO
ALTER TABLE [dbo].[tbl_Employees] CHECK CONSTRAINT [FK_tbl_Employees_AspNetUsers]
GO
ALTER TABLE [dbo].[tbl_Guests]  WITH CHECK ADD  CONSTRAINT [FK_tbl_Guests_AspNetUsers] FOREIGN KEY([g_UserId])
REFERENCES [dbo].[AspNetUsers] ([Id])
GO
ALTER TABLE [dbo].[tbl_Guests] CHECK CONSTRAINT [FK_tbl_Guests_AspNetUsers]
GO
ALTER TABLE [dbo].[tbl_ImportGoodsDetails]  WITH NOCHECK ADD FOREIGN KEY([igd_GoodsID])
REFERENCES [dbo].[tbl_Products] ([p_ProductID])
GO
ALTER TABLE [dbo].[tbl_ImportGoodsDetails]  WITH NOCHECK ADD FOREIGN KEY([igd_ImportID])
REFERENCES [dbo].[tbl_ImportGoods] ([ig_ImportID])
GO
ALTER TABLE [dbo].[tbl_PackageDetails]  WITH NOCHECK ADD FOREIGN KEY([pd_ProductID])
REFERENCES [dbo].[tbl_Products] ([p_ProductID])
GO
ALTER TABLE [dbo].[tbl_PackageDetails]  WITH NOCHECK ADD FOREIGN KEY([pd_PackageID])
REFERENCES [dbo].[tbl_ServicePackages] ([sp_PackageID])
GO
ALTER TABLE [dbo].[tbl_Payments]  WITH NOCHECK ADD FOREIGN KEY([p_BookingID])
REFERENCES [dbo].[tbl_Bookings] ([b_BookingID])
GO
ALTER TABLE [dbo].[tbl_Rooms]  WITH NOCHECK ADD FOREIGN KEY([r_FloorID])
REFERENCES [dbo].[tbl_Floors] ([f_FloorID])
GO
ALTER TABLE [dbo].[tbl_BookingRooms]  WITH NOCHECK ADD  CONSTRAINT [chk_CheckOutDate] CHECK  (([br_CheckOutDate]>[br_CheckInDate]))
GO
ALTER TABLE [dbo].[tbl_BookingRooms] CHECK CONSTRAINT [chk_CheckOutDate]
GO
ALTER TABLE [dbo].[tbl_Rooms]  WITH NOCHECK ADD  CONSTRAINT [chk_PricePerHour] CHECK  (([r_PricePerHour]>=(0)))
GO
ALTER TABLE [dbo].[tbl_Rooms] CHECK CONSTRAINT [chk_PricePerHour]
GO
ALTER TABLE [dbo].[tbl_Rooms]  WITH NOCHECK ADD  CONSTRAINT [chk_RoomStatus] CHECK  (([r_Status]='Occupied' OR [r_Status]='Available'))
GO
ALTER TABLE [dbo].[tbl_Rooms] CHECK CONSTRAINT [chk_RoomStatus]
GO
ALTER TABLE [dbo].[tbl_ServicePackages]  WITH NOCHECK ADD  CONSTRAINT [chk_ServicePrice] CHECK  (([s_ServiceSellPrice]>=(0) AND [s_ServiceCostPrice]>=(0)))
GO
ALTER TABLE [dbo].[tbl_ServicePackages] CHECK CONSTRAINT [chk_ServicePrice]
GO
/****** Object:  StoredProcedure [dbo].[pro_cancel_booking]    Script Date: 4/9/2025 2:42:51 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[pro_cancel_booking]
    @BookingID UNIQUEIDENTIFIER,
    @PaymentMethod NVARCHAR(50),
    @Total DECIMAL(10,2) 
AS
BEGIN
    -- Update totalmoney = total
    UPDATE tbl_Bookings
    SET b_TotalMoney = @Total
    WHERE b_BookingID = @BookingID;

    -- Add to Payments
    INSERT INTO tbl_Payments (p_BookingID, p_AmountPaid, p_PaymentMethod)
    VALUES (@BookingID, @Total, @PaymentMethod);

    -- Update Booking to "Cancelled"
    UPDATE tbl_Bookings
    SET b_BookingStatus = 'Cancelled'
    WHERE b_BookingID = @BookingID;
END;
GO
/****** Object:  StoredProcedure [dbo].[pro_check_in]    Script Date: 4/9/2025 2:42:51 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--1) Check-in
CREATE PROCEDURE [dbo].[pro_check_in]
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

GO
/****** Object:  StoredProcedure [dbo].[pro_check_out]    Script Date: 4/9/2025 2:42:51 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[pro_check_out]
    @BookingID UNIQUEIDENTIFIER,
    @PaymentMethod NVARCHAR(50),
    @Total DECIMAL(10,2) 
AS
BEGIN
    -- update totalmoney = total
    UPDATE tbl_Bookings
    SET b_TotalMoney = @Total
    WHERE b_BookingID = @BookingID;

    -- Add to Payments
    INSERT INTO tbl_Payments (p_BookingID, p_AmountPaid, p_PaymentMethod)
    VALUES (@BookingID, @Total, @PaymentMethod);

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
GO
/****** Object:  StoredProcedure [dbo].[pro_edit_services]    Script Date: 4/9/2025 2:42:51 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

--3) Edit services
CREATE PROCEDURE [dbo].[pro_edit_services]
    @BookingID UNIQUEIDENTIFIER,
    @PackageID UNIQUEIDENTIFIER,
    @Quantity INT
AS
BEGIN
    DECLARE @ServicePrice DECIMAL(10,2);

    -- Get service sell price
    SELECT @ServicePrice = s_ServiceSellPrice 
    FROM tbl_ServicePackages 
    WHERE sp_PackageID = @PackageID;

    -- Add to booking services
    INSERT INTO tbl_BookingServices (bs_BookingID, bs_ServiceID, bs_Quantity)
    VALUES (@BookingID, @PackageID, @Quantity);

    -- Update total money in bookings
    UPDATE tbl_Bookings
    SET b_TotalMoney = b_TotalMoney + (@ServicePrice * @Quantity)
    WHERE b_BookingID = @BookingID;
END;

GO
/****** Object:  StoredProcedure [dbo].[pro_find_bookings]    Script Date: 4/9/2025 2:42:51 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

--4) Find bookings for index graph
CREATE PROCEDURE [dbo].[pro_find_bookings]
    @CheckInDate DATETIME,
    @CheckOutDate DATETIME,
    @Floor NVARCHAR(10)
AS
BEGIN
    SELECT r.*, b.*, br_CheckInDate, br_CheckOutDate
    FROM tbl_Bookings b
    JOIN tbl_BookingRooms br ON b.b_BookingID = br.br_BookingID
    JOIN tbl_Rooms r ON br.br_RoomID = r.r_RoomID
    JOIN tbl_Floors f ON r.r_FloorID = f.f_FloorID
    WHERE (@CheckInDate < br_CheckOutDate AND @CheckOutDate > br_CheckInDate)
        AND f.f_Floor = @Floor;
END;

GO
/****** Object:  StoredProcedure [dbo].[pro_FindAvailableRooms]    Script Date: 4/9/2025 2:42:51 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[pro_FindAvailableRooms]
    @CheckInDate DATETIME,
    @CheckOutDate DATETIME,
	@floor Nvarchar(10)
AS
BEGIN
    -- find rooms are occupied
    WITH BookedRooms AS (
    SELECT DISTINCT br.br_RoomID
    FROM tbl_Bookings b
    JOIN tbl_BookingRooms br ON b.b_BookingID = br.br_BookingID
	WHERE b.b_BookingStatus <> 'Cancel'
    AND (@CheckInDate < DATEADD(HOUR, 1, br.br_CheckOutDate) 
        AND @CheckOutDate > br.br_CheckInDate) 
	)
	SELECT r.r_RoomID, r.r_RoomNumber, f.f_Floor, r.r_RoomType, r.r_PricePerHour
	FROM tbl_Rooms r
	JOIN tbl_Floors f ON r.r_FloorID = f.f_FloorID
	WHERE r.r_RoomID NOT IN (SELECT br_RoomID FROM BookedRooms) 
	AND f.f_Floor = @floor;

END;
GO
USE [master]
GO
ALTER DATABASE [N9_NHOM4] SET  READ_WRITE 
GO
