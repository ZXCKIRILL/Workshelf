using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Backend.Data;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DepartmentsController : ControllerBase
{
    private readonly AppDbContext _context;

    public DepartmentsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<DepartmentDto>>> GetDepartments()
    {
        var depts = await _context.Departments
            .Select(d => new DepartmentDto { Id = d.Id, Name = d.Name, Description = d.Description })
            .ToListAsync();
        return Ok(depts);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<DepartmentDto>> GetDepartment(int id)
    {
        var dept = await _context.Departments
            .Where(d => d.Id == id)
            .Select(d => new DepartmentDto { Id = d.Id, Name = d.Name, Description = d.Description })
            .FirstOrDefaultAsync();
        if (dept == null) return NotFound();
        return Ok(dept);
    }

    [HttpPost]
    public async Task<ActionResult<DepartmentDto>> CreateDepartment(CreateDepartmentDto dto)
    {
        var dept = new Department { Name = dto.Name, Description = dto.Description };
        _context.Departments.Add(dept);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetDepartment), new { id = dept.Id }, 
            new DepartmentDto { Id = dept.Id, Name = dept.Name, Description = dept.Description });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateDepartment(int id, UpdateDepartmentDto dto)
    {
        var dept = await _context.Departments.FindAsync(id);
        if (dept == null) return NotFound();

        dept.Name = dto.Name;
        dept.Description = dto.Description;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteDepartment(int id)
    {
        var dept = await _context.Departments.FindAsync(id);
        if (dept == null) return NotFound();

        _context.Departments.Remove(dept);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
