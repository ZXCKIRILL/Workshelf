using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Backend.Models;

[Table("task_assignments")]
public partial class TaskAssignment
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("task_id")]
    public int TaskId { get; set; }

    [Column("executor_id")]
    public int ExecutorId { get; set; }

    [Column("assigned_at", TypeName = "timestamp without time zone")]
    public DateTime? AssignedAt { get; set; }

    [ForeignKey("ExecutorId")]
    [InverseProperty("TaskAssignments")]
    public virtual User Executor { get; set; } = null!;

    [ForeignKey("TaskId")]
    [InverseProperty("TaskAssignments")]
    public virtual Task Task { get; set; } = null!;
}
