using AutoMapper;
using MainService.Dtos;
using MainService.Models;

namespace MainService.Profiles;

public class GenreProfile : Profile
{
    public GenreProfile()
    {
        CreateMap<Genre, GenreReadDto>();
        CreateMap<GenreCreateDto, Genre>();
    }
}
