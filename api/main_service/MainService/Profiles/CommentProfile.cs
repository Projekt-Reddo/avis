using AutoMapper;
using MainService.Dtos;
using MainService.Models;

namespace MainService.Profiles
{
    public class CommentProfile : Profile
    {
        public CommentProfile()
        {
            CreateMap<CommentCreateDto, Comment>()
                .ForMember(dest => dest.Media, src => src.Ignore());

            CreateMap<Comment, CommentReadDto>();

            CreateMap<CommentUpdateDto, Comment>();
        }
    }
}