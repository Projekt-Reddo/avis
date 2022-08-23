using AutoMapper;
using MainService.Dtos;
using MainService.Models;

namespace MainService.Profiles;

public class MediaProfile : Profile
{
    public MediaProfile()
    {
        CreateMap<Media, MediaReadDto>();
    }
}