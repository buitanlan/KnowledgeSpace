using System.Security.Claims;
using System.Text.Json;
using Duende.IdentityServer.Extensions;
using Duende.IdentityServer.Models;
using Duende.IdentityServer.Services;
using KnowledgeSpace.BackendServer.Constants;
using KnowledgeSpace.BackendServer.Data;
using KnowledgeSpace.BackendServer.Data.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace KnowledgeSpace.BackendServer.IdentityServer;

public class IdentityProfileService(
    IUserClaimsPrincipalFactory<User> claimsFactory,
    UserManager<User> userManager,
    ApplicationDbContext dbContext,
    RoleManager<IdentityRole> roleManager): IProfileService
{
  
    public async Task GetProfileDataAsync(ProfileDataRequestContext context)
    {
        var sub = context.Subject.GetSubjectId();
        var user = await userManager.FindByIdAsync(sub);
        if (user is null)
        {
            throw new ArgumentException("");
        }

        var principal = await claimsFactory.CreateAsync(user);
        var claims = principal.Claims.ToList();
        var roles = await userManager.GetRolesAsync(user);

        var query = from p in dbContext.Permissions
            join c in dbContext.Commands
                on p.CommandId equals c.Id
            join f in dbContext.Functions
                on p.FunctionId equals f.Id
            join r in roleManager.Roles on p.RoleId equals r.Id
            where roles.Contains(r.Name)
            select f.Id + "_" + c.Id;
        var permissions = await query.Distinct().ToListAsync();

        //Add more claims like this
        claims.Add(new Claim(ClaimTypes.Name, user.UserName));
        claims.Add(new Claim(ClaimTypes.NameIdentifier, user.Id));
        claims.Add(new Claim(ClaimTypes.Role, string.Join(";", roles)));
        claims.Add(new Claim(SystemConstants.Claims.Permissions, JsonSerializer.Serialize(permissions)));

        context.IssuedClaims = claims;
    }

    public async Task IsActiveAsync(IsActiveContext context)
    {
        var sub = context.Subject.GetSubjectId();
        var user = await userManager.FindByIdAsync(sub);
        context.IsActive = user is not null;
    }
}
