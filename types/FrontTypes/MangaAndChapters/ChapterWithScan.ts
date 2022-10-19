import { Chapter, Scan } from "@prisma/client";

export type ChapterWithScan = (Chapter & {
    scan: Scan | null;
}) | undefined;