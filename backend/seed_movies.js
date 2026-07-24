import axios from 'axios';
import mongoose from 'mongoose';

const API_KEY = '8d7cd14f75ff2bb827d966152a610eab';
const TMDB_BASE = 'https://api.themoviedb.org/3';

const GENRE_MAP = {
    28: 'Acción', 12: 'Aventura', 16: 'Animadas',
    10752: 'Bélicas', 35: 'Comedias', 27: 'Terror'
};

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

async function getMovieDetails(id) {
    const res = await axios.get(`${TMDB_BASE}/movie/${id}?api_key=${API_KEY}&language=es-ES&append_to_response=videos`);
    return res.data;
}

async function getCredits(id) {
    try {
        const res = await axios.get(`${TMDB_BASE}/movie/${id}/credits?api_key=${API_KEY}&language=es-ES`);
        return res.data;
    } catch { return null; }
}

const MOVIES = [
    { t: 'The Godfather', y: 1972 }, { t: 'The Godfather Part II', y: 1974 },
    { t: 'The Godfather Part III', y: 1990 }, { t: 'The Fast and the Furious', y: 2001 },
    { t: 'Fast and Furious Tokyo Drift', y: 2006 }, { t: 'Toy Story', y: 1995 },
    { t: 'Toy Story 2', y: 1999 }, { t: 'Toy Story 3', y: 2010 },
    { t: 'Toy Story 4', y: 2019 }, { t: 'Cars', y: 2006 },
    { t: 'Cars 2', y: 2011 }, { t: 'Cars 3', y: 2017 },
    { t: 'Shrek', y: 2001 }, { t: 'Shrek 2', y: 2004 },
    { t: 'Shrek the Third', y: 2007 }, { t: 'Shrek Forever After', y: 2010 },
    { t: 'Monsters Inc.', y: 2001 }, { t: 'Frozen', y: 2013 },
    { t: 'Moana', y: 2016 }, { t: 'Coco', y: 2017 },
    { t: 'The Super Mario Bros. Movie', y: 2023 },
    { t: 'Harry Potter and the Philosopher Stone', y: 2001 },
    { t: 'Harry Potter and the Chamber of Secrets', y: 2002 },
    { t: 'Harry Potter and the Prisoner of Azkaban', y: 2004 },
    { t: 'Harry Potter and the Goblet of Fire', y: 2005 },
    { t: 'Harry Potter and the Order of the Phoenix', y: 2007 },
    { t: 'Harry Potter and the Half-Blood Prince', y: 2009 },
    { t: 'Harry Potter and the Deathly Hallows Part 1', y: 2010 },
    { t: 'Harry Potter and the Deathly Hallows Part 2', y: 2011 },
    { t: 'The Lord of the Rings The Fellowship of the Ring', y: 2001 },
    { t: 'The Lord of the Rings The Two Towers', y: 2002 },
    { t: 'The Lord of the Rings The Return of the King', y: 2003 },
    { t: 'The Hobbit An Unexpected Journey', y: 2012 },
    { t: 'The Hobbit The Desolation of Smaug', y: 2013 },
    { t: 'Gladiator', y: 2000 }, { t: 'Troy', y: 2004 },
    { t: '1917', y: 2019 }, { t: 'Dunkirk', y: 2017 },
    { t: 'Fury', y: 2014 }, { t: 'Saving Private Ryan', y: 1998 },
    { t: 'All Quiet on the Western Front', y: 2022 }, { t: 'American Pie', y: 1999 },
    { t: 'American Pie 2', y: 2001 }, { t: 'Scary Movie', y: 2000 },
    { t: 'Scary Movie 2', y: 2001 }, { t: 'Scary Movie 3', y: 2003 },
    { t: 'Scary Movie 4', y: 2006 }, { t: 'Scary Movie 5', y: 2013 },
    { t: 'Annabelle', y: 2014 }, { t: 'The Conjuring', y: 2013 },
    { t: 'The Conjuring 2', y: 2016 }, { t: 'John Wick', y: 2014 },
    { t: 'John Wick Chapter 2', y: 2017 }, { t: 'Mad Max Fury Road', y: 2015 },
    { t: 'Terminator 2 Judgment Day', y: 1991 }, { t: 'The Dark Knight', y: 2008 },
    { t: 'Finding Nemo', y: 2003 }, { t: 'Up', y: 2009 },
    { t: 'The Incredibles', y: 2004 }, { t: 'Ratatouille', y: 2007 },
    { t: 'Inside Out', y: 2015 }, { t: 'Pirates of the Caribbean The Curse of the Black Pearl', y: 2003 },
    { t: 'Jurassic Park', y: 1993 }, { t: 'Raiders of the Lost Ark', y: 1981 },
    { t: 'Avatar', y: 2009 }, { t: 'Hacksaw Ridge', y: 2016 },
    { t: 'American Sniper', y: 2014 }, { t: 'Schindler List', y: 1993 },
    { t: 'The Pianist', y: 2002 }, { t: 'Superbad', y: 2007 },
    { t: 'The Hangover', y: 2009 }, { t: 'Zombieland', y: 2009 },
    { t: 'Ted', y: 2012 }, { t: 'Mean Girls', y: 2004 },
    { t: 'It', y: 2017 }, { t: 'A Quiet Place', y: 2018 },
    { t: 'The Exorcist', y: 1973 }, { t: 'Paranormal Activity', y: 2007 },
    { t: 'Hereditary', y: 2018 }, { t: 'Die Hard', y: 1988 },
    { t: 'Mission Impossible Fallout', y: 2018 }, { t: 'Kill Bill Vol 1', y: 2003 },
    { t: 'Spirited Away', y: 2001 }, { t: 'My Neighbor Totoro', y: 1988 },
    { t: 'Kung Fu Panda', y: 2008 }, { t: 'Grave of the Fireflies', y: 1988 },
    { t: 'The Iron Giant', y: 1999 }, { t: 'Star Wars', y: 1977 },
    { t: 'The Empire Strikes Back', y: 1980 }, { t: 'The Lion King', y: 1994 },
    { t: 'Back to the Future', y: 1985 }, { t: 'Spider-Man Into the Spider-Verse', y: 2018 },
    { t: 'Apocalypse Now', y: 1979 }, { t: 'Platoon', y: 1986 },
    { t: 'Enemy at the Gates', y: 2001 }, { t: 'The Big Lebowski', y: 1998 },
    { t: 'Forrest Gump', y: 1994 }, { t: 'School of Rock', y: 2003 },
    { t: 'Home Alone', y: 1990 }, { t: 'There Something About Mary', y: 1998 },
    { t: 'The Shining', y: 1980 }, { t: 'Night of the Living Dead', y: 1968 },
    { t: 'Die Hard 2', y: 1990 }, { t: 'Die Hard With a Vengeance', y: 1995 },
    { t: 'Live Free or Die Hard', y: 2007 }, { t: 'A Good Day to Die Hard', y: 2013 },
    { t: 'Back to the Future Part II', y: 1989 }, { t: 'Back to the Future Part III', y: 1990 },
    { t: 'Return of the Jedi', y: 1983 }, { t: 'Kung Fu Panda 2', y: 2011 },
    { t: 'Kung Fu Panda 3', y: 2016 }, { t: 'Kill Bill Vol 2', y: 2004 },
    { t: 'Home Alone 2 Lost in New York', y: 1992 }, { t: 'Rambo First Blood', y: 1982 },
    { t: 'Rambo First Blood Part II', y: 1985 }, { t: 'Rambo III', y: 1988 },
    { t: 'The Hangover Part II', y: 2011 }, { t: 'The Hangover Part III', y: 2013 },
    { t: 'Zombieland Double Tap', y: 2019 }, { t: 'Happy Death Day', y: 2017 },
    { t: 'Happy Death Day 2U', y: 2019 }, { t: 'Mortal Kombat', y: 2021 },
    { t: 'The Simpsons Movie', y: 2007 },
];

