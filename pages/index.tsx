import type { GetServerSideProps, NextPage } from 'next'
import { ChangeEvent, FormEvent, LegacyRef, useRef, useState } from 'react'
import { Input } from '../src/components/Input'
import styles from '../styles/Home.module.css'
import prisma from '../prisma/prisma';
import { Genre } from '@prisma/client';
import axios from 'axios';
import Link from 'next/link';

const Home = ({ genres }: Props) => {
  const [mangaTitle, setMangaTitle] = useState('');
  const [mangaGenres, setMangaGenres] = useState<string[]>([]);
  const [mangaSinopse, setMangaSinopse] = useState('');
  const [mangaAuthor, setMangaAuthor] = useState('');
  const [mangaArtist, setMangaArtist] = useState('');
  const [adittionalGenders, setAdittionalGenders] = useState('');
  const [file, setFile] = useState<any>();
  const inputRef = useRef<any>(null)

  const handleGenresValidation = (e: ChangeEvent<HTMLInputElement>) => {
    if (mangaGenres.indexOf(e.target.value) > -1) {
      let copy = [...mangaGenres];
      copy.splice(mangaGenres.indexOf(e.target.value), 1);
      setMangaGenres(copy)
    } else {
      setMangaGenres((state) => [...state, e.target.value])
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (mangaGenres.length === 0 && adittionalGenders.length === 0) {
      return alert('GENEROS NÂO SELECIONADOS')
    }
    let data = new FormData();
    data.append('img', inputRef.current.files[0]);
    data.append('title', mangaTitle);
    data.append('genres', adittionalGenders ? `${mangaGenres.join(';')};${adittionalGenders}` : mangaGenres.join(';'))
    data.append('sinopse', mangaSinopse);
    data.append('author', mangaAuthor);
    data.append('artist', mangaArtist);

    let res = await axios.post("/api/manga", data)
    if (res.data) {
      alert("success!")
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.createManga}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <Input
            type='text'
            title='Titúlo do Manga'
            value={mangaTitle}
            onChange={setMangaTitle}
          />

          <section className={styles.genres}>
            {genres.map((genre) => {
              return (
                <label htmlFor={genre.id} key={genre.id} className={styles.genre}>
                  <input
                    type='radio'
                    id={genre.id}
                    value={genre.slug}
                    onChange={() => { }}
                    checked={mangaGenres.indexOf(genre.slug) > -1 ? true : false}
                    onClick={e => handleGenresValidation(e as any)}
                  />
                  {genre.name}
                </label>
              )
            })}
            <div>
              Não está na lista?
              <input
                style={{ marginLeft: '12px' }}
                type="text"
                placeholder='genero;genero2;genero3'
                onChange={e => setAdittionalGenders(e.target.value)}
              />
            </div>
          </section>

          <Input type='text' onChange={setMangaSinopse} value={mangaSinopse} title='Sinopse' />
          <Input type='text' onChange={setMangaAuthor} value={mangaAuthor} title='Author' />
          <Input type='text' onChange={setMangaArtist} value={mangaArtist} title='Artista' />

          <span>
            Capa: <input required ref={inputRef} value={file} type="file" onChange={e => setFile(e.target.value)} />
          </span>



          <button className={styles.button}>Enviar</button>
        </form>
        <div style={{ marginTop: '40px' }}>
          <Link href='/chapter' >
            <a>
              Ir para upload de capítulo
            </a>
          </Link>
        </div>
      </div>

    </div>
  )
}

type Props = {
  genres: Genre[]
}

export const getServerSideProps: GetServerSideProps = async () => {
  let genres = await prisma.genre.findMany({ orderBy: { name: 'asc' } });


  return {
    props: { genres }
  }
}

export default Home
