import { Chapter, GenresOnMangas, Manga, Origin, Scan } from "@prisma/client";

export type MangaIncludingChaptersScanGenresAndGenreAndOrigin = (Manga & {
    genres: (GenresOnMangas & {
        genre: {
            slug: string;
            name: string;
        };
    })[];
    chapters: (Chapter & {
        scan: Scan | null;
    })[];
    origin: Origin | null;
});