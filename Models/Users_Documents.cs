using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace FileManagement.Database
{
    [Table("Users_Documents")]
    [PrimaryKey(nameof(Doc_Id),nameof(Doc_Type),nameof(User_Id))]
    public class Users_Documents
    {
        [Column("Doc_Id")]
        public int Doc_Id { get; set; }
        [Column("Doc_Type")]
        public int Doc_Type { get; set; }
        [Column("User_Id")]
        public int User_Id { get; set; }
        [Column("File_Buffer")]
        public byte[] File_Buffer { get; set; } = new byte[0];
        [Column("File_Name")]
        public string File_Name { get; set; } = string.Empty;
        [Column("Mime_Type")]
        public string Mime_Type { get; set; } = string .Empty;
    }
}
