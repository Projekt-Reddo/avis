using AutoMapper;
using MainService.Dtos;
using MainService.Models;

namespace MainService.Profiles
{
	public class NotifyProfile : Profile
	{
		public NotifyProfile()
		{
			CreateMap<EventDto, Notify>();
		}
	}
}