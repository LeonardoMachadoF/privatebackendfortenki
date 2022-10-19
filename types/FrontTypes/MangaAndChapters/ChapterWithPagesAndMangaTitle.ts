import { Chapter, Page } from "@prisma/client";

export type ChapterWithPagesAndMangaTitle = (Chapter & {
    pages: Page[];
    manga: {
        title: string;
    } | null;
})