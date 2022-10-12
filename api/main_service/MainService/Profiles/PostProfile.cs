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

            CreateMap<Post, PostReadDto>()
                .ForMember(dest => dest.Comment, src => src.MapFrom(x => x.CommentIds!.Count()))
                .ForMember(dest => dest.Upvote, src => src.MapFrom(x => x.UpvotedBy!.Count()))
                .ForMember(dest => dest.Downvote, src => src.MapFrom(x => x.DownvotedBy!.Count()));

            CreateMap<PostUpdateDto, Post>();

            CreateMap<Post, ListPostDto>()
                .ForMember(dest => dest.CommentCount, src => src.MapFrom(x => x.CommentIds!.Count()));

            CreateMap<Post, PostListCommentDto>();
        }
    }
}