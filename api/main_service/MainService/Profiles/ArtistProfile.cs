using AutoMapper;
using MainService.Dtos;
using MainService.Models;

namespace MainService.Profiles;

public class ArtistProfile : Profile
{
    public ArtistProfile()
    {
        CreateMap<Artist, ArtistReadDto>();
    }
}