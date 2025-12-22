namespace Backend.Models;

public class DepartmentDto
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
}

public class CreateDepartmentDto 
{ 
    public string Name { get; set; } = null!; 
    public string? Description { get; set; } 
    }
public class UpdateDepartmentDto 
{ 
    public string Name { get; set; } = null!; 
    public string? Description { get; set; } 
}