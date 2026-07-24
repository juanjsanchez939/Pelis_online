import mongoose from 'mongoose';
import axios from 'axios';
import Movie from './models/movie.js';
import 'dotenv/config';

const API_KEY = '8d7cd14f75ff2bb827d966152a610eab';
const TMDB_BASE = 'https://api.themoviedb.org/3';

const GENRE_MAP = {
    28: 'Acción',
    12: 'Aventura',
    16: 'Animadas',
    10752: 'Bélicas',
    35: 'Comedias',
    27: 'Terror'
};

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

async function getMovieDetails(movieId) {
    const res = await axios.get(`${TMDB_BASE}/movie/${movieId}?api_key=${API_KEY}&language=es-ES&append_to_response=videos`);
    return res.data;
}

async function getMovieCredits(movieId) {
    const res = await axios.get(`${TMDB_BASE}/movie/${movieId}/credits?api_key=${API_KEY}&language=es-ES`);
    return res.data;
}

const CLASSIC_MOVIES = [
    { title: 'The Godfather', year: 1972 }, { title: 'The Godfather Part II', year: 1974 },
    { title: 'The Godfather Part III', year: 1990 }, { title: 'The Fast and the Furious', year: 2001 },
    { title: 'Fast and Furious Tokyo Drift', year: 2006 }, { title: 'Toy Story', year: 1995 },
    { title: 'Toy Story 2', year: 1999 }, { title: 'Toy Story 3', year: 2010 },
    { title: 'Toy Story 4', year: 2019 }, { title: 'Cars', year: 2006 },
    { title: 'Cars 2', year: 2011 }, { title: 'Cars 3', year: 2017 },
    { title: 'Shrek', year: 2001 }, { title: 'Shrek 2', year: 2004 },
    { title: 'Shrek the Third', year: 2007 }, { title: 'Shrek Forever After', year: 2010 },
    { title: 'Monsters Inc.', year: 2001 }, { title: 'Frozen', year: 2013 },
    { title: 'Moana', year: 2016 }, { title: 'Coco', year: 2017 },
    { title: 'The Super Mario Bros. Movie', year: 2023 },
    { title: 'Harry Potter and the Philosopher Stone', year: 2001 },
    { title: 'Harry Potter and the Chamber of Secrets', year: 2002 },
    { title: 'Harry Potter and the Prisoner of Azkaban', year: 2004 },
    { title: 'Harry Potter and the Goblet of Fire', year: 2005 },
    { title: 'Harry Potter and the Order of the Phoenix', year: 2007 },
    { title: 'Harry Potter and the Half-Blood Prince', year: 2009 },
    { title: 'Harry Potter and the Deathly Hallows Part 1', year: 2010 },
    { title: 'Harry Potter and the Deathly Hallows Part 2', year: 2011 },
    { title: 'The Lord of the Rings The Fellowship of the Ring', year: 2001 },
    { title: 'The Lord of the Rings The Two Towers', year: 2002 },
    { title: 'The Lord of the Rings The Return of the King', year: 2003 },
    { title: 'The Hobbit An Unexpected Journey', year: 2012 },
    { title: 'The Hobbit The Desolation of Smaug', year: 2013 },
    { title: 'Gladiator', year: 2000 }, { title: 'Troy', year: 2004 },
    { title: '1917', year: 2019 }, { title: 'Dunkirk', year: 2017 },
    { title: 'Fury', year: 2014 }, { title: 'American Pie', year: 1999 },
    { title: 'American Pie 2', year: 2001 }, { title: 'Scary Movie', year: 2000 },
    { title: 'Scary Movie 2', year: 2001 }, { title: 'Scary Movie 3', year: 2003 },
    { title: 'Scary Movie 4', year: 2006 }, { title: 'Scary Movie 5', year: 2013 },
    { title: 'Annabelle', year: 2014 }, { title: 'The Conjuring', year: 2013 },
    { title: 'The Conjuring 2', year: 2016 }, { title: 'John Wick', year: 2014 },
    { title: 'John Wick Chapter 2', year: 2017 }, { title: 'Mad Max Fury Road', year: 2015 },
    { title: 'Terminator 2 Judgment Day', year: 1991 }, { title: 'The Dark Knight', year: 2008 },
    { title: 'Finding Nemo', year: 2003 }, { title: 'Up', year: 2009 },
    { title: 'The Incredibles', year: 2004 }, { title: 'Ratatouille', year: 2007 },
    { title: 'Inside Out', year: 2015 }, { title: 'Pirates of the Caribbean The Curse of the Black Pearl', year: 2003 },
    { title: 'Jurassic Park', year: 1993 }, { title: 'Raiders of the Lost Ark', year: 1981 },
    { title: 'Avatar', year: 2009 }, { title: 'Hacksaw Ridge', year: 2016 },
    { title: 'American Sniper', year: 2014 }, { title: 'Schindler List', year: 1993 },
    { title: 'The Pianist', year: 2002 }, { title: 'Superbad', year: 2007 },
    { title: 'The Hangover', year: 2009 }, { title: 'Zombieland', year: 2009 },
    { title: 'Ted', year: 2012 }, { title: 'Mean Girls', year: 2004 },
    { title: 'It', year: 2017 }, { title: 'A Quiet Place', year: 2018 },
    { title: 'The Exorcist', year: 1973 }, { title: 'Paranormal Activity', year: 2007 },
    { title: 'Hereditary', year: 2018 }, { title: 'Die Hard', year: 1988 },
    { title: 'Mission Impossible Fallout', year: 2018 }, { title: 'Kill Bill Vol 1', year: 2003 },
    { title: 'Spirited Away', year: 2001 }, { title: 'My Neighbor Totoro', year: 1988 },
    { title: 'Kung Fu Panda', year: 2008 }, { title: 'Grave of the Fireflies', year: 1988 },
    { title: 'The Iron Giant', year: 1999 }, { title: 'Star Wars', year: 1977 },
    { title: 'The Empire Strikes Back', year: 1980 }, { title: 'The Lion King', year: 1994 },
    { title: 'Back to the Future', year: 1985 }, { title: 'Spider-Man Into the Spider-Verse', year: 2018 },
    { title: 'Apocalypse Now', year: 1979 }, { title: 'Platoon', year: 1986 },
    { title: 'Enemy at the Gates', year: 2001 }, { title: 'The Big Lebowski', year: 1998 },
    { title: 'Forrest Gump', year: 1994 }, { title: 'School of Rock', year: 2003 },
    { title: 'Home Alone', year: 1990 }, { title: 'There Something About Mary', year: 1998 },
    { title: 'The Shining', year: 1980 }, { title: 'Night of the Living Dead', year: 1968 },
    { title: 'Die Hard 2', year: 1990 }, { title: 'Die Hard With a Vengeance', year: 1995 },
    { title: 'Live Free or Die Hard', year: 2007 }, { title: 'A Good Day to Die Hard', year: 2013 },
    { title: 'Back to the Future Part II', year: 1989 }, { title: 'Back to the Future Part III', year: 1990 },
    { title: 'Return of the Jedi', year: 1983 }, { title: 'Kung Fu Panda 2', year: 2011 },
    { title: 'Kung Fu Panda 3', year: 2016 }, { title: 'Kill Bill Vol 2', year: 2004 },
    { title: 'Home Alone 2 Lost in New York', year: 1992 }, { title: 'Rambo First Blood', year: 1982 },
    { title: 'Rambo First Blood Part II', year: 1985 }, { title: 'Rambo III', year: 1988 },
    { title: 'The Hangover Part II', year: 2011 }, { title: 'The Hangover Part III', year: 2013 },
    { title: 'Zombieland Double Tap', year: 2019 }, { title: 'Happy Death Day', year: 2017 },
    { title: 'Happy Death Day 2U', year: 2019 }, { title: 'Mortal Kombat', year: 2021 },
    { title: 'The Simpsons Movie', year: 2007 }, { title: 'Saving Private Ryan', year: 1998 },
    { title: 'All Quiet on the Western Front', year: 2022 },
];

