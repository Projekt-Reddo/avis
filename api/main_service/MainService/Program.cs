using Amazon.S3;
using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using Hangfire;
using Hangfire.Dashboard;
using Hangfire.PostgreSql;
using HangfireBasicAuthenticationFilter;
using MainService.Data;
using MainService.Dtos;
using MainService.Logic;
using MainService.Models;
using MainService.Services;
using MainService.Utils;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
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
builder.Services.AddScoped<IArtistRepo, ArtistRepo>();

// Logics
builder.Services.AddScoped<ISongLogic, SongLogic>();
builder.Services.AddScoped<IAccountLogic, AccountLogic>();
builder.Services.AddScoped<IGenreLogic, GenreLogic>();
builder.Services.AddScoped<IArtistLogic, ArtistLogic>();
builder.Services.AddScoped<ICommentLogic, CommentLogic>();
builder.Services.AddScoped<IPostLogic, PostLogic>();
builder.Services.AddScoped<IReportLogic, ReportLogic>();

// Other Services
builder.Services.AddScoped<IHumSvcClient, HumSvcClient>();

// AWS S3 config
builder.Services.AddDefaultAWSOptions(builder.Configuration.GetAWSOptions());
builder.Services.AddAWSService<IAmazonS3>();
builder.Services.AddSingleton<IS3Service, S3Service>();
builder.Services.AddScoped<IFileStorageService, FileStorageService>();

// Mail settings
builder.Services.Configure<MailSettings>(builder.Configuration.GetSection("MailSettings"));
builder.Services.AddSingleton<IMailService, MailService>();

// Polly HttpClient
builder.Services.AddHttpClient(PollyHttpClient.CLIENT_NAME, client => { })
	.AddPolicyHandler(
		HttpPolicyExtensions.HandleTransientHttpError()
			.WaitAndRetryAsync(3, retryAttempt => TimeSpan.FromSeconds(Math.Pow(2, retryAttempt)))
	);

// Authentication
string credBase64 = Environment.GetEnvironmentVariable("FIREBASE_TOKEN") ?? builder.Configuration.GetValue<string>("FirebaseToken") ?? "";
string cred = System.Text.Encoding.UTF8.GetString(System.Convert.FromBase64String(credBase64)); // Raw JSON cause error in ENV
FirebaseApp.Create(new AppOptions
{
	Credential = GoogleCredential.FromJson(cred),
});
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
	.AddJwtBearer(opt =>
	{
		opt.Authority = builder.Configuration.GetValue<string>("Jwt:Authority");
		opt.TokenValidationParameters = new TokenValidationParameters
		{
			ValidateLifetime = true,
			ValidateIssuer = false,
			ValidateAudience = false,
			ValidateIssuerSigningKey = true,
		};
	});

// Authorization
builder.Services.AddAuthorization();

// CORS config
builder.Services.AddCors();

// Hangfire
builder.Services.AddHangfire(config => config.UsePostgreSqlStorage(Environment.GetEnvironmentVariable("HANGFIRE_CONNECTION_STRING") ?? builder.Configuration.GetConnectionString("Hangfire")));
builder.Services.AddHangfireServer();

// Auto mapper
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
builder.Services.AddControllers().ConfigureApiBehaviorOptions(opt =>
{
	opt.InvalidModelStateResponseFactory = ModelStateValidator.ValidateModelState;
});
builder.Services.AddRouting(opt => opt.LowercaseUrls = true); // Display lowercase url in swagger

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(opt =>
{
	var jwtSecurityScheme = new OpenApiSecurityScheme
	{
		Scheme = "bearer",
		BearerFormat = "JWT",
		Name = "JWT Authentication",
		In = ParameterLocation.Header,
		Type = SecuritySchemeType.Http,
		Description = "Put **_ONLY_** your JWT Bearer token (Access Token) on textbox below!",

		Reference = new OpenApiReference
		{
			Id = JwtBearerDefaults.AuthenticationScheme,
			Type = ReferenceType.SecurityScheme
		}
	};
	opt.AddSecurityDefinition(jwtSecurityScheme.Reference.Id, jwtSecurityScheme);
	opt.AddSecurityRequirement(new OpenApiSecurityRequirement
	{
		{ jwtSecurityScheme, Array.Empty<string>() }
	});
});

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI();

app.UseCors(opt => opt.WithOrigins(builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>())
					  .AllowAnyHeader()
					  .AllowAnyMethod()
					  .AllowCredentials());

/*app.UseHttpsRedirection();*/

app.UseExceptionHandler(e => e.Run(async context =>
{
	var exception = context.Features.Get<IExceptionHandlerPathFeature>()!.Error;
	await context.Response.WriteAsJsonAsync(new ResponseDto(500, exception.Message));
}));

app.Use(async (context, next) =>
{
	await next();

	if (context.Response.StatusCode == (int)System.Net.HttpStatusCode.Unauthorized)
	{
		context.Response.ContentType = "application/json";
		await context.Response.WriteAsync(
			JsonConvert.SerializeObject(
				new ResponseDto(401),
				new JsonSerializerSettings
				{
					ContractResolver = new CamelCasePropertyNamesContractResolver()
				}
			));
	}

	if (context.Response.StatusCode == (int)System.Net.HttpStatusCode.Forbidden)
	{
		context.Response.ContentType = "application/json";
		await context.Response.WriteAsync(
			JsonConvert.SerializeObject(
				new ResponseDto(403),
				new JsonSerializerSettings
				{
					ContractResolver = new CamelCasePropertyNamesContractResolver()
				}
			));
	}
});

app.UseAuthentication();

app.UseAuthorization();

app.UseHangfireDashboard(
	"/hangfire",
	new DashboardOptions
	{
		Authorization = new[]  {
				new HangfireCustomBasicAuthenticationFilter{
					User = Environment.GetEnvironmentVariable("HANGFIRE_USERNAME") ?? builder.Configuration.GetValue<string>("HangfireSettings:UserName"),
					Pass = Environment.GetEnvironmentVariable("HANGFIRE_PASSWORD") ?? builder.Configuration.GetValue<string>("HangfireSettings:Password")
				}
			}
	});
app.MapControllers();

app.Run();
