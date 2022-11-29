FROM mcr.microsoft.com/dotnet/aspnet:6.0-focal AS base
WORKDIR /app
EXPOSE 5234

ENV ASPNETCORE_URLS=http://+:5234
# This for logging prettier
ENV Logging__Console__FormatterName=Simple

# Creates a non-root user with an explicit UID and adds permission to access the /app folder
# For more info, please refer to https://aka.ms/vscode-docker-dotnet-configure-containers
RUN adduser -u 5678 --disabled-password --gecos "" appuser && chown -R appuser /app
USER appuser

# Restore
FROM mcr.microsoft.com/dotnet/sdk:6.0-focal AS build
WORKDIR /src
COPY ./*.sln .
COPY ./MainService/*.csproj MainService/
COPY ./MainServiceTest/*.csproj MainServiceTest/
RUN dotnet restore
COPY . .

# Testing
FROM build as test
WORKDIR /src/MainService
RUN dotnet build
WORKDIR /src/MainServiceTest
RUN dotnet test

# Publish
FROM build AS publish
WORKDIR /src/MainService
RUN dotnet publish -c Release -o /app/publish --runtime linux-x64 /p:UseAppHost=true

# Final image
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Run on local docker
# ENTRYPOINT ["dotnet", "MainService.dll"]

# Run on Heroku
# CMD ASPNETCORE_URLS=http://*:$PORT dotnet MainService.dll --timezone "SE Asia Standard Time"
CMD ASPNETCORE_URLS=http://*:$PORT dotnet MainService.dll