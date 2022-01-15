using Duende.IdentityServer;
using Duende.IdentityServer.Events;
using Duende.IdentityServer.Extensions;
using Duende.IdentityServer.Services;
using IdentityModel;
using KnowledgeSpace.BackendServer.Data.Entities;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Server.IISIntegration;

namespace KnowledgeSpace.BackendServer.Areas.Identity.Pages.Account;

[AllowAnonymous]
public class LogoutModel : PageModel
{
    private readonly SignInManager<User> _signInManager;
    private readonly ILogger<LogoutModel> _logger;
    private readonly IIdentityServerInteractionService _interaction;
    private readonly IEventService _eventService;

    public LogoutModel(SignInManager<User> signInManager, ILogger<LogoutModel> logger,
        IIdentityServerInteractionService interaction, IEventService eventService)
    {
        _signInManager = signInManager;
        _logger = logger;
        _interaction = interaction;
        _eventService = eventService;
    }
    public LogoutViewModel LogoutVm { get; set; }
    public LoggedOutViewModel LoggedOutVm { get; set; }


    public async Task<IActionResult> OnGet(string logoutId)
    {
        var vm = await BuildLogoutViewModelAsync(logoutId);

        if (vm.ShowLogoutPrompt == false)
        {
            // if the request for logout was properly authenticated from IdentityServer, then
            // we don't need to show the prompt and can just log the user out directly.
            return await OnPost(vm);
        }

        LogoutVm = vm;
        return Page();
    }
    public async Task<IActionResult> OnPost(LogoutInputModel model)
    {
        await _signInManager.SignOutAsync();
        _logger.LogInformation("User logged out.");
        var vm = await BuildLoggedOutViewModelAsync(model.LogoutId);

        if (User?.Identity?.IsAuthenticated == true)
        {
            // delete local authentication cookie
            await _signInManager.SignOutAsync();

            // raise the logout event
            await _eventService.RaiseAsync(new UserLogoutSuccessEvent(User.GetSubjectId(), User.GetDisplayName()));
        }
            
        // check if we need to trigger sign-out at an upstream identity provider
        if (vm.TriggerExternalSignout)
        {
            // build a return URL so the upstream provider will redirect back
            // to us after the user has logged out. this allows us to then
            // complete our single sign-out processing.
            string url = Url.Action("Logout", new { logoutId = vm.LogoutId });

            // this triggers a redirect to the external provider for sign-out
            return SignOut(new AuthenticationProperties { RedirectUri = url }, vm.ExternalAuthenticationScheme);
        }

        LoggedOutVm = vm;
        return Page();
    }

    private async Task<LogoutViewModel> BuildLogoutViewModelAsync(string logoutId)
    {
        var vm = new LogoutViewModel { LogoutId = logoutId, ShowLogoutPrompt = AccountOptions.ShowLogoutPrompt };

        if (User?.Identity is not {IsAuthenticated: true})
        {
            // if the user is not authenticated, then just show logged out page
            vm.ShowLogoutPrompt = false;
            return vm;
        }

        var context = await _interaction.GetLogoutContextAsync(logoutId);
        if (context?.ShowSignoutPrompt != false) return vm;
        // it's safe to automatically sign-out
        vm.ShowLogoutPrompt = false;
        return vm;

        // show the logout prompt. this prevents attacks where the user
        // is automatically signed out by another malicious web page.
    }

    private async Task<LoggedOutViewModel> BuildLoggedOutViewModelAsync(string logoutId)
    {
        var logout = await _interaction.GetLogoutContextAsync(logoutId);

        var vm = new LoggedOutViewModel
        {
            AutomaticRedirectAfterSignOut = AccountOptions.AutomaticRedirectAfterSignOut,
            PostLogoutRedirectUri = logout?.PostLogoutRedirectUri,
            ClientName = string.IsNullOrWhiteSpace(logout?.ClientName) ? logout?.ClientId : logout?.ClientName,
            SignOutIframeUrl = logout?.SignOutIFrameUrl,
            LogoutId = logoutId
        };

        if (User?.Identity is not {IsAuthenticated: true}) return vm;
        var idp = User.FindFirst(JwtClaimTypes.IdentityProvider)?.Value;
        if (idp is null or IdentityServerConstants.LocalIdentityProvider) return vm;
        var providerSupportsSignout = await HttpContext.GetSchemeSupportsSignOutAsync(idp);
        if (!providerSupportsSignout) return vm;
        vm.LogoutId ??= await _interaction.CreateLogoutContextAsync();
        vm.ExternalAuthenticationScheme = idp;
        return vm;
            
    }
}
public class LogoutInputModel
{
    public string LogoutId { get; set; }
}

public class LogoutViewModel : LogoutInputModel
{
    public bool ShowLogoutPrompt { get; set; } = true;
}

public class LoggedOutViewModel
{
    public string PostLogoutRedirectUri { get; set; }
    public string ClientName { get; set; }
    public string SignOutIframeUrl { get; set; }

    public bool AutomaticRedirectAfterSignOut { get; set; }

    public string LogoutId { get; set; }
    public bool TriggerExternalSignout => ExternalAuthenticationScheme != null;
    public string ExternalAuthenticationScheme { get; set; }
}

public class AccountOptions
{
    public static bool AllowLocalLogin = true;
    public static bool AllowRememberLogin = true;
    public static TimeSpan RememberMeLoginDuration = TimeSpan.FromDays(30);

    public static bool ShowLogoutPrompt = true;
    public static bool AutomaticRedirectAfterSignOut = false;

    // specify the Windows authentication scheme being used
    public static readonly string WindowsAuthenticationSchemeName = IISDefaults.AuthenticationScheme;

    // if user uses windows auth, should we load the groups from windows
    public static bool IncludeWindowsGroups = false;

    public static string InvalidCredentialsErrorMessage = "Invalid username or password";
}