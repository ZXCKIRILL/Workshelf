using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Backend.Data;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TaskAssignmentsController : ControllerBase
{
    private readonly AppDbContext _context;

    public TaskAssignmentsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<TaskAssignmentDto>>> GetAssignments()
    {
        var assignments = await _context.TaskAssignments
            .Select(a => new TaskAssignmentDto
            {
                Id = a.Id,
                TaskId = a.TaskId,
                ExecutorId = a.ExecutorId,
                AssignedAt = a.AssignedAt
            })
            .ToListAsync();
        return Ok(assignments);
    }

    [HttpPost]
    public async Task<ActionResult<TaskAssignmentDto>> AssignTask(AssignTaskDto dto)
    {
        var assignment = new TaskAssignment
        {
            TaskId = dto.TaskId,
            ExecutorId = dto.ExecutorId,
            AssignedAt = DateTime.Now
        };

        _context.TaskAssignments.Add(assignment);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAssignments), new TaskAssignmentDto
        {
            Id = assignment.Id,
            TaskId = assignment.TaskId,
            ExecutorId = assignment.ExecutorId,
            AssignedAt = assignment.AssignedAt
        });
    }
}
