using KnowledgeSpace.BackendServer.Services;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc;

namespace KnowledgeSpace.BackendServer.Extensions;

public static class ApplicationServiceExtensions
{
    public static void AddApplicationServices(this IServiceCollection services)
    {
        services.AddTransient<DbInitializer>();
        services.AddTransient<IEmailSender, EmailSenderService>();
        services.AddTransient<ISequenceService, SequenceService>();
        services.AddTransient<IStorageService, StorageService>();
        services.Configure<ApiBehaviorOptions>(options =>
        {
            options.SuppressModelStateInvalidFilter = true;
        });
    }
}