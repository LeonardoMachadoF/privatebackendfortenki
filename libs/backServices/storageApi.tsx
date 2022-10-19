import axios from 'axios';
import crypto from 'node:crypto';
import fs from 'fs';
import { unlinkSync } from 'node:fs';
import { Credentials } from '../../types/BackTypes/Credentials';
import { FileInfo } from '../../types/BackTypes/FileInfo';
import { UploadedFile } from '../../types/BackTypes/UploadedFile';
import { deleteFileCredentials } from '../../types/BackTypes/deleteFileCredentials';

export const storageApi = {
    getCredentials: async () => {
        let accountId = process.env.ACCOUNT_ID;
        let applicationKey = process.env.APPLICATION_KEY;
        let encodedBase64 = new Buffer(accountId + ':' + applicationKey).toString('base64');
        let bucketName = process.env.BUCKET_NAME;
        let bucketId = process.env.BUCKET_ID;

        let credentials = await axios.post(
            `https:/api.backblazeb2.com/b2api/v1/b2_authorize_account`,
            {},
            {
                headers: {
                    Authorization: 'Basic ' + encodedBase64
                }
            })

        return {
            accountId: accountId as string,
            applicationKey: applicationKey as string,
            apiUrl: credentials.data.apiUrl,
            authorizationToken: credentials.data.authorizationToken,
            downloadUrl: credentials.data.downloadUrl,
            recommendedPartSize: credentials.data.recommendedPartSize,
            bucketName: bucketName as string,
            bucketId: bucketId as string
        }
    },
    getImagesUrl: async (credentials: Credentials, path: string) => {
        let rawData = await axios.post(
            credentials.apiUrl + '/b2api/v1/b2_list_file_names',
            {
                bucketId: credentials.bucketId,
                prefix: path
            },
            {
                headers: { Authorization: credentials.authorizationToken }
            }
        )

        let newArray: string[] = []
        rawData.data.files.map((file: FileInfo) => {
            if (file.size > 0) {
                newArray.push(credentials.downloadUrl + '/file/' + credentials.bucketName + '/' + file.fileName)
            }
        })

        return newArray;
    },
    getUploadCredentials: async (credentials: Credentials) => {
        let rawData = await axios.post(
            credentials.apiUrl + '/b2api/v1/b2_get_upload_url',
            {
                bucketId: credentials.bucketId,
            },
            {
                headers: { Authorization: credentials.authorizationToken }
            }
        )

        return rawData.data
    },
    uploadChapterPages: async (credentials: Credentials, pages: UploadedFile[], path: string) => {
        let urls: string[] = [];
        let aditionalPagesInfo: { fileName: string, fileId: string }[] = [];

        await Promise.all(pages.map(async (page: UploadedFile) => {
            let uploadCredentials = await storageApi.getUploadCredentials(credentials)
            let uploadUrl = uploadCredentials.uploadUrl;
            let uploadAuthorizationToken = uploadCredentials.authorizationToken;

            var source = fs.readFileSync(page.path)
            let uploadResponse = await axios.post(
                uploadUrl,
                source,
                {
                    headers: {
                        Authorization: uploadAuthorizationToken,
                        "X-Bz-File-Name": `${path}/${page.filename.split(' ').join('-')}`,
                        "Content-Type": "b2/x-auto",
                        "Content-Length": page.size,
                        "X-Bz-Content-Sha1": crypto.createHash('sha1').update(source).digest("hex"),
                        "X-Bz-Info-Author": "unknown",
                    }
                })


            unlinkSync(page.path)
            if (uploadResponse.data.fileName) {
                urls.push(`https://f004.backblazeb2.com/file/noveldb/${uploadResponse.data.fileName}`)
                aditionalPagesInfo.push({ fileId: uploadResponse.data.fileId, fileName: uploadResponse.data.fileName })
            }
        }))

        return { urls, aditionalPagesInfo };
    },
    deleteUploadedPages: async (credentials: Credentials, pages: deleteFileCredentials[]) => {
        await Promise.all(
            pages.map(async (page) => {
                await axios.post(
                    credentials.apiUrl + '/b2api/v1/b2_delete_file_version',
                    {
                        fileName: page.file_name,
                        fileId: page.file_id
                    },
                    { headers: { Authorization: credentials.authorizationToken } })
            })
        )
    }
}
