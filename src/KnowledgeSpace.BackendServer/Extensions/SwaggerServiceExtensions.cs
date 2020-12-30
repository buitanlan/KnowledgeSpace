using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using System;

namespace KnowledgeSpace.BackendServer.Extensions
{
    public static class SwaggerServiceExtensions
    {
        public static IServiceCollection AddSwaggerDocument(this IServiceCollection services)
        {
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "KnowledgeBase",
                    Version = "v1",
                    Contact = new OpenApiContact
                    {
                        Name = "Bùi Tấn Lân",
                        Email = "tanlanhcmus@gmail.com",
                        Url = new Uri("https://dev.azure.com/tanlanhcmus/KnowledgeSpace")
                    },
                    License = new OpenApiLicense
                    {
                        Name = "MIT License",
                        //Url = new Uri("https://example.com/license"),
                    }
                });
                var securitySchema = new OpenApiSecurityScheme
                {
                    Description = "JWT Auth Bearer Scheme",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.Http,
                    Scheme = "bearer",
                    Reference = new OpenApiReference
                    {
                        Type = ReferenceType.SecurityScheme,
                        Id = "Bearer"
                    }
                };
                c.AddSecurityDefinition("Bearer", securitySchema);
                var securityRequirement = new OpenApiSecurityRequirement { { securitySchema, new[] { "Bearer" } } };
                c.AddSecurityRequirement(securityRequirement);
            });
            return services;
        }
        public static IApplicationBuilder UseSwaggerDocument(this IApplicationBuilder app)
        {
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "KnowledgeBase API v1");
            });
            return app;
        }

    }
}