
using KnowledgeSpace.BackendServer.Controllers;
using Microsoft.AspNetCore.Identity;
using Moq;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace KnowledgeSpace.BackendServer.UnitTest.Controllers
{
    public class RolesControllerTest
    {

        [Fact]
        public void RolesController_ShouldCreateInstance_NotNull()
        {
            var roleStore = new Mock<IRoleStore<IdentityRole>>();
            var mokRoleManager = new Mock<RoleManager<IdentityRole>>(roleStore.Object,  null, null, null, null);
            var rolesController = new RolesController(mokRoleManager.Object);
            Assert.NotNull(rolesController);
        }
    }
}
