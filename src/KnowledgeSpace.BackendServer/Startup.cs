using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using KnowledgeSpace.BackendServer.Extensions;
using KnowledgeSpace.BackendServer.Data;
using Microsoft.EntityFrameworkCore;
using FluentValidation.AspNetCore;
using KnowledgeSpace.BackendServer.Data.Entities;
using KnowledgeSpace.BackendServer.IdentityServer;
using KnowledgeSpace.ViewModels.Systems;

namespace KnowledgeSpace.BackendServer
{
    public class Startup
    {
        private readonly IConfiguration _config;
        public Startup(IConfiguration config)
        {
            _config = config;
        }
        
        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllersWithViews()
                .AddFluentValidation(fv => fv.RegisterValidatorsFromAssemblyContaining<RoleVmValidator>());
            services.AddRazorPages();
            services.AddDbContext<ApplicationDbContext>(opt =>
            {
                opt.UseSqlServer(_config.GetConnectionString("DefaultConnection"));
            });
            services.AddApplicationServices();
            services.AddIdentityServices(_config);
            var builder = services.AddIdentityServer(options =>
                {
                    options.Events.RaiseErrorEvents = true;
                    options.Events.RaiseInformationEvents = true;
                    options.Events.RaiseFailureEvents = true;
                    options.Events.RaiseSuccessEvents = true;
                })
                .AddInMemoryApiResources(Config.Apis)
                .AddInMemoryClients(Config.Clients)
                .AddInMemoryIdentityResources(Config.Ids)
                .AddAspNetIdentity<User>();
            services.AddSwaggerDocument();

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwaggerDocument();
            }

            app.UseStaticFiles();

            app.UseIdentityServer();

            app.UseAuthentication();
            
            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapDefaultControllerRoute();
                endpoints.MapRazorPages();
            });
        }
    }
}
