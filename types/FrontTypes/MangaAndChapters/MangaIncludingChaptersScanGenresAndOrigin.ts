import { Chapter, GenresOnMangas, Manga, Origin, Scan } from "@prisma/client";

export type MangaIncludingChaptersScanGenresAndOrigin = (Manga & {
    chapters: (Chapter & {
        scan: Scan | null;
    })[];
    genres: GenresOnMangas[];
    origin: Origin | null;
})
