namespace MainService.Dtos
{
    public class VoteResponeDto
    {
        public ICollection<string> UpVote { get; set; } = null!;
        public ICollection<string> DownVote { get; set; } = null!;
    }
}