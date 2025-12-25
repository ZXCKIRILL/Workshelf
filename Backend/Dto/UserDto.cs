namespace Backend.Models;

public class UserDto
{
    public int Id { get; set; }
    public string Login { get; set; } = null!;
    public string FullName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Role { get; set; } = null!;
    public DateTime? CreatedAt { get; set; }
}

public class CreateUserDto
{
    public string Login { get; set; } = null!;
    public string Password { get; set; } = null!;
    public string Role { get; set; } = null!;
    public string FullName { get; set; } = null!;
    public string Email { get; set; } = null!;
}

public class UpdateUserDto
{
    public string Login { get; set; } = null!;
    public string? Password { get; set; } // опционально
    public string Role { get; set; } = null!;
    public string FullName { get; set; } = null!;
    public string Email { get; set; } = null!;
}