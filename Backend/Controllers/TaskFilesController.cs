using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Backend.Data;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TaskFilesController : ControllerBase
{
    private readonly AppDbContext _context;

    public TaskFilesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("task/{taskId}")]
    public async Task<ActionResult<List<TaskFileDto>>> GetFilesByTask(int taskId)
    {
        var files = await _context.TaskFiles
            .Where(f => f.TaskId == taskId)
            .Select(f => new TaskFileDto
            {
                Id = f.Id,
                TaskId = f.TaskId,
                FileName = f.FileName,
                FilePath = f.FilePath,
                UploadedBy = f.UploadedBy,
                UploadedAt = f.UploadedAt
            })
            .ToListAsync();
        return Ok(files);
    }

    [HttpPost]
    public async Task<ActionResult<TaskFileDto>> UploadFile(UploadFileDto dto)
    {
        var file = new TaskFile
        {
            TaskId = dto.TaskId,
            FileName = dto.FileName,
            FilePath = dto.FilePath,
            UploadedBy = dto.UploadedBy,
            UploadedAt = DateTime.Now
        };

        _context.TaskFiles.Add(file);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetFilesByTask), new { taskId = dto.TaskId }, new TaskFileDto
        {
            Id = file.Id,
            TaskId = file.TaskId,
            FileName = file.FileName,
            FilePath = file.FilePath,
            UploadedBy = file.UploadedBy,
            UploadedAt = file.UploadedAt
        });
    }
}

