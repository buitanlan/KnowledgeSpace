using FluentValidation.AspNetCore;
using KnowledgeSpace.BackendServer;
using KnowledgeSpace.BackendServer.Data;
using KnowledgeSpace.BackendServer.Extensions;
using KnowledgeSpace.ViewModels.Systems;
using Microsoft.EntityFrameworkCore;
using Serilog;

const string KspSpecificOrigins = "KspSpecificOrigins";


var builder = WebApplication.CreateBuilder(args);
builder.Logging.ClearProviders();

builder.Services.AddControllersWithViews()
    .AddFluentValidation(fv => fv.RegisterValidatorsFromAssemblyContaining<RoleCreateRequestValidator>());
builder.Services.AddRazorPages(options =>
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
builder.Services.AddIdentityServices(builder.Configuration);
builder.Services.AddApplicationServices();
builder.Services.AddSwaggerDocument();
builder.Services.AddCors(options =>
{
    options.AddPolicy(KspSpecificOrigins,
        policy =>
        {
            policy.WithOrigins(builder.Configuration["AllowOrigins"])
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});
var logger = new LoggerConfiguration()
            .Enrich.FromLogContext()
            .WriteTo.Console()
            .CreateLogger();
builder.WebHost.UseSerilog((hostingContext, loggerConfiguration) => loggerConfiguration
    .ReadFrom.Configuration(hostingContext.Configuration));
var app = builder.Build();
using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;
try
{
    var context = services.GetRequiredService<ApplicationDbContext>();
    await context.Database.MigrateAsync();
    Log.Information("Seeding data...");
    var dbInitializer = services.GetService<DbInitializer>();
    dbInitializer?.Seed().Wait();
}
catch(Exception ex)
{
    Log.Error(ex, "An error occurred while seeding the database");
}
if (app.Environment.IsDevelopment())
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
await app.RunAsync();
