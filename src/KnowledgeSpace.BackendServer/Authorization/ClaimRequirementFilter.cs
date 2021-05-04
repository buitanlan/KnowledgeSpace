using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using KnowledgeSpace.BackendServer.Constants;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace KnowledgeSpace.BackendServer.Authorization
{
    public class ClaimRequirementFilter: IAuthorizationFilter
    {
        private readonly FunctionCode _functionCode;
        private readonly CommandCode _commandCode;

        public ClaimRequirementFilter(FunctionCode functionCode, CommandCode commandCode)
        {
            _functionCode = functionCode;
            _commandCode = commandCode;
        }

        public void OnAuthorization(AuthorizationFilterContext context)
        {
            var permissionsClaim = context.HttpContext.User.Claims
                .SingleOrDefault(c => c.Type == SystemConstants.Claims.Permissions);
            if (permissionsClaim is not null)
            {
                var permissions = JsonSerializer.Deserialize<List<string>>(permissionsClaim.Value);
                if (permissions is not null && !permissions.Contains(_functionCode + "_" + _commandCode))
                {
                    context.Result = new ForbidResult();
                }
            }
            else
            {
                context.Result = new ForbidResult();
            }
        }
    }
}