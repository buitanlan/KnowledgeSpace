﻿using KnowledgeSpace.BackendServer.Authorization;
using KnowledgeSpace.BackendServer.Constants;
using KnowledgeSpace.BackendServer.Data;
using KnowledgeSpace.BackendServer.Data.Entities;
using KnowledgeSpace.BackendServer.Helpers;
using KnowledgeSpace.ViewModels;
using KnowledgeSpace.ViewModels.Systems;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KnowledgeSpace.BackendServer.Controllers;

public class UsersController : BaseController
{
    private readonly UserManager<User> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly ApplicationDbContext _context;
    public UsersController(
        UserManager<User> userManager,
        RoleManager<IdentityRole> roleManager,
        ApplicationDbContext context)
    {
        _context = context;
        _roleManager = roleManager;
        _userManager = userManager;
    }

        
    [HttpPost]
    [ClaimRequirement(FunctionCode.SystemUser, CommandCode.Create)]
    [ApiValidationFilter]
    public async Task<IActionResult> PostUser(UserCreateRequest  request)
    {
        var user = new User
        {
            Id = Guid.NewGuid().ToString(),
            Email = request.Email,
            Dob = request.Dob,
            UserName = request.UserName,
            LastName = request.LastName,
            FirstName = request.FirstName,
            PhoneNumber = request.PhoneNumber
                
        };
        var result = await _userManager.CreateAsync(user);
        if(result.Succeeded)
        {
            return CreatedAtAction(nameof(GetById), new {id = user.Id}, request);
        }
        return BadRequest(new ApiBadRequestResponse(result));
    }


    [HttpGet]
    [ClaimRequirement(FunctionCode.SystemUser, CommandCode.View)]
    public async Task<IActionResult> GetUsers()
    {
        var users = _userManager.Users;

        var userVms = await users
            .AsNoTracking()
            .Select(u => new UserVm
            {
                Id = u.Id,
                UserName = u.UserName,
                Dob = u.Dob,
                Email = u.Email,
                PhoneNumber = u.PhoneNumber,
                FirstName = u.FirstName,
                LastName = u.LastName
            })
            .ToListAsync();
        return Ok(userVms);
    }


    [HttpGet("filter")]
    [ClaimRequirement(FunctionCode.SystemUser, CommandCode.View)]
    public async Task<ActionResult<Pagination<RoleVm>>> GetUsersPaging(string filter, int pageSize, int pageIndex)
    {
        var query = _userManager.Users;
        if( !string.IsNullOrEmpty(filter))
        {
            query = query.Where(x => 
                x.Email.Contains(filter) || x.UserName.Contains(filter) || x.PhoneNumber.Contains(filter));
        }

        var totalRecords = await query.CountAsync();
        var items = await query
            .AsNoTracking()
            .Skip(pageIndex - 1 * pageSize)
            .Take(pageSize)
            .Select(u => new UserVm
            {
                Id = u.Id,
                UserName = u.UserName,
                Dob = u.Dob,
                Email = u.Email,
                PhoneNumber = u.PhoneNumber,
                FirstName = u.FirstName,
                LastName = u.LastName
            })
            .ToListAsync();

        var pagination = new Pagination<UserVm>
        {
            Items = items,
            TotalRecords = totalRecords
        };
        return Ok(pagination);
    }



    [HttpGet("{id}")]
    [ClaimRequirement(FunctionCode.SystemUser, CommandCode.View)]
    public async Task<IActionResult> GetById(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user is null) return NotFound(new ApiNotFoundResponse($"Cannot found user with id: {id}"));
        var userVm = new UserVm
        {
            Id = user.Id,
            UserName = user.UserName,
            Dob = user.Dob,
            Email = user.Email,
            PhoneNumber = user.PhoneNumber,
            FirstName = user.FirstName,
            LastName = user.LastName
        };
        return Ok(userVm);
    }


    [HttpPut("{id}")]
    [ClaimRequirement(FunctionCode.SystemUser, CommandCode.Update)]
    public async Task<IActionResult> PutUser(string id, [FromBody] UserCreateRequest request)
    {
        var user = await _userManager.FindByIdAsync(id);
        if(user is null) return NotFound(new ApiNotFoundResponse($"Cannot found user with id: {id}"));

        user.FirstName = request.FirstName;
        user.LastName = request.LastName;
        user.Dob = request.Dob;
        user.PhoneNumber = request.PhoneNumber;

        var result = await _userManager.UpdateAsync(user);

        if (result.Succeeded) return NoContent();
        return BadRequest(new ApiBadRequestResponse(result));
    }


    [HttpPut("{id}/change-password")]
    [ClaimRequirement(FunctionCode.SystemUser, CommandCode.Update)]
    public async Task<IActionResult> PutUserPassword(string id, [FromBody]UserPasswordChangeRequest request)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user is null)
            return NotFound(new ApiNotFoundResponse($"Cannot found user with id: {id}"));

        var result = await _userManager.ChangePasswordAsync(user, request.CurrentPassword, request.NewPassword);

        if (result.Succeeded)
        {
            return NoContent();
        }
        return BadRequest(new ApiBadRequestResponse(result));
    }
        

    [HttpDelete("{id}")]
    [ClaimRequirement(FunctionCode.SystemUser, CommandCode.Delete)]
    public async Task<IActionResult> DeleteUser(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user is null) return NotFound();

        var result = await _userManager.DeleteAsync(user);

        if (!result.Succeeded) return BadRequest(result.Errors);
        var userVm = new UserVm
        {
            Id = user.Id,
            UserName = user.UserName,
            Dob = user.Dob,
            Email = user.Email,
            PhoneNumber = user.PhoneNumber,
            FirstName = user.FirstName,
            LastName = user.LastName
        };
        return Ok(userVm);
    }
        
        
    [HttpGet("{userId}/menu")]
    public async Task<IActionResult> GetMenuByUserPermission(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        var roles = await _userManager.GetRolesAsync(user);
        var query = from f in _context.Functions
            join p in _context.Permissions
                on f.Id equals p.FunctionId
            join r in _roleManager.Roles on p.RoleId equals r.Id
            join a in _context.Commands
                on p.CommandId equals a.Id
            where roles.Contains(r.Name) && a.Id == "VIEW"
            select new FunctionVm
            {
                Id = f.Id,
                Name = f.Name,
                Url = f.Url,
                ParentId = f.ParentId,
                SortOrder = f.SortOrder,
                Icon = f.Icon

            };
        var data = await query
            .AsNoTracking()
            .Distinct()
            .OrderBy(x => x.ParentId)
            .ThenBy(x => x.SortOrder)
            .ToListAsync();
        return Ok(data);
    }
}
