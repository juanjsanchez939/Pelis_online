import { useState, useEffect } from "react";
import axios from "axios";
import { Products } from "./products.jsx";
import { API_BASE_URL } from "../utils/shared.js";
import "./TmdbSection.css";

const MOVIE_CATS = [
    { key: "popular", label: "Populares", icon: "🔥", endpoint: "/api/movies/popular" },
    { key: "now-playing", label: "En Cartelera", icon: "🎟️", endpoint: "/api/movies/now-playing" },
    { key: "upcoming", label: "Próximamente", icon: "📅", endpoint: "/api/movies/upcoming" },
    { key: "top-rated", label: "Mejor Puntuadas", icon: "⭐", endpoint: "/api/movies/top-rated" },
];

const TV_CATS = [
    { key: "popular", label: "Populares", icon: "📺", endpoint: "/api/tv/popular" },
    { key: "airing-today", label: "Hoy", icon: "🕐", endpoint: "/api/tv/airing-today" },
    { key: "on-the-air", label: "En Emisión", icon: "📡", endpoint: "/api/tv/on-the-air" },
    { key: "top-rated", label: "Top Series", icon: "⭐", endpoint: "/api/tv/top-rated" },
];

export default function TmdbSection({ mode = "movies" }) {
    const categories = mode === "tv" ? TV_CATS : MOVIE_CATS;
    const [cat, setCat] = useState(categories[0].key);
    const [items, setItems] = useState([]);

    useEffect(() => {
        const c = categories.find(x => x.key === cat);
        if (!c) return;
        axios.get(`${API_BASE_URL}${c.endpoint}`)
            .then(r => setItems(r.data))
            .catch(() => setItems([]));
    }, [cat, mode]);

    return (
        <div>
            <div className="genre-vertical">
                {categories.map(c => (
                    <button
                        key={c.key}
                        className={`genre-vbtn ${cat === c.key ? "active" : ""}`}
                        onClick={() => setCat(c.key)}
                    >
                        <span className="genre-vicon">{c.icon}</span>
                        <span className="genre-vname">{c.label}</span>
                    </button>
                ))}
            </div>
            <div style={{ padding: '0 16px' }}>
                <Products products={items} />
            </div>
        </div>
    );
}
