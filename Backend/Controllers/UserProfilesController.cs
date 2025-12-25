using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Backend.Data;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserProfilesController : ControllerBase
{
    private readonly AppDbContext _context;

    public UserProfilesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("{userId}")]
    public async Task<ActionResult<UserProfileDto>> GetProfile(int userId)
    {
        var profile = await _context.UserProfiles
            .Where(p => p.UserId == userId)
            .Select(p => new UserProfileDto
            {
                Id = p.Id,
                UserId = p.UserId,
                Phone = p.Phone,
                Position = p.Position,
                DepartmentId = p.DepartmentId,
                AvatarUrl = p.AvatarUrl
            })
            .FirstOrDefaultAsync();

        if (profile == null) return NotFound();
        return Ok(profile);
    }

    [HttpPut("{userId}")]
    public async Task<IActionResult> UpdateProfile(int userId, UpdateProfileDto dto)
    {
        var profile = await _context.UserProfiles.FindAsync(userId);
        if (profile == null)
        {
            profile = new UserProfile { UserId = userId };
            _context.UserProfiles.Add(profile);
        }

        profile.Phone = dto.Phone;
        profile.Position = dto.Position;
        profile.DepartmentId = dto.DepartmentId;
        profile.AvatarUrl = dto.AvatarUrl;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{userId}")]
    public async Task<IActionResult> DeleteProfile(int userId)
    {
        var profile = await _context.UserProfiles.FindAsync(userId);
        if (profile == null) return NotFound();
        _context.UserProfiles.Remove(profile);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}

