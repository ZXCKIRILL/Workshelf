using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Backend.Data;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuditLogsController : ControllerBase
{
    private readonly AppDbContext _context;

    public AuditLogsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<AuditLogDto>>> GetAuditLogs()
    {
        var logs = await _context.AuditLogs
            .Select(l => new AuditLogDto
            {
                Id = l.Id,
                UserId = l.UserId,
                Action = l.Action,
                EntityType = l.EntityType,
                EntityId = l.EntityId,
                Details = l.Details,
                Timestamp = l.Timestamp
            })
            .ToListAsync();
        return Ok(logs);
    }

    [HttpGet("user/{userId}")]
    public async Task<ActionResult<List<AuditLogDto>>> GetUserAuditLogs(int userId)
    {
        var logs = await _context.AuditLogs
            .Where(l => l.UserId == userId)
            .Select(l => new AuditLogDto
            {
                Id = l.Id,
                UserId = l.UserId,
                Action = l.Action,
                EntityType = l.EntityType,
                EntityId = l.EntityId,
                Details = l.Details,
                Timestamp = l.Timestamp
            })
            .ToListAsync();
        return Ok(logs);
    }
    
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAuditLog(int id)
    {
        var log = await _context.AuditLogs.FindAsync(id);
        if (log == null) return NotFound();
        _context.AuditLogs.Remove(log);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}