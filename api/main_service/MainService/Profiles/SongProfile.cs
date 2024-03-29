using AutoMapper;
using MainService.Dtos;
using MainService.Models;
using MainService.Utils;

namespace MainService.Profiles
{
    public class SongProfile : Profile
    {
        public SongProfile()
        {
            CreateMap<SongCreateDto, Song>()
                .ForMember(dest => dest.Thumbnail, src => src.Ignore())
                .ForMember(dest => dest.ArtistIds, src => src.MapFrom(src => MongoIdUtils.ConvertStringArrToObjectIdArr(src.ArtistIds)));

            CreateMap<Song, SongReadDto>()
                .ForMember(dest => dest.ArtistIds, src => src.MapFrom(src => MongoIdUtils.ConvertObjectIdArrToStringArr(src.ArtistIds)));

            CreateMap<SongUpdateDto, Song>()
                .ForMember(dest => dest.Thumbnail, src => src.Ignore())
                .ForMember(dest => dest.ArtistIds, src => src.MapFrom(src => MongoIdUtils.ConvertStringArrToObjectIdArr(src.ArtistIds)));

            CreateMap<Song, SongManageListDto>();
        }
    }
}