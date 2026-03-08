using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace [Application Name].NorthwindDb
{
    [Table("SuppliersDocuments")]
    [PrimaryKey(nameof(DocumentType), nameof(SupplierID))]
    public class SuppliersDocuments
    {
        [Column("DocumentType")]
        public int DocumentType { get; set; }
        [Column("SupplierID")]
        public int SupplierID { get; set; }
        [Column("FileName")]
        public string FileName { get; set; } = string.Empty;
        [Column("MimeType")]
        public string MimeType { get; set; } = string.Empty;
        [Column("Buffer")]
        public byte[] Buffer { get; set; } = Array.Empty<byte>();
        [Column("filefootprint")]
        public string filefootprint { get; set; } = string.Empty;

    }
}
