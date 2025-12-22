using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Backend.Data;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
    private readonly AppDbContext _context;

    public TasksController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<TaskDto>>> GetTasks()
    {
        var tasks = await _context.Tasks
            .Select(t => new TaskDto
            {
                Id = t.Id,
                Title = t.Title,
                Description = t.Description,
                StartDate = t.StartDate,
                EndDate = t.EndDate,
                CreatedBy = t.CreatedBy,
                Status = t.Status,
                Priority = t.Priority
            })
            .ToListAsync();
        return Ok(tasks);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TaskDto>> GetTask(int id)
    {
        var task = await _context.Tasks
            .Where(t => t.Id == id)
            .Select(t => new TaskDto
            {
                Id = t.Id,
                Title = t.Title,
                Description = t.Description,
                StartDate = t.StartDate,
                EndDate = t.EndDate,
                CreatedBy = t.CreatedBy,
                Status = t.Status,
                Priority = t.Priority
            })
            .FirstOrDefaultAsync();

        if (task == null) return NotFound();
        return Ok(task);
    }

    [HttpPost]
    public async Task<ActionResult<TaskDto>> CreateTask(CreateTaskDto dto)
    {
        var task = new Models.Task
        {
            Title = dto.Title,
            Description = dto.Description,
            StartDate = DateTime.SpecifyKind(dto.StartDate, DateTimeKind.Unspecified),
            EndDate = DateTime.SpecifyKind(dto.EndDate, DateTimeKind.Unspecified),
            CreatedBy = dto.CreatedBy,
            Status = dto.Status ?? "NotReady",
            Priority = dto.Priority ?? 1
        };

        _context.Tasks.Add(task);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetTask), new { id = task.Id }, new TaskDto
        {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            StartDate = task.StartDate,
            EndDate = task.EndDate,
            CreatedBy = task.CreatedBy,
            Status = task.Status,
            Priority = task.Priority
        });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTask(int id, UpdateTaskDto dto)
    {
        var task = await _context.Tasks.FindAsync(id);
        if (task == null) return NotFound();

        task.Title = dto.Title;
        task.Description = dto.Description;
        task.StartDate = DateTime.SpecifyKind(dto.StartDate, DateTimeKind.Unspecified);
        task.EndDate = DateTime.SpecifyKind(dto.EndDate, DateTimeKind.Unspecified);
        task.Status = dto.Status;
        task.Priority = dto.Priority;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTask(int id)
    {
        var task = await _context.Tasks.FindAsync(id);
        if (task == null) return NotFound();

        _context.Tasks.Remove(task);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}