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
        public DbSet<Campus> Campuses { get; set; }
        public DbSet<Country> Countries { get; set; }
        public DbSet<State> States { get; set; }
        public DbSet<City> Cities { get; set; }
        public DbSet<CampusBoardingType> CampusBoardingTypes { get; set; }
        public DbSet<BoardingTypes> BoardingTypes { get; set; }
        public DbSet<Board> Boards { get; set; }
        public DbSet<ClassStage> ClassStages { get; set; }
        public DbSet<MasterClass> MasterClasses { get; set; }
        public DbSet<Class> Classes { get; set; }
        public DbSet<ClassRoom> ClassRooms { get; set; }
        public DbSet<CourseBatch> CourseBatches { get; set; }
        public DbSet<AcademicYear> AcademicYears { get; set; }
    }
}
