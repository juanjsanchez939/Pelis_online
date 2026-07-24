import { useState, useEffect } from "react";
import axios from "axios";
import { Products } from "./products.jsx";
import { API_BASE_URL } from "../utils/shared.js";
import "./TmdbSection.css";

const CATEGORIES = [
    { key: "popular", label: "Populares", icon: "🔥", endpoint: "/api/movies/popular" },
    { key: "now-playing", label: "En Cartelera", icon: "🎟️", endpoint: "/api/movies/now-playing" },
    { key: "upcoming", label: "Próximamente", icon: "📅", endpoint: "/api/movies/upcoming" },
    { key: "top-rated", label: "Mejor Puntuadas", icon: "⭐", endpoint: "/api/movies/top-rated" },
];

const TV_CATEGORIES = [
    { key: "popular-tv", label: "Populares", icon: "📺", endpoint: "/api/tv/popular" },
    { key: "airing-today", label: "Hoy", icon: "🕐", endpoint: "/api/tv/airing-today" },
    { key: "on-the-air", label: "En Emisión", icon: "📡", endpoint: "/api/tv/on-the-air" },
    { key: "top-rated-tv", label: "Top Series", icon: "⭐", endpoint: "/api/tv/top-rated" },
];

export default function TmdbSection() {
    const [subTab, setSubTab] = useState("movies");
    const [cat, setCat] = useState("popular");
    const [items, setItems] = useState([]);
    const [tvCat, setTvCat] = useState("popular-tv");
    const [tvItems, setTvItems] = useState([]);

    useEffect(() => {
        const catDef = CATEGORIES.find(c => c.key === cat);
        if (!catDef) return;
        axios.get(`${API_BASE_URL}${catDef.endpoint}`)
            .then(r => setItems(r.data))
            .catch(() => setItems([]));
    }, [cat]);

    useEffect(() => {
        const catDef = TV_CATEGORIES.find(c => c.key === tvCat);
        if (!catDef) return;
        axios.get(`${API_BASE_URL}${catDef.endpoint}`)
            .then(r => setTvItems(r.data))
            .catch(() => setTvItems([]));
    }, [tvCat]);

    return (
        <div className="tmdb-section">
            <div className="tmdb-tabs">
                <button className={`tmdb-main-tab ${subTab === "movies" ? "active" : ""}`} onClick={() => setSubTab("movies")}>
                    🎬 Películas
                </button>
                <button className={`tmdb-main-tab ${subTab === "tv" ? "active" : ""}`} onClick={() => setSubTab("tv")}>
                    📺 Series
                </button>
            </div>

            {subTab === "movies" && (
                <>
                    <div className="genre-vertical">
                        {CATEGORIES.map(c => (
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
                    <Products products={items} />
                </>
            )}

            {subTab === "tv" && (
                <>
                    <div className="genre-vertical">
                        {TV_CATEGORIES.map(c => (
                            <button
                                key={c.key}
                                className={`genre-vbtn ${tvCat === c.key ? "active" : ""}`}
                                onClick={() => setTvCat(c.key)}
                            >
                                <span className="genre-vicon">{c.icon}</span>
                                <span className="genre-vname">{c.label}</span>
                            </button>
                        ))}
                    </div>
                    <Products products={tvItems} />
                </>
            )}
        </div>
    );
}
