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
        }
    }
}