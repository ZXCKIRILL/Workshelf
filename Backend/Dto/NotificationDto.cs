namespace Backend.Models;

public class NotificationDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Message { get; set; } = null!;
    public bool IsRead { get; set; }
    public DateTime? CreatedAt { get; set; }
}
public class CreateNotificationDto
{
    public int UserId { get; set; }
    public string Message { get; set; } = null!;
}