using System.Linq;
using System.Threading.Tasks;
using KnowledgeSpace.BackendServer.Data;
using KnowledgeSpace.BackendServer.Data.Entities;
using KnowledgeSpace.ViewModels;
using KnowledgeSpace.ViewModels.Systems;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KnowledgeSpace.BackendServer.Controllers
{
    public class FunctionsController : BaseController
    {
        private readonly ApplicationDbContext _context;

        public FunctionsController(ApplicationDbContext context)
        {
            _context = context;
        }
        [HttpPost]
        public async Task<IActionResult> PostFunction([FromBody]FunctionCreateRequest  request)
        {
            var dbFunction = await _context.Functions.FindAsync(request.Id);
            if (dbFunction is not null)
                return BadRequest($"Function with id {request.Id} is existed!");
            
            var function = new Function()
            {
                Id = request.Id,
                Name = request.Name,
                ParentId = request.ParentId,
                SortOrder = request.SortOrder,
                Url = request.Url,

            };
            await _context.Functions.AddAsync(function);
            var result = await _context.SaveChangesAsync();
            
            if(result > 0)
            {
                return CreatedAtAction(nameof(GetById), new {id = function.Id}, request);
            }
            else
            {
                return BadRequest();
            }
        }


        [HttpGet]
        public async Task<IActionResult> GetFunctions()
        {
            var functions = _context.Functions;

            var functionVms = await functions.Select(u => new FunctionVm()
            {
                Id = u.Id,
                Name = u.Name,
                Url = u.Url,
                SortOrder = u.SortOrder,
                ParentId = u.ParentId
            }).ToListAsync();
            return Ok(functionVms);
        }
 

        [HttpGet("filter")]
        public async Task<ActionResult<Pagination<RoleVm>>> GetFunctionsPaging(string filter, int pageSize, int pageIndex)
        {
            var query = _context.Functions.AsQueryable();
            if( !string.IsNullOrEmpty(filter))
            {
                query = query.Where(x => 
                    x.Name.Contains(filter) || x.Id.Contains(filter) || x.Url.Contains(filter));
            }

            var totalRecords = await query.CountAsync();
            var items = await query.Skip(pageIndex - 1 * pageSize)
                .Take(pageSize)
                .Select(u => new FunctionVm()
                {
                    Id = u.Id,
                    Name = u.Name,
                    Url = u.Url,
                    SortOrder = u.SortOrder,
                    ParentId = u.ParentId
                }).ToListAsync();

            var pagination = new Pagination<FunctionVm>()
            {
                Items = items,
                TotalRecords = totalRecords
            };
            return Ok(pagination);
        }



        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var function = await _context.Functions.FindAsync(id);
            if (function == null) return NotFound();
            var functionVm = new FunctionVm()
            {
                Id = function.Id,
                Name = function.Name,
                Url = function.Url,
                SortOrder = function.SortOrder,
                ParentId = function.ParentId
            };
            return Ok(functionVm);
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> PutFunction(string id, [FromBody] FunctionCreateRequest request)
        {
            var function = await _context.Functions.FindAsync(id);
            if(function == null) return NotFound();

            function.Name = request.Name;
            function.ParentId = request.ParentId;
            function.SortOrder = request.SortOrder;
            function.Url = request.Url;

            _context.Functions.Update(function);
            var result = await _context.SaveChangesAsync();

            if (result > 0) return NoContent();
            return BadRequest();
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFunction(string id)
        {
            var function = await _context.Functions.FindAsync(id);
            if (function == null) return NotFound();

            _context.Functions.Remove(function);
            var result = await _context.SaveChangesAsync();

            if (result <= 0) return BadRequest();
            var functionVm = new FunctionVm()
            {
                Id = function.Id,
                Name = function.Name,
                Url = function.Url,
                SortOrder = function.SortOrder,
                ParentId = function.ParentId
            };
            return Ok(functionVm);
        }
    }
}