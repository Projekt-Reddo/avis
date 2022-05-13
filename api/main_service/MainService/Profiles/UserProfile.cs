using AutoMapper;
using MainService.Dtos;
using MainService.Models;

namespace MainService.Profiles
{
    public class UserProfile : Profile
    {
        public UserProfile()
        {
            CreateMap<UserCreateDto, User>();

            CreateMap<User, UserReadDto>();

            CreateMap<UserUpdateDto, User>();
        }
    }
}