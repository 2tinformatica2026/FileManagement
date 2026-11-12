using Microsoft.EntityFrameworkCore;
namespace FileManagement.Models
{
    public class AuthorizationDb : DbContext
    {
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            var builder = WebApplication.CreateBuilder();
            base.OnConfiguring(optionsBuilder.UseSqlServer(builder.Configuration.GetConnectionString("MainDb")));
        }
        public DbSet<Users_Documents> Users_Documents { get; set; }
    }
}
