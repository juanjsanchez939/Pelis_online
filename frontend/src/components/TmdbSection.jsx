import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Products } from "./products.jsx";
import { API_BASE_URL } from "../utils/shared.js";
import { UserContext } from "../context/UserContext.js";

const MOVIE_CATS = [
    { key: "popular", label: "Popular", icon: "🔥" },
    { key: "now-playing", label: "Now Playing", icon: "🎟️" },
    { key: "upcoming", label: "Upcoming", icon: "📅" },
    { key: "top-rated", label: "Top Rated", icon: "⭐" },
];

const TV_CATS = [
    { key: "popular", label: "Popular", icon: "📺" },
    { key: "airing-today", label: "Airing Today", icon: "🕐" },
    { key: "on-the-air", label: "On TV", icon: "📡" },
    { key: "top-rated", label: "Top Rated", icon: "⭐" },
];

export default function TmdbSection({ mode = "movies" }) {
    const { user } = useContext(UserContext);
    const endpoint = mode === "tv" ? "/api/tv/all" : "/api/movies/all";
    const categories = mode === "tv" ? TV_CATS : MOVIE_CATS;
    const [items, setItems] = useState([]);
    const [cat, setCat] = useState("");

    useEffect(() => {
        axios.get(`${API_BASE_URL}${endpoint}`)
            .then(r => {
                setItems(r.data);
                if (!cat && categories.length > 0) {
                    setCat(categories[0].key);
                }
            })
            .catch(() => setItems([]));
    }, [mode]);

    const filtered = (cat ? items.filter(m => m.tag === cat) : items);
    const display = user ? filtered : filtered.slice(0, 5);

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
                        <span className="genre-vcount">{items.filter(m => m.tag === c.key).length}</span>
                    </button>
                ))}
            </div>
            <div style={{ padding: '0 16px' }}>
                <Products products={display} limit={user ? undefined : 5} />
                {!user && (
                    <p style={{ textAlign: 'center', padding: '20px', color: '#aaa' }}>
                        <a href="/login" style={{ color: '#e50914' }}>Inicia sesión</a> para ver las {filtered.length} {mode === "tv" ? "series" : "películas"}
                    </p>
                )}
            </div>
        </div>
    );
}
