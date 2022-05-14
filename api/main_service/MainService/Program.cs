using Amazon.S3;
using MainService.Data;
using MainService.Models;
using MainService.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

#region MongoDB config

var mongoDbSetting = new MongoDbSetting
{
    ConnectionString = Environment.GetEnvironmentVariable("MONGODB_CONNECTION_STRING") ?? builder.Configuration["MongoDbSetting:ConnectionString"],
    Database = builder.Configuration["MongoDbSetting:DatabaseName"]
};

builder.Services.AddSingleton(mongoDbSetting);
builder.Services.AddSingleton<IMongoContext, MongoContext>();

#endregion

// Project Services
builder.Services.AddScoped<IPostRepo, PostRepo>();
builder.Services.AddScoped<ICommentRepo, CommentRepo>();

#region AWS S3 config

builder.Services.AddDefaultAWSOptions(builder.Configuration.GetAWSOptions());
builder.Services.AddAWSService<IAmazonS3>();
builder.Services.AddSingleton<IS3Service, S3Service>();

#endregion

#region Mail settings

builder.Services.Configure<MailSettings>(builder.Configuration.GetSection("MailSettings"));
builder.Services.AddTransient<IMailService, MailService>();

#endregion

// CORS config
builder.Services.AddCors();

// Auto mapper
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
// if (app.Environment.IsDevelopment())
// {
app.UseSwagger();
app.UseSwaggerUI();
// }

app.UseCors(opt => opt.WithOrigins(builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>())
                      .AllowAnyHeader()
                      .AllowAnyMethod()
                      .AllowAnyOrigin());

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
