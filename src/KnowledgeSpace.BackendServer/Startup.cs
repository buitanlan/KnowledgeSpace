using FluentValidation.AspNetCore;
using KnowledgeSpace.BackendServer.Extensions;
using KnowledgeSpace.ViewModels.Systems;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace KnowledgeSpace.BackendServer
{
    public class Startup
    {
        private const string KspSpecificOrigins = "KspSpecificOrigins";

        private readonly IConfiguration _config;
        public Startup(IConfiguration config)
        {
            _config = config;
        }
        
        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllersWithViews()
                .AddFluentValidation(fv => fv.RegisterValidatorsFromAssemblyContaining<RoleCreateRequestValidator>());
            services.AddRazorPages(options =>
            {
                options.Conventions.AddAreaFolderRouteModelConvention("Identity", "/Account/", model =>
                {
                    foreach (var selector in model.Selectors)
                    {
                        var attributeRouteModel = selector.AttributeRouteModel;
                        if (attributeRouteModel == null) continue;
                        attributeRouteModel.Order = -1;
                        if (attributeRouteModel.Template != null)
                            attributeRouteModel.Template = attributeRouteModel.Template.Remove(0, "Identity".Length);
                    }
                });
            });
            services.AddIdentityServices(_config);
            services.AddApplicationServices();
            services.AddSwaggerDocument();
            services.AddCors(options =>
            {
                options.AddPolicy(KspSpecificOrigins,
                    builder =>
                    {
                        builder.WithOrigins(_config["AllowOrigins"])
                            .AllowAnyHeader()
                            .AllowAnyMethod();
                    });
            });

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseErrorWrapping();
            
            app.UseStaticFiles();

            app.UseIdentityServer();

            app.UseAuthentication();
            
            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthorization();
            
            app.UseCors(KspSpecificOrigins);

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapDefaultControllerRoute();
                endpoints.MapRazorPages();
            });
            
            app.UseSwaggerDocument();

        }
    }
}
