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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
 //Map Campus entity
            modelBuilder.Entity<Campus>().ToTable("Campuses");
            modelBuilder.Entity<Campus>().Property(c => c.CampuseName).HasColumnName("CampuseName");
            modelBuilder.Entity<Campus>().Property(c => c.CampusTypeID).HasColumnName("CampusTypeID");

            // Map CampusType entity
            modelBuilder.Entity<CampusType>().ToTable("CampusTypes");
            modelBuilder.Entity<CampusType>().Property(ct => ct.CampusTypeName).HasColumnName("CampusTypeName");

            // Map Institution entity
            modelBuilder.Entity<Institution>().ToTable("Institutions");

            // Map Zone entity
            modelBuilder.Entity<Zone>().ToTable("Zones");

            // Define foreign key relationships for Campus
            modelBuilder.Entity<Campus>()
                .HasOne(c => c.CampusType)
               .WithMany()
                .HasForeignKey(c => c.CampusTypeID)
                .HasConstraintName("FK_Campuses_CampusTypes");

            modelBuilder.Entity<Campus>()
                .HasOne(c => c.Institution)
                .WithMany()
                .HasForeignKey(c => c.InstitutionID)
                .HasConstraintName("FK_Campuses_Institutions");

            modelBuilder.Entity<Campus>()
                .HasOne(c => c.Zone)
                .WithMany()
                .HasForeignKey(c => c.ZoneID)
                .HasConstraintName("FK_Campuses_Zones");
        }
    }
    }
