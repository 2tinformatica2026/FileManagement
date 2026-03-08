USE [Suppliers]
GO

/****** Object:  Table [dbo].[Suppliers]    Script Date: 08/03/2026 18:30:25 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Suppliers](
	[SupplierID] [int] IDENTITY(1,1) NOT NULL,
	[CompanyName] [nvarchar](40) NOT NULL,
 CONSTRAINT [PK_Suppliers] PRIMARY KEY CLUSTERED 
(
	[SupplierID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

CREATE TABLE [dbo].[SuppliersDocumentsType](
	[DocumentType] [int] NOT NULL,
	[Description] [varchar](40) NOT NULL,
 CONSTRAINT [PK_SuppliersDocumentsType] PRIMARY KEY CLUSTERED 
(
	[DocumentType] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

CREATE TABLE [dbo].[SuppliersDocuments](
	[DocumentType] [int] NOT NULL,
	[SupplierID] [int] NOT NULL,
	[FileName] [varchar](1000) NOT NULL,
	[MimeType] [varchar](100) NOT NULL,
	[Buffer] [image] NOT NULL,
	[filefootprint] [varchar](44) NOT NULL,
 CONSTRAINT [PK_SuppliersDocuments_1] PRIMARY KEY CLUSTERED 
(
	[DocumentType] ASC,
	[SupplierID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

ALTER TABLE [dbo].[SuppliersDocuments]  WITH CHECK ADD  CONSTRAINT [FK_SuppliersDocuments_Suppliers] FOREIGN KEY([SupplierID])
REFERENCES [dbo].[Suppliers] ([SupplierID])
GO

ALTER TABLE [dbo].[SuppliersDocuments] CHECK CONSTRAINT [FK_SuppliersDocuments_Suppliers]
GO

ALTER TABLE [dbo].[SuppliersDocuments]  WITH CHECK ADD  CONSTRAINT [FK_SuppliersDocuments_SuppliersDocumentsType] FOREIGN KEY([DocumentType])
REFERENCES [dbo].[SuppliersDocumentsType] ([DocumentType])
GO

ALTER TABLE [dbo].[SuppliersDocuments] CHECK CONSTRAINT [FK_SuppliersDocuments_SuppliersDocumentsType]
GO

