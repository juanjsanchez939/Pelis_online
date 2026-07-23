import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import Movie from './models/movie.js';

async function migrate() {
    try {
        await mongoose.connect('mongodb://localhost:27017/pelis_online');
        console.log('Conectado a MongoDB');

        const dataPath = path.join(process.cwd(), '../frontend/src/mocks/products.json');
        const rawData = fs.readFileSync(dataPath, 'utf8');
        const { products } = JSON.parse(rawData);

        console.log(`Migrando ${products.length} películas...`);

        await Movie.deleteMany({});

        const movieDocs = products.map(p => ({
            title: p.title,
            category: p.category,
            thumbnail: p.thumbnail,
            description: p.description,
            year: p.year,
            director: p.director,
            duration: p.duration,
            rating: p.rating,
            cast: p.cast,
            trailer: p.trailer,
            comments: p.comments
        }));

        await Movie.insertMany(movieDocs);
        console.log('Migración completada con éxito');
    } catch (error) {
        console.error('Error durante la migración:', error);
    } finally {
        await mongoose.connection.close();
    }
}

migrate();
