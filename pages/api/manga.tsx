import nc from 'next-connect';
import { NextApiRequest, NextApiResponse } from "next";
import { NextApiRequestWithFiles } from '../../types/BackTypes/ExtendedRequestWithFiles';
import { storageApi } from '../../libs/backServices/storageApi';
import prisma from '../../prisma/prisma'
import { upload } from '../../libs/backServices/multerConfig';
export const config = { api: { bodyParser: false, }, }

const handler = nc();
handler.use(upload.array('img', 1))


handler.post(async (req: NextApiRequestWithFiles, res: NextApiResponse) => {
    let { title, genres, sinopse, author, artist } = req.body;
    let slug = title.split(' ').join('-').toLowerCase().split('?').join('');
    let credentials = await storageApi.getCredentials();
    let { urls } = await storageApi.uploadChapterPages(credentials, [...req.files], slug)
    const newManga = await prisma.manga.create({
        data: {
            title,
            slug,
            image_url: urls[0],
            sinopse: sinopse as string,
            author: author as string,
            artist: artist as string,
        }
    })

    if (!newManga) {
        return res.json({ error: 'Titúlo de manga já existente!' })
    }

    genres.split(';').map(async (genre: string) => {
        let connect = await prisma.genre.findFirst({ where: { slug: genre } });
        if (connect) {
            await prisma.genresOnMangas.create({
                data: {
                    manga_id: newManga.id,
                    genre_id: connect.id,
                }
            })
        } else {
            let newGenre = await prisma.genre.create({
                data: {
                    name: genre[0].toUpperCase() + genre.substring(1),
                    slug: genre
                }
            })
            await prisma.genresOnMangas.create({
                data: {
                    manga_id: newManga.id,
                    genre_id: newGenre.id
                }
            })
        }
    })

    return res.json({ newManga })
})

handler.put(async (req: NextApiRequest, res: NextApiResponse) => {
    let { views, manga_id } = req.body;
    if (views) {
        await prisma.manga.update({
            where: { id: manga_id },
            data: {
                views: { increment: 1 }
            }
        })
    }
    res.json({})
})

export default handler;