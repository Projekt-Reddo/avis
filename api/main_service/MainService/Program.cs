using MainService.Data;

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

// CORS config
builder.Services.AddCors();

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
