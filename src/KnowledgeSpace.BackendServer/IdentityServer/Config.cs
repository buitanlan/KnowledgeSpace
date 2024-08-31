using Duende.IdentityServer.Models;

namespace KnowledgeSpace.BackendServer.IdentityServer;

public class Config
{
    public static IEnumerable<IdentityResource> Ids =>
    [
        new IdentityResources.OpenId(),
        new IdentityResources.Profile()
    ];

    public static IEnumerable<ApiScope> Apis =
    [
        new("api.knowledgespace", "KnowledgeSpace API")
    ];
}
