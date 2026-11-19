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
        public bool IsDuplicateKey(Exception? ex)
        {
            SqlException? mvarException = null;
            while (ex != null)
            {
                if (ex is SqlException sqlEx)
                {
                    mvarException = sqlEx;
                    break;
                }
                ex = ex.InnerException;
            }
            if (mvarException != null) return mvarException?.Number is 2627 or 2601;
            else return false;
        }
        public DbSet<Users_Documents> Users_Documents { get; set; }
    }
}
