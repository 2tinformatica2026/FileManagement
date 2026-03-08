using Microsoft.EntityFrameworkCore;

namespace [Application Name].SuppliersDb
{
    public class Database: DbContext
    {
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            var builder = WebApplication.CreateBuilder();
            base.OnConfiguring(optionsBuilder.UseSqlServer(builder.Configuration.GetConnectionString("SuppliersDb")));
        }
        public DbSet<SuppliersDocuments> suppliersDocuments { get; set; }
    }
}
