export interface FileInfo {
    accountId: string
    action: string
    bucketId: string
    contentLength: number
    contentSha1: string
    contentType: string
    fileId: string
    fileInfo: FileInfo
    fileName: string
    size: number
    uploadTimestamp: number
}

export interface FileInfo {
    src_last_modified_millis: string
}