import prisma from '../../prisma/prisma'

export const requestValidator = async (body: any) => {
    if (!body.manga_slug || !body.volume || !body.chapter || !body.title) {

        return { error: 'Dados incompletos, por favor, informar manga, volume e capitulo.' }
    }
    if (isNaN(body.volume) || isNaN(body.chapter)) {
        return { error: 'Dados inválidos, por favor, informar volume e capitulo válidos.' }
    }

    if (parseInt(body.volume).toString().length < 2) {
        body.volume = `0${body.volume}`
    }
    if (parseInt(body.chapter).toString().length < 2) {
        body.chapter = `0${body.chapter}`
    }

    if (body.manga_id) {
        body.manga = await prisma.manga.findFirst({ where: { id: body.manga_id }, select: { id: true } });
    } else {
        body.manga_slug = body.manga_slug;
        body.manga = await prisma.manga.findFirst({ where: { slug: body.manga_slug }, select: { id: true } });
    }

    if (body.manga === null) {
        return { error: 'manga não encontrado!' }
    }

    if (body.scan_slug) {
        let scan = await prisma.scan.findFirst({ where: { slug: body.scan_slug as string } });
        if (!scan) {
            scan = await prisma.scan.create({ data: { name: body.scan_slug.split('-').map((i: string) => i[0].toUpperCase() + i.substring(1)).join(' '), slug: body.scan_slug } })
        }

        body.scan = scan;
    }

    if (!body.scan_slug) {
        body.scan = { id: 'cef69916-a33d-49b8-9aa4-a8a6c1b68a9b' }
    }

    return body;
}