/* global React, ReactDOM */
const { useState, useMemo, useEffect, useRef } = React;

// ---------- Patrones SVG por categoría ----------
function Pattern({ kind, accent }) {
  const common = { width: "100%", height: "100%", style: { position: "absolute", inset: 0, opacity: 0.35, mixBlendMode: "soft-light" } };
  const id = `p-${kind}-${Math.random().toString(36).slice(2, 7)}`;
  const stroke = accent;
  switch (kind) {
    case "dots":
      return (
        <svg {...common}><defs><pattern id={id} width="22" height="22" patternUnits="userSpaceOnUse">
          <circle cx="11" cy="11" r="2.2" fill={stroke} />
        </pattern></defs><rect width="100%" height="100%" fill={`url(#${id})`} /></svg>
      );
    case "waves":
      return (
        <svg {...common} viewBox="0 0 200 280" preserveAspectRatio="xMidYMid slice">
          {[...Array(8)].map((_, i) => (
            <path key={i} d={`M -20 ${30 + i * 38} Q 50 ${10 + i * 38} 100 ${30 + i * 38} T 220 ${30 + i * 38}`}
              fill="none" stroke={stroke} strokeWidth="1.4" opacity={0.7} />
          ))}
        </svg>
      );
    case "diamonds":
      return (
        <svg {...common}><defs><pattern id={id} width="28" height="28" patternUnits="userSpaceOnUse" patternTransform="rotate(0)">
          <path d="M14 4 L24 14 L14 24 L4 14 Z" fill="none" stroke={stroke} strokeWidth="1.2" />
        </pattern></defs><rect width="100%" height="100%" fill={`url(#${id})`} /></svg>
      );
    case "stripes":
      return (
        <svg {...common}><defs><pattern id={id} width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
          <line x1="0" y1="0" x2="0" y2="14" stroke={stroke} strokeWidth="3" />
        </pattern></defs><rect width="100%" height="100%" fill={`url(#${id})`} /></svg>
      );
    case "blob":
      return (
        <svg {...common} viewBox="0 0 200 280" preserveAspectRatio="xMidYMid slice">
          <path d="M -20 60 C 40 30, 90 90, 150 70 S 240 120, 220 200 S 80 280, 20 240 S -60 130, -20 60 Z"
            fill={stroke} opacity="0.45" />
          <path d="M 60 200 C 120 180, 160 220, 200 240"
            fill="none" stroke={stroke} strokeWidth="1.2" opacity="0.6" />
        </svg>
      );
    case "stars":
      return (
        <svg {...common} viewBox="0 0 200 280" preserveAspectRatio="xMidYMid slice">
          {[[30,40,2.2],[160,30,1.5],[80,80,1.2],[140,110,2.4],[40,150,1.8],[170,180,1.4],[100,220,2.2],[30,250,1.4],[180,260,1.8],[110,160,1.4]].map(([x,y,r], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r={r} fill={stroke} />
              <path d={`M ${x-r*3} ${y} L ${x+r*3} ${y} M ${x} ${y-r*3} L ${x} ${y+r*3}`} stroke={stroke} strokeWidth="0.6" opacity="0.5" />
            </g>
          ))}
        </svg>
      );
    case "grid":
      return (
        <svg {...common}><defs><pattern id={id} width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M 32 0 L 0 0 0 32" fill="none" stroke={stroke} strokeWidth="0.8" />
        </pattern></defs><rect width="100%" height="100%" fill={`url(#${id})`} /></svg>
      );
    case "triangles":
      return (
        <svg {...common}><defs><pattern id={id} width="26" height="24" patternUnits="userSpaceOnUse">
          <path d="M 13 4 L 22 20 L 4 20 Z" fill="none" stroke={stroke} strokeWidth="1.2" />
        </pattern></defs><rect width="100%" height="100%" fill={`url(#${id})`} /></svg>
      );
    case "confetti":
      return (
        <svg {...common} viewBox="0 0 200 280" preserveAspectRatio="xMidYMid slice">
          {Array.from({ length: 28 }, (_, i) => {
            const x = (i * 73) % 200;
            const y = (i * 41) % 280;
            const r = (i * 7) % 60;
            return <rect key={i} x={x} y={y} width="6" height="14" fill={stroke} transform={`rotate(${r} ${x+3} ${y+7})`} opacity={0.7} />;
          })}
        </svg>
      );
    case "scribble":
      return (
        <svg {...common} viewBox="0 0 200 280" preserveAspectRatio="xMidYMid slice">
          {[...Array(6)].map((_, i) => (
            <path key={i} d={`M ${-10 + i * 10} ${40 + i * 38} q 20 -20 40 0 t 40 0 t 40 0 t 40 0 t 40 0`}
              fill="none" stroke={stroke} strokeWidth="1.2" opacity="0.7" />
          ))}
        </svg>
      );
    case "hatching":
      return (
        <svg {...common}><defs><pattern id={id} width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="10" stroke={stroke} strokeWidth="1" />
        </pattern></defs><rect width="100%" height="100%" fill={`url(#${id})`} /></svg>
      );
    default:
      return null;
  }
}

