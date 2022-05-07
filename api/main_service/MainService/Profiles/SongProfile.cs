using AutoMapper;
using MainService.Dtos;
using MainService.Models;

namespace MainService.Profiles
{
    public class SongProfile : Profile
    {
        public SongProfile()
        {
            CreateMap<SongCreateDto, Song>();

            CreateMap<Song, SongReadDto>();

            CreateMap<SongUpdateDto, Song>();
        }
    }
}