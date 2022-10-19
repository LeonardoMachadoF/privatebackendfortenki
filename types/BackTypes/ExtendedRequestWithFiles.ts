import { NextApiRequest } from "next"
import { UploadedFile } from "./UploadedFile";

export type NextApiRequestWithFiles = NextApiRequest & {
    files: UploadedFile[]
};
