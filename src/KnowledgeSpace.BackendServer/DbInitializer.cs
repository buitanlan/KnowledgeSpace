using KnowledgeSpace.BackendServer.Data.Entities;
using KnowledgeSpace.BackendServer.Data;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KnowledgeSpace.BackendServer
{
    public class DbInitializer
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private const string AdminRoleName = "Admin";
        private const string UserRoleName = "Member";

        public DbInitializer(ApplicationDbContext context,
          UserManager<User> userManager,
          RoleManager<IdentityRole> roleManager)
        {
            _context = context;
            _userManager = userManager;
            _roleManager = roleManager;
        }

        public async Task Seed()
        {
            #region Quyền

            if (!_roleManager.Roles.Any())
            {
                await _roleManager.CreateAsync(new IdentityRole
                {
                    Id = AdminRoleName,
                    Name = AdminRoleName,
                    NormalizedName = AdminRoleName.ToUpper(),
                });
                await _roleManager.CreateAsync(new IdentityRole
                {
                    Id = UserRoleName,
                    Name = UserRoleName,
                    NormalizedName = UserRoleName.ToUpper(),
                });
            }

            #endregion Quyền

            #region Người dùng

            if (!_userManager.Users.Any())
            {
                var result = await _userManager.CreateAsync(new User
                {
                    Id = Guid.NewGuid().ToString(),
                    UserName = "admin",
                    FirstName = "Quản trị",
                    LastName = "1",
                    Email = "tedu.international@gmail.com",
                    LockoutEnabled = false
                }, "Admin@123");
                if (result.Succeeded)
                {
                    var user = await _userManager.FindByNameAsync("admin");
                    await _userManager.AddToRoleAsync(user, AdminRoleName);
                }
            }

            #endregion Người dùng

            #region Chức năng

            if (!_context.Functions.Any())
            {
                _context.Functions.AddRange(new List<Function>
                {
                    new() {Id = "Dashboard", Name = "Thống kê", ParentId = null, SortOrder = 1,Url = "/dashboard"  },

                    new() {Id = "Content",Name = "Nội dung",ParentId = null,Url = "/content" },

                    new() {Id = "ContentCategory",Name = "Danh mục",ParentId ="Content",Url = "/content/category"  },
                    new() {Id = "ContentKnowledgeBase",Name = "Bài viết",ParentId = "Content",SortOrder = 2,Url = "/content/kb" },
                    new() {Id = "ContentComment",Name = "Trang",ParentId = "Content",SortOrder = 3,Url = "/content/comment" },
                    new() {Id = "ContentReport",Name = "Báo xấu",ParentId = "Content",SortOrder = 3,Url = "/content/report" },

                    new() {Id = "Statistic",Name = "Thống kê", ParentId = null, Url = "/statistic" },
                    new() {Id = "StatisticMonthlyNewMember",Name = "Đăng ký từng tháng",ParentId = "Statistic",SortOrder = 1,Url = "/statistic/monthly-register"},
                    new() {Id = "StatisticMonthlyNewKnowledgeBase",Name = "Bài đăng hàng tháng",ParentId = "Statistic",SortOrder = 2,Url = "/statistic/monthly-newkb"},
                    new() {Id = "StatisticMonthlyComment",Name = "Comment theo tháng",ParentId = "Statistic",SortOrder = 3,Url = "/statistic/monthly-comment" },

                    new() {Id = "System", Name = "Hệ thống", ParentId = null, Url = "/system" },
                    new() {Id = "SystemUser", Name = "Người dùng",ParentId = "System",Url = "/system/user"},
                    new() {Id = "SystemRole", Name = "Nhóm quyền",ParentId = "System",Url = "/system/role"},
                    new() {Id = "SystemFunction", Name = "Chức năng",ParentId = "System",Url = "/system/function"},
                    new() {Id = "SystemPermission", Name = "Quyền hạn",ParentId = "System",Url = "/system/permission"},
                });
                await _context.SaveChangesAsync();
            }

            if (!_context.Commands.Any())
            {
                _context.Commands.AddRange(new List<Command>()
                {
                    new() {Id = "View", Name = "Xem"},
                    new() {Id = "Create", Name = "Thêm"},
                    new() {Id = "Update", Name = "Sửa"},
                    new() {Id = "Delete", Name = "Xoá"},
                    new() {Id = "Approve", Name = "Duyệt"},
                });
            }

            #endregion Chức năng

            var functions = _context.Functions;

            if (!_context.CommandInFunctions.Any())
            {
                foreach (var function in functions)
                {
                    var createAction = new CommandInFunction()
                    {
                        CommandId = "Create",
                        FunctionId = function.Id
                    };
                    _context.CommandInFunctions.Add(createAction);

                    var updateAction = new CommandInFunction()
                    {
                        CommandId = "Update",
                        FunctionId = function.Id
                    };
                    _context.CommandInFunctions.Add(updateAction);
                    var deleteAction = new CommandInFunction()
                    {
                        CommandId = "Delete",
                        FunctionId = function.Id
                    };
                    _context.CommandInFunctions.Add(deleteAction);

                    var viewAction = new CommandInFunction()
                    {
                        CommandId = "View",
                        FunctionId = function.Id
                    };
                    _context.CommandInFunctions.Add(viewAction);
                }
            }

            if (!_context.Permissions.Any())
            {
                var adminRole = await _roleManager.FindByNameAsync(AdminRoleName);
                foreach (var function in functions)
                {
                    _context.Permissions.Add(new Permission(function.Id, adminRole.Id, "Create"));
                    _context.Permissions.Add(new Permission(function.Id, adminRole.Id, "Update"));
                    _context.Permissions.Add(new Permission(function.Id, adminRole.Id, "Delete"));
                    _context.Permissions.Add(new Permission(function.Id, adminRole.Id, "View"));
                }
            }

            await _context.SaveChangesAsync();
        }
    }
}