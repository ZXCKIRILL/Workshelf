using System;
using System.Collections.Generic;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace Backend.Data;

public partial class AppDbContext : DbContext
{
    public AppDbContext()
    {
    }

    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<AuditLog> AuditLogs { get; set; }

    public virtual DbSet<Department> Departments { get; set; }

    public virtual DbSet<Notification> Notifications { get; set; }

    public virtual DbSet<Models.Task> Tasks { get; set; }

    public virtual DbSet<TaskAssignment> TaskAssignments { get; set; }

    public virtual DbSet<TaskComment> TaskComments { get; set; }

    public virtual DbSet<TaskFile> TaskFiles { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<UserProfile> UserProfiles { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseNpgsql("Host=localhost;Database=xxx;Username=postgres;Password=424242");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AuditLog>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("audit_logs_pkey");

            entity.Property(e => e.Timestamp).HasDefaultValueSql("now()");

            entity.HasOne(d => d.User).WithMany(p => p.AuditLogs).HasConstraintName("audit_logs_user_id_fkey");
        });

        modelBuilder.Entity<Department>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("departments_pkey");
        });

        modelBuilder.Entity<Notification>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("notifications_pkey");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("now()");
            entity.Property(e => e.IsRead).HasDefaultValue(false);

            entity.HasOne(d => d.User).WithMany(p => p.Notifications).HasConstraintName("notifications_user_id_fkey");
        });

        modelBuilder.Entity<Models.Task>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("tasks_pkey");

            entity.Property(e => e.Priority).HasDefaultValue(1);
            entity.Property(e => e.Status).HasDefaultValueSql("'NotReady'::character varying");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.Tasks).HasConstraintName("tasks_created_by_fkey");
        });

        modelBuilder.Entity<TaskAssignment>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("task_assignments_pkey");

            entity.Property(e => e.AssignedAt).HasDefaultValueSql("now()");

            entity.HasOne(d => d.Executor).WithMany(p => p.TaskAssignments).HasConstraintName("task_assignments_executor_id_fkey");

            entity.HasOne(d => d.Task).WithMany(p => p.TaskAssignments).HasConstraintName("task_assignments_task_id_fkey");
        });

        modelBuilder.Entity<TaskComment>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("task_comments_pkey");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("now()");

            entity.HasOne(d => d.Task).WithMany(p => p.TaskComments).HasConstraintName("task_comments_task_id_fkey");

            entity.HasOne(d => d.User).WithMany(p => p.TaskComments).HasConstraintName("task_comments_user_id_fkey");
        });

        modelBuilder.Entity<TaskFile>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("task_files_pkey");

            entity.Property(e => e.UploadedAt).HasDefaultValueSql("now()");

            entity.HasOne(d => d.Task).WithMany(p => p.TaskFiles).HasConstraintName("task_files_task_id_fkey");

            entity.HasOne(d => d.UploadedByNavigation).WithMany(p => p.TaskFiles).HasConstraintName("task_files_uploaded_by_fkey");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("users_pkey");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("now()");
        });

        modelBuilder.Entity<UserProfile>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("user_profiles_pkey");

            entity.HasOne(d => d.Department).WithMany(p => p.UserProfiles).HasConstraintName("user_profiles_department_id_fkey");

            entity.HasOne(d => d.User).WithMany(p => p.UserProfiles).HasConstraintName("user_profiles_user_id_fkey");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
