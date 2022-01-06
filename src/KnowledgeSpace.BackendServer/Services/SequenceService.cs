﻿using System.Data;
using Dapper;
using Microsoft.Data.SqlClient;

namespace KnowledgeSpace.BackendServer.Services;

public class SequenceService: ISequenceService
{
    private readonly IConfiguration _configuration;

    public SequenceService(IConfiguration configuration)
    {
        _configuration = configuration;
    }
    public async Task<int> GetKnowledgeBaseNewId()
    {
        await using var conn = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
        if (conn.State == ConnectionState.Closed)
        {
            await conn.OpenAsync();
        }

        var result = await conn.ExecuteScalarAsync<int>(@"SELECT (NEXT VALUE FOR KnowledgeBaseSequence)", null,
            null, 120, CommandType.Text);
        return result;
    }
}