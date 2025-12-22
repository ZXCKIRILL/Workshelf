using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Backend.Data;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TaskCommentsController : ControllerBase
{
    private readonly AppDbContext _context;

    public TaskCommentsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("task/{taskId}")]
    public async Task<ActionResult<List<TaskCommentDto>>> GetCommentsByTask(int taskId)
    {
        var comments = await _context.TaskComments
            .Where(c => c.TaskId == taskId)
            .Select(c => new TaskCommentDto
            {
                Id = c.Id,
                TaskId = c.TaskId,
                UserId = c.UserId,
                Content = c.Content,
                CreatedAt = c.CreatedAt
            })
            .ToListAsync();
        return Ok(comments);
    }

    [HttpPost]
    public async Task<ActionResult<TaskCommentDto>> AddComment(CreateCommentDto dto)
    {
        var comment = new TaskComment
        {
            TaskId = dto.TaskId,
            UserId = dto.UserId,
            Content = dto.Content,
            CreatedAt = DateTime.Now
        };

        _context.TaskComments.Add(comment);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetCommentsByTask), new { taskId = dto.TaskId }, new TaskCommentDto
        {
            Id = comment.Id,
            TaskId = comment.TaskId,
            UserId = comment.UserId,
            Content = comment.Content,
            CreatedAt = comment.CreatedAt
        });
    }
}

