using System.Data;
using Dapper;
using KnowledgeSpace.BackendServer.Authorization;
using KnowledgeSpace.BackendServer.Constants;
using KnowledgeSpace.ViewModels.Systems;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

namespace KnowledgeSpace.BackendServer.Controllers;

public class PermissionsController : BaseController
{
	private readonly IConfiguration _configuration;

	public PermissionsController(IConfiguration configuration)
	{
		_configuration = configuration;
	}

	[HttpGet]
	[ClaimRequirement(FunctionCode.SystemPermission, CommandCode.View)]

	public async Task<IActionResult> GetCommandViews()
	{
		await using var conn = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
		if (conn.State == ConnectionState.Closed)
		{
			await conn.OpenAsync();
		}

		var sql = @"SELECT f.Id,
	                       f.Name,
	                       f.ParentId,
	                       sum(case when sa.Id = 'Create' then 1 else 0 end) as HasCreate,
	                       sum(case when sa.Id = 'Update' then 1 else 0 end) as HasUpdate,
	                       sum(case when sa.Id = 'Delete' then 1 else 0 end) as HasDelete,
	                       sum(case when sa.Id = 'View' then 1 else 0 end) as HasView,
	                       sum(case when sa.Id = 'Approve' then 1 else 0 end) as HasApprove
                        from Functions f join CommandInFunctions cif on f.Id = cif.FunctionId
		                    left join Commands sa on cif.CommandId = sa.Id
                        group by f.Id,f.Name, f.ParentId
                        order by f.ParentId";

		var result = await conn.QueryAsync<PermissionScreenVm>(sql, null, null, 120, CommandType.Text);
		return Ok(result.ToList());
	}
}