namespace MainService.Dtos;

public class PaginationReqDto<T>
{
    public int Page { get; set; }

    public int Size { get; set; }

    public T Filter { get; set; } = default(T)!;
}

public class PaginationResDto<T>
{
    public int Total { get; set; } = 0;

    public IEnumerable<T> Payload { get; set; } = default(IEnumerable<T>)!;

    public PaginationResDto()
    {
    }

    public PaginationResDto(int total, IEnumerable<T> payload)
    {
        this.Total = total;
        this.Payload = payload;
    }
}
