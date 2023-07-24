using System.Text.Json;
using KnowledgeSpace.BackendServer.Data.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace KnowledgeSpace.BackendServer.Areas.Identity.Pages.Account.Manage;

public class DownloadPersonalDataModel(UserManager<User> userManager,
        ILogger<DownloadPersonalDataModel> logger)
    : PageModel
{
    public async Task<IActionResult> OnPostAsync()
    {
        var user = await userManager.GetUserAsync(User);
        if (user is null)
        {
            return NotFound($"Unable to load user with ID '{userManager.GetUserId(User)}'.");
        }

        logger.LogInformation("User with ID '{UserId}' asked for their personal data.", userManager.GetUserId(User));

        // Only include personal data for download
        var personalData = new Dictionary<string, string>();
        var personalDataProps = typeof(User).GetProperties().Where(
            prop => Attribute.IsDefined(prop, typeof(PersonalDataAttribute)));
        foreach (var p in personalDataProps)
        {
            personalData.Add(p.Name, p.GetValue(user)?.ToString() ?? "null");
        }

        var logins = await userManager.GetLoginsAsync(user);
        foreach (var l in logins)
        {
            personalData.Add($"{l.LoginProvider} external login provider key", l.ProviderKey);
        }

        Response.Headers.Add("Content-Disposition", "attachment; filename=PersonalData.json");
        return new FileContentResult(JsonSerializer.SerializeToUtf8Bytes(personalData), "application/json");
    }
}