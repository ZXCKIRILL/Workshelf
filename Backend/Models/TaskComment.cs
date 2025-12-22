using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Backend.Models;

[Table("task_comments")]
public partial class TaskComment
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("task_id")]
    public int TaskId { get; set; }

    [Column("user_id")]
    public int UserId { get; set; }

    [Column("content")]
    public string Content { get; set; } = null!;

    [Column("created_at", TypeName = "timestamp without time zone")]
    public DateTime? CreatedAt { get; set; }

    [ForeignKey("TaskId")]
    [InverseProperty("TaskComments")]
    public virtual Task Task { get; set; } = null!;

    [ForeignKey("UserId")]
    [InverseProperty("TaskComments")]
    public virtual User User { get; set; } = null!;
}