export async function seedMovies() {
    const MovieModel = mongoose.model('movies');
    let added = 0;

    for (const m of MOVIES) {
        await delay(250);
        try {
            const searchUrl = `${TMDB_BASE}/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(m.t)}&primary_release_year=${m.y}`;
            const searchRes = await axios.get(searchUrl);
            const results = searchRes.data.results;
            if (!results || results.length === 0) { console.log(`❌ ${m.t}`); continue; }

            const match = results[0];
            await delay(250);
            const details = await getMovieDetails(match.id);
            await delay(250);
            const credits = await getCredits(match.id);

            const titleEs = details.title || match.title;
            const titleEn = match.original_title || match.title;
            const director = credits?.crew?.find(c => c.job === 'Director')?.name || 'N/A';
            const cast = credits?.cast?.slice(0, 5).map(c => c.name) || [];
            const trailer = details.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');
            const genres = (match.genre_ids || []).map(g => GENRE_MAP[g]).filter(Boolean);

            await new MovieModel({
                title: titleEs, titleEn, category: genres.length > 0 ? genres : ['Aventura'],
                thumbnail: match.poster_path || null,
                description: details.overview || 'Sin descripción.',
                year: m.y, director, duration: details.runtime ? `${details.runtime} min` : 'N/A',
                rating: Math.round((match.vote_average / 2) * 10) / 10,
                cast, trailer: trailer ? `https://www.youtube.com/embed/${trailer.key}` : '',
                tmdbId: match.id, comments: []
            }).save();

            added++;
            console.log(`✅ ${titleEs}`);
        } catch (e) {
            console.log(`❌ ${m.t}: ${e.message}`);
        }
    }

    console.log(`\n🎉 ${added} películas sembradas`);
}
