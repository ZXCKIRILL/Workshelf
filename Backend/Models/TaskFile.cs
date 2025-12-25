using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Backend.Models;

[Table("task_files")]
public partial class TaskFile
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("task_id")]
    public int TaskId { get; set; }

    [Column("file_name")]
    [StringLength(255)]
    public string FileName { get; set; } = null!;

    [Column("file_path")]
    public string FilePath { get; set; } = null!;

    [Column("uploaded_by")]
    public int UploadedBy { get; set; }

    [Column("uploaded_at", TypeName = "timestamp without time zone")]
    public DateTime? UploadedAt { get; set; }

    [ForeignKey("TaskId")]
    [InverseProperty("TaskFiles")]
    public virtual Task Task { get; set; } = null!;

    [ForeignKey("UploadedBy")]
    [InverseProperty("TaskFiles")]
    public virtual User UploadedByNavigation { get; set; } = null!;
}
