using AutoMapper;
using MainService.Dtos;
using MainService.Models;

namespace MainService.Profiles;

public class UrlProfile : Profile
{
    public UrlProfile()
    {
        CreateMap<Url, UrlReadDto>();

        CreateMap<UrlCreateDto, Url>();
    }
}
