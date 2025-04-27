using Microsoft.EntityFrameworkCore;
using SchoolWebApp.Models;

namespace SchoolWebApp.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }
        public DbSet<Institution> Institutions { get; set; }
        public DbSet<Zone> Zones { get; set; }
        public DbSet<CampusType> CampusTypes { get; set; }
        public DbSet<Campus> Campus { get; set; }
    }
}
