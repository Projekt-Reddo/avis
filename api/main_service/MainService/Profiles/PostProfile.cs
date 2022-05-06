using AutoMapper;
using MainService.Dtos;
using MainService.Models;

namespace MainService.Profiles
{
    public class PostProfile : Profile
    {
        public PostProfile()
        {
            CreateMap<PostDto, Post>();
        }
    }
}