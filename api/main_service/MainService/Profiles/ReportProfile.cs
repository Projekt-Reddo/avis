using AutoMapper;
using MainService.Dtos;
using MainService.Models;

namespace MainService.Profiles;

public class ReportProfile : Profile
{
    public ReportProfile()
    {
        CreateMap<ReportCreateDto, Report>();

        CreateMap<Report, ReportReadDto>();
    }
}
