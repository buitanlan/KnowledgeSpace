using KnowledgeSpace.BackendServer.Data;
using KnowledgeSpace.BackendServer.Services;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.Extensions.DependencyInjection;

namespace KnowledgeSpace.BackendServer.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            services.AddTransient<DbInitializer>();
            services.AddTransient<IEmailSender, EmailSenderService>();
            services.AddTransient<ISequenceService, SequenceService>();
            return services;
        }
    }
}