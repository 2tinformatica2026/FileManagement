using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace FileManagement.Database
{
    [Table("Users_Documents")]
    [PrimaryKey(nameof(Doc_Id),nameof(Doc_Type),nameof(User_Id))]
    public class Users_Documents
    {
        public int Doc_Id { get; set; }
        public int Doc_Type { get; set; }
        public int User_Id { get; set; }
        public byte[] File_Buffer { get; set; } = new byte[0];
        public string File_Name { get; set; } = string.Empty;
        public string Mime_Type { get; set; } = string .Empty;
    }
}
