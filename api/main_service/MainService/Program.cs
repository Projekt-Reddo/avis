using Amazon.S3;
using Hangfire;
using Hangfire.PostgreSql;
using MainService.Data;
using MainService.Logic;
using MainService.Models;
using MainService.Services;
using MainService.Utils;
using Polly;
using Polly.Extensions.Http;
using static Constants;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// MongoDB config
var mongoDbSetting = new MongoDbSetting
{
    ConnectionString = Environment.GetEnvironmentVariable("MONGODB_CONNECTION_STRING") ?? builder.Configuration["MongoDbSetting:ConnectionString"],
    Database = builder.Configuration["MongoDbSetting:DatabaseName"]
};
builder.Services.AddSingleton(mongoDbSetting);
builder.Services.AddSingleton<IMongoContext, MongoContext>();
// Project Services
builder.Services.AddScoped<IAccountRepo, AccountRepo>();
builder.Services.AddScoped<IPostRepo, PostRepo>();
builder.Services.AddScoped<ICommentRepo, CommentRepo>();
builder.Services.AddScoped<ISongRepo, SongRepo>();
builder.Services.AddScoped<IReportRepo, ReportRepo>();
builder.Services.AddScoped<IGenreRepo, GenreRepo>();
// Logics
builder.Services.AddScoped<ISongLogic, SongLogic>();
builder.Services.AddScoped<IAccountLogic, AccountLogic>();
builder.Services.AddScoped<IGenreLogic, GenreLogic>();
// Other Services
builder.Services.AddScoped<IHumSvcClient, HumSvcClient>();
// AWS S3 config
builder.Services.AddDefaultAWSOptions(builder.Configuration.GetAWSOptions());
builder.Services.AddAWSService<IAmazonS3>();
builder.Services.AddSingleton<IS3Service, S3Service>();
// Mail settings
builder.Services.Configure<MailSettings>(builder.Configuration.GetSection("MailSettings"));
builder.Services.AddSingleton<IMailService, MailService>();
// Polly HttpClient
builder.Services.AddHttpClient(PollyHttpClient.CLIENT_NAME, client => { })
    .AddPolicyHandler(
        HttpPolicyExtensions.HandleTransientHttpError()
            .WaitAndRetryAsync(3, retryAttempt => TimeSpan.FromSeconds(Math.Pow(2, retryAttempt)))
    );
// CORS config
builder.Services.AddCors();
// Hangfire
// builder.Services.AddHangfire(config => config.UsePostgreSqlStorage(builder.Configuration.GetConnectionString("Hangfire")));
// builder.Services.AddHangfireServer();
// Auto mapper
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
builder.Services.AddControllers().ConfigureApiBehaviorOptions(opt =>
{
    opt.InvalidModelStateResponseFactory = ModelStateValidator.ValidateModelState;
});
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI();

app.UseCors(opt => opt.WithOrigins(builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>())
                      .AllowAnyHeader()
                      .AllowAnyMethod()
                      .AllowCredentials());

/*app.UseHttpsRedirection();*/

app.UseAuthorization();

app.MapControllers();

app.Run();
