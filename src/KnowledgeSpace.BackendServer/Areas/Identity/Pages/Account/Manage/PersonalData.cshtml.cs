﻿using KnowledgeSpace.BackendServer.Data.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace KnowledgeSpace.BackendServer.Areas.Identity.Pages.Account.Manage;

public class PersonalDataModel(UserManager<User> userManager,
        ILogger<PersonalDataModel> logger)
    : PageModel
{
    private readonly ILogger<PersonalDataModel> _logger = logger;

    public async Task<IActionResult> OnGet()
    {
        var user = await userManager.GetUserAsync(User);
        if (user is null)
        {
            return NotFound($"Unable to load user with ID '{userManager.GetUserId(User)}'.");
        }

        return Page();
    }
}