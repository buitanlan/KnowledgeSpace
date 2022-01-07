using KnowledgeSpace.BackendServer.Areas.Identity;

[assembly: HostingStartup(typeof(IdentityHostingStartup))]
namespace KnowledgeSpace.BackendServer.Areas.Identity;

public class IdentityHostingStartup : IHostingStartup
{
    public void Configure(IWebHostBuilder builder)
    {
        builder.ConfigureServices((_, _) => {});
    }
}