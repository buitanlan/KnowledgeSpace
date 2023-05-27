using System.Data;
using Dapper;
using Npgsql;

namespace KnowledgeSpace.BackendServer.Services;

public class SequenceService(IConfiguration configuration): ISequenceService
{
    public async Task<int> GetKnowledgeBaseNewId()
    {
        await using var conn = new NpgsqlConnection(configuration.GetConnectionString("DefaultConnection"));
        if (conn.State == ConnectionState.Closed)
        {
            await conn.OpenAsync();
        }

        var result = await conn.ExecuteScalarAsync<int>(@"SELECT (NEXT VALUE FOR KnowledgeBaseSequence)", null,
            null, 120, CommandType.Text);
        return result;
    }
}
