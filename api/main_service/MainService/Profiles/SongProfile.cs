using AutoMapper;
using MainService.Dtos;
using MainService.Models;

namespace MainService.Profiles
{
    public class SongProfile : Profile
    {
        public SongProfile()
        {
            CreateMap<SongCreateDto, Song>()
                .ForMember(dest => dest.Thumbnail, src => src.Ignore());

            CreateMap<Song, SongReadDto>();

            CreateMap<SongUpdateDto, Song>();

            CreateMap<Song, SongManageListDto>();
        }
    }
}