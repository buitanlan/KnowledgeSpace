using System.Linq;
using System.Threading.Tasks;
using KnownledgeSpace.ViewModels;
using KnownledgeSpace.ViewModels.System;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KnownledgeSpace.BackendServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RolesController : ControllerBase
    {
        private readonly RoleManager<IdentityRole> _roleManager;
        public RolesController(RoleManager<IdentityRole> roleManager)
        {
            _roleManager = roleManager;
        }

        [HttpPost]
        public async Task<IActionResult> PostRole(RoleVm roleVm)
        {
            var role = new IdentityRole()
            {
                Id = roleVm.Id,
                Name = roleVm.Name,
                NormalizedName = roleVm.Name.ToUpper()
            };
            var result = await _roleManager.CreateAsync(role);
            if(result.Succeeded)
            {
                return CreatedAtAction(nameof(GetById), new {id = role.Id}, roleVm);
            }
            else
            {
                return BadRequest(result.Errors);
            }
        }


        [HttpGet]
        public async Task<IActionResult> GetRoles()
        {
            var roles = await _roleManager.Roles.ToListAsync();

            var rolevms = roles.Select(r => new RoleVm()
            {
                Id = r.Id,
                Name = r.Name
            });
            return Ok(rolevms);
        }


        [HttpGet]
        public async Task<ActionResult<Pagination<RoleVm>>> GetRolesPaging(string keyword, int pageSize, int pageIndex)
        {
            var query = _roleManager.Roles;
            if( !string.IsNullOrEmpty(keyword))
            {
                query = query.Where(x => x.Id.Contains(keyword) || x.Name.Contains(keyword));
            }

            var totalRecords = await query.CountAsync();
            var items = await query.Skip(pageIndex - 1 * pageSize)
                .Take(pageSize)
                .Select(x => new RoleVm()
                {
                    Id = x.Id,
                    Name = x.Name
                }).ToListAsync();

            var pagination = new Pagination<RoleVm>()
            {
                Items = items,
                TotalRecords = totalRecords
            };
            return Ok(pagination);
        }



        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var role = await _roleManager.FindByIdAsync(id);
            if (role == null) return NotFound();
            var roleVm = new RoleVm()
            {
                Id = role.Id,
                Name = role.Name
            };
            return Ok(roleVm);
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> PutRole(string id, [FromBody] RoleVm roleVm) 
        {
            if(id  != roleVm.Id) return BadRequest();

            var role = await _roleManager.FindByIdAsync(id);
            if(role == null) return NotFound();

            role.Name = roleVm.Name;
            role.NormalizedName = roleVm.Name.ToUpper();

            var result = await _roleManager.UpdateAsync(role);

            if (result.Succeeded) return NoContent();
            return BadRequest(result.Errors);
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRole(string id)
        {
            var role = await _roleManager.FindByIdAsync(id);
            if (role == null) return NotFound();

            var result = await _roleManager.DeleteAsync(role);

            if (result.Succeeded) 
            {
                var roleVm = new RoleVm()
                {
                    Id = role.Id,
                    Name = role.Name
                };
                return Ok(roleVm);
            }
            return BadRequest(result.Errors);
        }
    }
}