// ---------- Tarjeta de catálogo ----------
function CatalogCard({ cat, index }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "60px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const { bg, accent, ink } = cat.palette;
  const delay = Math.min((index % 8) * 60, 480);

  return (
    <a
      ref={ref}
      href={`https://innova54.com/design-catalog/${cat.id}`}
      className={`card ${visible ? "card--in" : ""}`}
      style={{
        backgroundColor: bg,
        color: ink,
        transitionDelay: `${delay}ms`,
      }}
      aria-label={`${cat.name} — ${cat.count} diseños`}
    >
      <div className="card__art" aria-hidden="true">
        <Pattern kind={cat.pattern} accent={accent} />
        <div className="card__sheen" />
      </div>

      <span
        className="card__pill"
        style={{ backgroundColor: ink, color: bg }}
      >
        {cat.count.toLocaleString("es-AR")}
      </span>

      <div className="card__bottom">
        <h3 className="card__title">{cat.name}</h3>
        <span className="card__cta" style={{ color: ink }}>
          <span>Ver diseños</span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M1 7 H12 M8 3 L12 7 L8 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </a>
  );
}

// ---------- App ----------
function App() {
  const catalogs = window.INNOVA_CATALOGS;
  const totalDesigns = window.INNOVA_TOTAL_DESIGNS;

  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const [sortOpen, setSortOpen] = useState(false);

  const sortLabels = {
    featured: "Destacados",
    az: "Nombre A–Z",
    count: "Más diseños",
  };

  const filtered = useMemo(() => {
    let list = catalogs.filter((c) =>
      c.name.toLowerCase().includes(query.trim().toLowerCase())
    );
    if (sort === "az") {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name, "es"));
    } else if (sort === "count") {
      list = [...list].sort((a, b) => b.count - a.count);
    } else {
      list = [...list].sort((a, b) => {
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        return b.count - a.count;
      });
    }
    return list;
  }, [catalogs, query, sort]);

  // Cerrar dropdown sort al hacer click afuera
  const sortRef = useRef(null);
  useEffect(() => {
    if (!sortOpen) return;
    const onDoc = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) setSortOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [sortOpen]);

  return (
    <section className="catalog" data-screen-label="Catálogo de Diseños">
      <div className="catalog__inner">
        <header className="catalog__header">
          <span className="catalog__eyebrow">Inspiración</span>
          <h2 className="catalog__title">
            Catálogo <em>de</em> Diseños
          </h2>
          <p className="catalog__sub">
            Elegí un diseño y hacelo parte de tu próxima historia.
          </p>
        </header>

        <div className="catalog__controls">
          <label className="search">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M12.5 12.5 L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar catálogo…"
              aria-label="Buscar catálogo"
            />
            {query && (
              <button className="search__clear" onClick={() => setQuery("")} aria-label="Limpiar búsqueda">×</button>
            )}
          </label>

          <div className="sort" ref={sortRef}>
            <button
              className="sort__btn"
              onClick={() => setSortOpen((o) => !o)}
              aria-haspopup="listbox"
              aria-expanded={sortOpen}
            >
              <span className="sort__lbl">Ordenar:</span>
              <span className="sort__val">{sortLabels[sort]}</span>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                <path d="M2 4 L5 7 L8 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {sortOpen && (
              <ul className="sort__menu" role="listbox">
                {Object.entries(sortLabels).map(([k, v]) => (
                  <li key={k}>
                    <button
                      className={`sort__opt ${sort === k ? "sort__opt--active" : ""}`}
                      onClick={() => { setSort(k); setSortOpen(false); }}
                      role="option"
                      aria-selected={sort === k}
                    >
                      {v}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="catalog__meta" aria-live="polite">
          <strong>{filtered.length}</strong> {filtered.length === 1 ? "catálogo" : "catálogos"}
          <span className="catalog__dot">·</span>
          <strong>{totalDesigns.toLocaleString("es-AR")}+</strong> diseños en total
        </div>

        {filtered.length === 0 ? (
          <div className="catalog__empty">
            <p>No encontramos catálogos para “<strong>{query}</strong>”.</p>
            <button onClick={() => setQuery("")}>Limpiar búsqueda</button>
          </div>
        ) : (
          <div className="catalog__grid">
            {filtered.map((c, i) => (
              <CatalogCard key={c.id} cat={c} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
