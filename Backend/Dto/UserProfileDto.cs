namespace Backend.Models;

public class UserProfileDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string? Phone { get; set; }
    public string? Position { get; set; }
    public int? DepartmentId { get; set; }
    public string? AvatarUrl { get; set; }
}

public class UpdateProfileDto
{
    public string? Phone { get; set; }
    public string? Position { get; set; }
    public int? DepartmentId { get; set; }
    public string? AvatarUrl { get; set; }
}