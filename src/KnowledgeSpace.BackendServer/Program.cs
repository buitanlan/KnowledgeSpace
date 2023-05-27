using FluentValidation;
using FluentValidation.AspNetCore;
using KnowledgeSpace.BackendServer;
using KnowledgeSpace.BackendServer.Data;
using KnowledgeSpace.BackendServer.Extensions;
using KnowledgeSpace.ViewModels.Systems;
using Microsoft.EntityFrameworkCore;
using Serilog;

var builder = WebApplication.CreateSlimBuilder(args);
builder.Logging.ClearProviders();
builder.Services.AddControllersWithViews();
builder.Services.AddFluentValidationAutoValidation()
                .AddFluentValidationClientsideAdapters()
                .AddValidatorsFromAssembly(typeof(RoleCreateRequestValidator).Assembly);

builder.Services.AddRazorPages(options =>
{
    options.Conventions.AddAreaFolderRouteModelConvention("Identity", "/Account/", model =>
    {
        foreach (var selector in model.Selectors)
        {
            var attributeRouteModel = selector.AttributeRouteModel;
            if (attributeRouteModel is null) continue;
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
    options.AddPolicy("CorsPolicy",
        policy =>
        {
            policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:4200");
        });
});
var logger = new LoggerConfiguration()
            .Enrich.FromLogContext()
            .WriteTo.Console()
            .CreateLogger();
builder.Host.UseSerilog((hostingContext, loggerConfiguration) => loggerConfiguration
    .ReadFrom.Configuration(hostingContext.Configuration));
var app = builder.Build();
using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;
try
{
    var context = services.GetRequiredService<ApplicationDbContext>();
    await context.Database.MigrateAsync();
    Log.Information("Seeding data...");
    var dbInitializer = services.GetRequiredService<DbInitializer>();
    await dbInitializer.Seed();
}
catch(Exception ex)
{
    Log.Error(ex, "An error occurred while seeding the database");
}
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseErrorWrapping();
app.UseStaticFiles();
app.UseIdentityServer();
app.UseAuthentication();
app.UseHttpsRedirection();
app.UseRouting();
app.UseAuthorization();
app.UseCors("CorsPolicy");
app.MapDefaultControllerRoute();
app.MapRazorPages();
app.UseSwaggerDocument();
await app.RunAsync();
