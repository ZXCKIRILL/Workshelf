namespace Backend.Models;

public class TaskFileDto
{
    public int Id { get; set; }
    public int TaskId { get; set; }
    public string FileName { get; set; } = null!;
    public string FilePath { get; set; } = null!; 
    public int UploadedBy { get; set; }
    public DateTime? UploadedAt { get; set; }
    public UserDto? Uploader { get; set; }
}

public class UploadFileDto
{
    public int TaskId { get; set; }
    public string FileName { get; set; } = null!;
    public string FilePath { get; set; } = null!;
    public int UploadedBy { get; set; }
}