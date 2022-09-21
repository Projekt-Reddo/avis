using AutoMapper;
using MainService.Dtos;
using MainService.Models;

namespace MainService.Profiles
{
    public class AccountProfile : Profile
    {
        public AccountProfile()
        {
            CreateMap<AccountCreateDto, Account>();

            CreateMap<Account, AccountReadDto>();

            CreateMap<AccountUpdateDto, Account>();

            CreateMap<Account, AccountResponseDto>()
                    .ForMember(a => a.JoinedDate,opt => opt.MapFrom(src => src.CreatedAt))
                    .ForMember(a => a.IsBanned,opt => opt.MapFrom(src => src.Status.IsBanned))
                    .ForMember(a => a.PostMutedUntil,opt => opt.MapFrom(src => src.Status.PostMutedUntil))
                    .ForMember(a => a.CommentMutedUntil,opt => opt.MapFrom(src => src.Status.CommentMutedUntil));
        }
    }
}