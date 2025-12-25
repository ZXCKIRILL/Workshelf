namespace Backend.Models;

public class TaskAssignmentDto
{
    public int Id { get; set; }
    public int TaskId { get; set; }
    public int ExecutorId { get; set; }
    public DateTime? AssignedAt { get; set; }
}


public class AssignTaskDto
{
    public int TaskId { get; set; }
    public int ExecutorId { get; set; }
}