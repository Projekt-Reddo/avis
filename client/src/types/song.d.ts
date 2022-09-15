interface Song {
    sid: string,
    title: string,
    alias: string, 
    thumbnail: string,
    lyric: string,
    description: string,    
}

interface SongFilter{
    page: number,
    size: number,
    filter?:{
        title?: string,
        genres?: string[],
        createdStart?: string,
        createdEnd?: string,
        modifiedStart?: string,
        modifiedEnd?: string,
    }
}