using AutoMapper;
using MainService.Dtos;
using MainService.Models;

namespace MainService.Profiles
{
    public class PostProfile : Profile
    {
        public PostProfile()
        {
            CreateMap<PostCreateDto, Post>();

            CreateMap<Post, PostReadDto>();

            CreateMap<PostUpdateDto, Post>();

            CreateMap<Post, ListPostDto>()
                .ForMember(dest => dest.CommentCount, src => src.MapFrom(x => x.Comments!.Count()));
        }
    }
}