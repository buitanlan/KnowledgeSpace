using KnowledgeSpace.BackendServer.Data;
using KnowledgeSpace.BackendServer.Data.Entities;
using Microsoft.AspNetCore.Identity;
namespace KnowledgeSpace.BackendServer;

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
        var listFunction = new List<Function>
            {
                new() {Id = "Dashboard", Name = "Thống kê", ParentId = null, SortOrder = 1,Url = "/dashboard",Icon="fa-tachometer-alt"  },
                new() {Id = "Content",Name = "Nội dung",ParentId = null,Url ="/contents",Icon="fa-table" },
                new() {Id = "ContentCategory",Name = "Danh mục",ParentId ="Content",Url = "/contents/categories",Icon="fa-list" },
                new() {Id = "ContentKnowledgeBase",Name = "Bài viết",ParentId = "Content",SortOrder = 2,Url = "/contents/knowledge-bases",Icon="fa-edit" },
                new() {Id = "ContentComment",Name = "Trang",ParentId = "Content",SortOrder = 3,Url = "/contents/comments",Icon="fa-edit" },
                new() {Id = "ContentReport",Name = "Báo xấu",ParentId = "Content",SortOrder = 3,Url = "/contents/reports",Icon="fa-edit" },

                new() {Id = "Statistic",Name = "Thống kê", ParentId = null, Url = "/statistics",Icon="fa-chart-bar" },
                new() {Id = "StatisticMonthlyNewMember",Name = "Đăng ký từng tháng",ParentId = "Statistic",SortOrder = 1,Url = "/statistics/monthly-new-members",Icon = "fa-wrench"},
                new() {Id = "StatisticMonthlyNewKnowledgeBase",Name = "Bài đăng hàng tháng",ParentId = "Statistic",SortOrder = 2,Url = "/statistics/monthly-new-knowledge-bases",Icon = "fa-wrench"},
                new() {Id = "StatisticMonthlyComment",Name = "Comment theo tháng",ParentId = "Statistic",SortOrder = 3,Url = "/statistics/monthly-new-comments",Icon = "fa-wrench" },

                new() {Id = "System", Name = "Hệ thống", ParentId = null, Url = "/systems",Icon="fa-th-list" },
                new() {Id = "SystemUser", Name = "Người dùng",ParentId = "System",Url = "/systems/users",Icon="fa-desktop"},
                new() {Id = "SystemRole", Name = "Nhóm quyền",ParentId = "System",Url = "/systems/roles",Icon="fa-desktop"},
                new() {Id = "SystemFunction", Name = "Chức năng",ParentId = "System",Url = "/systems/functions",Icon="fa-desktop"},
                new() {Id = "SystemPermission", Name = "Quyền hạn",ParentId = "System",Url = "/systems/permissions",Icon="fa-desktop"},
            };

        if (!_context.Functions.Any())
        {   
            _context.Functions.AddRange(listFunction);
        }

        if (!_context.Commands.Any())
        {
            _context.Commands.AddRange(new List<Command>
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
            foreach (var function in listFunction)
            {
                var createAction = new CommandInFunction
                {
                    CommandId = "Create",
                    FunctionId = function.Id
                };
                _context.CommandInFunctions.Add(createAction);

                var updateAction = new CommandInFunction
                {
                    CommandId = "Update",
                    FunctionId = function.Id
                };
                _context.CommandInFunctions.Add(updateAction);
                var deleteAction = new CommandInFunction
                {
                    CommandId = "Delete",
                    FunctionId = function.Id
                };
                _context.CommandInFunctions.Add(deleteAction);

                var viewAction = new CommandInFunction
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
            foreach (var function in listFunction)
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