async function seed() {
    try {
        const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/pelis_online';
        const dbName = process.env.DB_NAME || 'pelis_online';
        await mongoose.connect(uri, { dbName, serverSelectionTimeoutMS: 10000 });
        console.log('Conectado a MongoDB Atlas');

        const existing = await Movie.countDocuments();
        if (existing > 0) {
            console.log(`Ya hay ${existing} películas. Borrando...`);
            await Movie.deleteMany({});
        }

        let added = 0;
        for (const m of CLASSIC_MOVIES) {
            await delay(300);
            try {
                const searchUrl = `${TMDB_BASE}/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(m.title)}&primary_release_year=${m.year}`;
                const searchRes = await axios.get(searchUrl);
                const results = searchRes.data.results;
                if (!results || results.length === 0) {
                    console.log(`❌ No encontrada: ${m.title}`);
                    continue;
                }

                const match = results[0];
                await delay(300);

                const details = await getMovieDetails(match.id);
                await delay(300);
                let credits;
                try { credits = await getMovieCredits(match.id); } catch {}

                const titleEs = details.title || match.title;
                const titleEn = match.original_title || match.title;
                const director = credits?.crew?.find(c => c.job === 'Director')?.name || 'N/A';
                const cast = credits?.cast?.slice(0, 5).map(c => c.name) || [];
                const trailer = details.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');

                const genres = match.genre_ids?.map(g => GENRE_MAP[g]).filter(Boolean) || ['Aventura'];

                const movieDoc = new Movie({
                    title: titleEs,
                    titleEn: titleEn,
                    category: genres.length > 0 ? genres : ['Aventura'],
                    thumbnail: match.poster_path || null,
                    description: details.overview || 'Sin descripción disponible.',
                    year: m.year,
                    director: director,
                    duration: details.runtime ? `${details.runtime} min` : 'N/A',
                    rating: Math.round((match.vote_average / 2) * 10) / 10,
                    cast: cast,
                    trailer: trailer ? `https://www.youtube.com/embed/${trailer.key}` : '',
                    tmdbId: match.id,
                    comments: []
                });

                await movieDoc.save();
                added++;
                console.log(`✅ ${titleEs} (${m.year})`);

            } catch (e) {
                console.log(`❌ Error ${m.title}: ${e.message}`);
            }
        }

        console.log(`\n🎉 ${added} películas insertadas en Atlas`);
    } catch (e) {
        console.error('Error:', e);
    } finally {
        await mongoose.connection.close();
    }
}

seed();
