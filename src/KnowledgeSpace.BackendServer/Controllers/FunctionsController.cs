using KnowledgeSpace.BackendServer.Authorization;
using KnowledgeSpace.BackendServer.Constants;
using KnowledgeSpace.BackendServer.Data;
using KnowledgeSpace.BackendServer.Data.Entities;
using KnowledgeSpace.BackendServer.Helpers;
using KnowledgeSpace.ViewModels;
using KnowledgeSpace.ViewModels.Systems;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KnowledgeSpace.BackendServer.Controllers;

public class FunctionsController : BaseController
{
    private readonly ApplicationDbContext _context;

    public FunctionsController(ApplicationDbContext context)
    {
        _context = context;
    }
        
        
    [HttpPost]
    [ClaimRequirement(FunctionCode.SystemFunction, CommandCode.Create)]
    [ApiValidationFilter]
    public async Task<IActionResult> PostFunction([FromBody]FunctionCreateRequest  request)
    {
        var dbFunction = await _context.Functions.FindAsync(request.Id);
        if (dbFunction is not null)
            return BadRequest(new ApiBadRequestResponse($"Function with id {request.Id} is existed!"));
            
        var function = new Function
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
        return BadRequest(new ApiBadRequestResponse("Create function is failed"));
    }


    [HttpGet]
    [ClaimRequirement(FunctionCode.SystemFunction, CommandCode.View)]
    public async Task<IActionResult> GetFunctions()
    {
        var functions = _context.Functions;

        var functionVms = await functions.Select(u => new FunctionVm
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
    [ClaimRequirement(FunctionCode.SystemFunction, CommandCode.View)]

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
            .Select(u => new FunctionVm
            {
                Id = u.Id,
                Name = u.Name,
                Url = u.Url,
                SortOrder = u.SortOrder,
                ParentId = u.ParentId
            }).ToListAsync();

        var pagination = new Pagination<FunctionVm>
        {
            Items = items,
            TotalRecords = totalRecords
        };
        return Ok(pagination);
    }



    [HttpGet("{id}")]
    [ClaimRequirement(FunctionCode.SystemFunction, CommandCode.View)]
    public async Task<IActionResult> GetById(string id)
    {
        var function = await _context.Functions.FindAsync(id);
        if (function == null) return NotFound(new ApiNotFoundResponse($"Cannot found function with id {id}"));
        var functionVm = new FunctionVm
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
    [ClaimRequirement(FunctionCode.SystemFunction, CommandCode.Update)]
    public async Task<IActionResult> PutFunction(string id, [FromBody] FunctionCreateRequest request)
    {
        var function = await _context.Functions.FindAsync(id);
        if(function == null) return NotFound(new ApiNotFoundResponse($"Cannot found function with id {id}"));

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
    [ClaimRequirement(FunctionCode.SystemFunction, CommandCode.Delete)]
    public async Task<IActionResult> DeleteFunction(string id)
    {
        var function = await _context.Functions.FindAsync(id);
        if (function == null) return NotFound(new ApiNotFoundResponse($"Cannot found function with id {id}"));

        _context.Functions.Remove(function);
        var result = await _context.SaveChangesAsync();

        if (result <= 0) return BadRequest(new ApiBadRequestResponse("Delete function failed"));
        var functionVm = new FunctionVm
        {
            Id = function.Id,
            Name = function.Name,
            Url = function.Url,
            SortOrder = function.SortOrder,
            ParentId = function.ParentId
        };
        return Ok(functionVm);
    }
        
        
    [HttpGet("{functionId}/commands")]
    [ClaimRequirement(FunctionCode.SystemFunction, CommandCode.View)]
    public async Task<IActionResult> GetCommandsInFunction(string functionId)
    {
        var query =
            from c in _context.Commands
            join cif in _context.CommandInFunctions on c.Id equals cif.CommandId into result1
            from commandInFunction in result1.DefaultIfEmpty()
            join f in _context.Functions on commandInFunction.FunctionId equals f.Id into result2
            from function in result2.DefaultIfEmpty()
            select new
            {
                c.Id,
                c.Name,
                commandInFunction.FunctionId
            };
        query = query.Where(x => x.FunctionId == functionId);
        var data = await query.Select(x => new CommandVm
        {
            Id = x.Id,
            Name = x.Name
        }).ToListAsync();
        return Ok(data);
    }
        
        
    [HttpGet("{functionId}/commands/not-in-function")]
    [ClaimRequirement(FunctionCode.SystemFunction, CommandCode.View)]
    public async Task<IActionResult> GetCommandsNotInFunction(string functionId)
    {
        var query =
            from c in _context.Commands
            join cif in _context.CommandInFunctions on c.Id equals cif.CommandId into result1
            from commandInFunction in result1.DefaultIfEmpty()
            join f in _context.Functions on commandInFunction.FunctionId equals f.Id into result2
            from function in result2.DefaultIfEmpty()
            select new
            {
                c.Id,
                c.Name,
                commandInFunction.FunctionId
            };
        query = query.Where(x => x.FunctionId != functionId);
        var data = await query.Select(x => new CommandVm
        {
            Id = x.Id,
            Name = x.Name
        }).ToListAsync();
        return Ok(data);
    }
        
        
    [HttpPost("{functionId}/commands")]
    [ClaimRequirement(FunctionCode.SystemFunction, CommandCode.Create)]
    [ApiValidationFilter]
    public async Task<IActionResult> PostCommandToFunction(string functionId, [FromBody] AddCommandToFunctionRequest request)
    {
        var commandInFunction = await _context.CommandInFunctions.FindAsync(request.CommandId, request.FunctionId);
        if (commandInFunction != null)
            return BadRequest(new ApiBadRequestResponse("This command has been added to function"));

        var entity = new CommandInFunction
        {
            CommandId = request.CommandId,
            FunctionId = request.FunctionId
        };
        _context.CommandInFunctions.Add(entity);
        var result = await _context.SaveChangesAsync();

        if (result > 0)
        {
            return CreatedAtAction(nameof(GetById), new { commandId = request.CommandId, functionId = request.FunctionId }, request);
        }
        return BadRequest(new ApiBadRequestResponse("Add comment function failed"));
    }


    [HttpDelete("{functionId}/commands/{commandId}")]
    [ClaimRequirement(FunctionCode.SystemFunction, CommandCode.Update)]
    [ApiValidationFilter]
    public async Task<IActionResult> DeleteCommandToFunction(string functionId, string commandId)
    {
        var commandInFunction = await _context.CommandInFunctions.FindAsync(functionId, commandId);
        if (commandInFunction == null)
            return BadRequest(new ApiBadRequestResponse("This command is not existed in function"));

        var entity = new CommandInFunction
        {
            CommandId = commandId,
            FunctionId = functionId
        };
        _context.CommandInFunctions.Remove(entity);
        var result = await _context.SaveChangesAsync();

        if (result > 0)
        {
            return Ok();
        }
        return BadRequest(new ApiBadRequestResponse("Delete command to function failed"));
    }
}