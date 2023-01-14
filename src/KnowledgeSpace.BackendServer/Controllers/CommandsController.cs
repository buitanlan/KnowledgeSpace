﻿using KnowledgeSpace.BackendServer.Data;
using KnowledgeSpace.ViewModels.Systems;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KnowledgeSpace.BackendServer.Controllers;

public class CommandsController: BaseController
{
    private readonly ApplicationDbContext _context;

    public CommandsController(ApplicationDbContext context)
    {
        _context = context;
    }


    [HttpGet]
    public async Task<IActionResult> GetCommands()
    {
        var commandVms = await _context.Commands
            .Select(c => new CommandVm
            {
                Id = c.Id,
                Name = c.Name
            })
            .ToListAsync();
        return Ok(commandVms);
    }

}