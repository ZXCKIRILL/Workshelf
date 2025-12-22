using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Backend.Models;

[Table("user_profiles")]
public partial class UserProfile
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("user_id")]
    public int UserId { get; set; }

    [Column("phone")]
    [StringLength(20)]
    public string? Phone { get; set; }

    [Column("position")]
    [StringLength(255)]
    public string? Position { get; set; }

    [Column("department_id")]
    public int? DepartmentId { get; set; }

    [Column("avatar_url")]
    public string? AvatarUrl { get; set; }

    [ForeignKey("DepartmentId")]
    [InverseProperty("UserProfiles")]
    public virtual Department? Department { get; set; }

    [ForeignKey("UserId")]
    [InverseProperty("UserProfiles")]
    public virtual User User { get; set; } = null!;
}
