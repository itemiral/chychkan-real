import { useState, useEffect, useRef } from 'react';
import {
  UtensilsCrossed, Droplets, Mountain, Fish, Leaf,
  Flame, Car, Coffee, Wifi, Clock, Compass, MapPin,
  ArrowRight, Menu, X, ChevronLeft, ChevronRight, Play,
} from 'lucide-react';

// ── TYPES ─────────────────────────────────────────────────────
type Lang = 'ky' | 'ru' | 'en';

// ── DESIGN TOKENS ─────────────────────────────────────────────
const C = {
  deep:   '#0F2318',
  forest: '#1B3D2F',
  mid:    '#2E5E47',
  gold:   '#C9A052',
  goldL:  '#DFC07A',
  brown:  '#6B4226',
  cream:  '#F7F2E8',
  creamD: '#EDE5D0',
  white:  '#FDFAF5',
  muted:  '#5A5045',
} as const;

const F = {
  serif: "'Cormorant', Georgia, serif",
  sans:  "'Montserrat', sans-serif",
} as const;

// ── TRANSLATIONS ──────────────────────────────────────────────
const T: Record<Lang, Record<string, string>> = {
  ky: {
    nav_about:'Жөнүндө', nav_rooms:'Бөлмөлөр', nav_act:'Активдүүлүк',
    nav_loc:'Жайгашкан жер', nav_book:'Брондоо',
    season:'Сезон: 1-май — 30-сентябрь · 2025',
    h1:'Чычкан', h2:'Капчыгайы',
    tagline:'Бишкектен 240 км · 2200м · 2012-жылдан берки',
    cta:'WhatsApp аркылуу брондоо',
    about_label:'Биз жөнүндө',
    about_title:'Тоолордун жүрөгүндө',
    about_italic:'Кыргызстандын эң кооз тоо аймагы',
    about_p1:'Чычкан комплекси Бишкек-Ош автожолундагы Ала-Бел ашуусунун арт жагында, деңиз деңгээлинен 2200 метр бийиктикте жайгашкан.',
    about_p2:'Кристалл таза суу, тоо абасы, чексиз жашыл токой — табигат менен биригүүнүн мыкты жери.',
    s_alt:'Деңиз деңгээлинен', s_km:'Бишкектен', s_yr:'Ачылган жыл', s_bb:'Эртең мен кирет',
    rooms_label:'Жайлоо', rooms_title:'Бөлмөлөр жана Баалар',
    bb:'Эртең мен кирет', per_night:'/түн', book:'Брондоо',
    hostel:'Жатакана', double:'Дабл', twin:'Твин', eco:'Экологиялык Үй', summer:'Жайкы Үй', lux:'Люкс (2 бөлмө)', yurt:'Балкондуу Юрта',
    t_hostel:'Жатакана', t_mid:'Комфорт', t_family:'Үй-бүлөлүк', t_premium:'Премиум',
    double_single:'Бир конок үчүн да жеткиликтүү: $50 / 4 500 KGS',
    act_label:'Активдүүлүктөр', act_title:'Сизди эмне күтөт',
    act_sub:'Чычкан — жөн гана жаткан жер эмес. Табигат, маданият жана тынчтык.',
    a1:'Ат жарышы', a1d:'Тоо жолдору боюнча аттуу сейил',
    a2:'Кафе-Ресторан', a2d:'Кыргыз жана Азия тамак-ашы',
    a3:'Сауна', a3d:'Дымдуу тоо сауналары',
    a4:'Треккинг', a4d:'Капчыгай боюнча жаяу жүрүү',
    a5:'Балык уулоо', a5d:'Тоо дарыяларынан таза балык',
    a6:'Малина теруу', a6d:'Жапайы жидектерди жыйноо',
    a7:'Бак жана Камин', a7d:'Кечки от жагуу аянтчасы',
    a8:'Акысыз токтоочу жер', a8d:'Бардык конокторго',
    a9:'Эртең мен тамагы', a9d:'B&B — баардык бөлмөгө кирет',
    a10:'Акысыз Wi-Fi', a10d:'Бүткүл комплекс боюнча',
    a11:'24 саат ресепшн', a11d:'Тынымсыз администратор',
    loc_label:'Жайгашкан жери', loc_title:'Бизди кантип табуу',
    loc_sub:'Бишкек-Ош автожолу, Ала-Бел ашуусунан кийин',
    d1t:'Бишкектен чыгуу', d1b:'Бишкек-Ош автожолуна (М41) түшүп, Ош багытына жүрүңүз.',
    d2t:'Ала-Бел ашуусу', d2b:'Ала-Бел ашуусунан (~180 км) өтүп, ылдый түшүңүз.',
    d3t:'Чычкан белгиси', d3b:'40-50 км өткөндө комплекстин белгисин көрөсүз.',
    d4t:'Бишкектен 240 км', d4b:'3–3.5 саат жол (жол шарттарынан жараша).',
    map_google:'Google Maps', map_2gis:'2GIS картасы',
    cta_label:'Брондоо', cta_title:'Сизди Чычканда күтүп жатабыз',
    cta_italic:'Тоонун жаны, табигаттын кучагы',
    cta_btn:'WhatsApp аркылуу брондоо',
    ig:'Instagram',
    foot_open:'Ачык: 1 Май — 30 Сентябрь',
    foot_copy:'© 2025 Touristic Complex Chychkan',
  },
  ru: {
    nav_about:'О нас', nav_rooms:'Номера', nav_act:'Активности',
    nav_loc:'Расположение', nav_book:'Бронирование',
    season:'Сезон: 1 мая — 30 сентября · 2025',
    h1:'Ущелье', h2:'Чычкан',
    tagline:'240 км от Бишкека · 2200м · С 2012 года',
    cta:'Забронировать в WhatsApp',
    about_label:'О нас',
    about_title:'В сердце гор',
    about_italic:'Одно из красивейших мест Кыргызстана',
    about_p1:'Комплекс «Чычкан» расположен на трассе Бишкек–Ош, за перевалом Ала-Бел, на высоте 2200 метров над уровнем моря.',
    about_p2:'Кристально чистые реки, горный воздух, бескрайние леса — лучшее место для единения с природой.',
    s_alt:'Над уровнем моря', s_km:'От Бишкека', s_yr:'Год основания', s_bb:'Завтрак включён',
    rooms_label:'Проживание', rooms_title:'Номера и цены',
    bb:'Завтрак включён', per_night:'/ночь', book:'Забронировать',
    hostel:'Хостел', double:'Дабл', twin:'Твин', eco:'Эко Домик', summer:'Летник', lux:'Люкс (2 комнаты)', yurt:'Юрта с Балконом',
    t_hostel:'Хостел', t_mid:'Комфорт', t_family:'Семейный', t_premium:'Премиум',
    double_single:'Также доступен для 1 гостя: $50 / 4 500 KGS',
    act_label:'Активности', act_title:'Что вас ждёт',
    act_sub:'Чычкан — это не просто ночлег. Природа, культура и покой.',
    a1:'Верховая езда', a1d:'Конные прогулки по горным тропам',
    a2:'Кафе-ресторан', a2d:'Кыргызская и азиатская кухня',
    a3:'Сауна', a3d:'Паровые бани в горном воздухе',
    a4:'Треккинг', a4d:'Пешие прогулки по ущелью',
    a5:'Рыбалка', a5d:'Свежая рыба из горных рек',
    a6:'Сбор малины', a6d:'Дикие ягоды в сезон',
    a7:'Сад и камин', a7d:'Вечерние посиделки у огня',
    a8:'Бесплатная парковка', a8d:'Для всех гостей',
    a9:'Завтрак', a9d:'B&B — включён во все номера',
    a10:'Бесплатный Wi-Fi', a10d:'По всей территории',
    a11:'Круглосуточная рецепция', a11d:'Администратор всегда на месте',
    loc_label:'Расположение', loc_title:'Как нас найти',
    loc_sub:'Трасса Бишкек–Ош, после перевала Ала-Бел',
    d1t:'Выезд из Бишкека', d1b:'Выезжайте на трассу Бишкек–Ош (М41) в направлении Оша.',
    d2t:'Перевал Ала-Бел', d2b:'Проедьте перевал Ала-Бел (~180 км) и начните спуск.',
    d3t:'Указатель Чычкан', d3b:'Через 40–50 км после перевала увидите указатель.',
    d4t:'240 км от Бишкека', d4b:'3–3.5 часа езды (в зависимости от дорог).',
    map_google:'Google Maps', map_2gis:'2GIS карта',
    cta_label:'Бронирование', cta_title:'Ждём вас в Чычкане',
    cta_italic:'Душа гор, объятия природы',
    cta_btn:'Забронировать в WhatsApp',
    ig:'Instagram',
    foot_open:'Открыт: 1 Мая — 30 Сентября',
    foot_copy:'© 2025 Туристический комплекс Чычкан',
  },
  en: {
    nav_about:'About', nav_rooms:'Rooms', nav_act:'Activities',
    nav_loc:'Location', nav_book:'Book',
    season:'Season: May 1 — September 30 · 2025',
    h1:'Chychkan', h2:'Gorge',
    tagline:'240 km from Bishkek · 2,200m altitude · Est. 2012',
    cta:'Book via WhatsApp',
    about_label:'About Us',
    about_title:'In the heart of the mountains',
    about_italic:"One of Kyrgyzstan's most stunning natural retreats",
    about_p1:'Touristic Complex Chychkan sits on the Bishkek–Osh highway, past the Ala-Bel pass, at 2,200m above sea level.',
    about_p2:'Crystal rivers, mountain air, endless forest — the finest place to reconnect with nature.',
    s_alt:'Above sea level', s_km:'From Bishkek', s_yr:'Founded', s_bb:'Breakfast included',
    rooms_label:'Accommodation', rooms_title:'Rooms & Rates',
    bb:'Breakfast included', per_night:'/night', book:'Book Now',
    hostel:'Hostel Room', double:'Double Room', twin:'Twin Room', eco:'Eco House', summer:'Summer House', lux:'Lux (2 rooms)', yurt:'Yurt with Balcony',
    t_hostel:'Hostel', t_mid:'Comfort', t_family:'Family', t_premium:'Premium',
    double_single:'Also available as single (1 guest): $50 / 4 500 KGS',
    act_label:'Activities', act_title:'What awaits you',
    act_sub:'Chychkan is more than a place to sleep — it is nature, culture, and stillness.',
    a1:'Horseback Riding', a1d:'Guided rides along mountain trails',
    a2:'Café-Restaurant', a2d:'Kyrgyz and Asian cuisine',
    a3:'Sauna', a3d:'Steam baths in mountain air',
    a4:'Trekking', a4d:'Hikes through Chychkan Gorge',
    a5:'Fishing', a5d:'Fresh fish from mountain rivers',
    a6:'Berry Picking', a6d:'Wild raspberries in season',
    a7:'Garden & Firepit', a7d:'Evening gatherings by the fire',
    a8:'Free Parking', a8d:'Available for all guests',
    a9:'Breakfast', a9d:'B&B — included in all rooms',
    a10:'Free Wi-Fi', a10d:'Across the entire complex',
    a11:'24h Reception', a11d:'Always someone at the desk',
    loc_label:'Location', loc_title:'How to find us',
    loc_sub:'Bishkek–Osh highway, after the Ala-Bel pass',
    d1t:'Leave Bishkek', d1b:'Take the Bishkek–Osh highway (M41) towards Osh.',
    d2t:'Ala-Bel Pass', d2b:'Cross the Ala-Bel pass (~180 km) then descend.',
    d3t:'Chychkan Sign', d3b:'40–50 km past the pass, look for the Chychkan sign.',
    d4t:'240 km from Bishkek', d4b:'3–3.5 hours drive depending on conditions.',
    map_google:'Google Maps', map_2gis:'2GIS Map',
    cta_label:'Book Your Stay', cta_title:"We're waiting for you",
    cta_italic:"Mountain soul, nature's embrace",
    cta_btn:'Book via WhatsApp',
    ig:'Instagram',
    foot_open:'Open: May 1 — September 30',
    foot_copy:'© 2025 Touristic Complex Chychkan',
  },
};

// ── ROOMS ─────────────────────────────────────────────────────
const ROOMS: {
  key: string; usd: string; kgs: string; tier: string; img: string;
  gallery: { images: string[]; video: string } | null;
  singleUsd?: string; singleKgs?: string;
}[] = [
  { key:'hostel',  usd:'$15',  kgs:'1 500', tier:'hostel',  img:'/room-hostel.jpg',  gallery: null },
  { key:'double',  usd:'$65',  kgs:'5 800', tier:'mid',     img:'/room-double.jpg',  gallery: null,
    singleUsd:'$50', singleKgs:'4 500' },
  { key:'twin',    usd:'$65',  kgs:'5 800', tier:'mid',     img:'/room-twin.jpg',    gallery: null },
  { key:'eco',     usd:'$85',  kgs:'7 500', tier:'family',  img:'/room-eco.jpg',     gallery: null },
  {
    key:'summer',  usd:'$85',  kgs:'7 500', tier:'premium', img:'/summer4.jpg',
    gallery: {
      images: ['/summer4.jpg', '/summer1.jpg', '/summer2.jpg', '/summer3.jpg'],
      video: '/summer-video.mp4',
    },
  },
  { key:'lux',     usd:'$100', kgs:'8 800', tier:'premium', img:'/room-lux.jpg',     gallery: null },
  { key:'yurt',    usd:'$100', kgs:'8 800', tier:'premium', img:'/room-yurt.jpg',    gallery: null },
];

const TIER_BADGE: Record<string,string> = {
  hostel:  `background:${C.forest};color:${C.cream}`,
  mid:     `background:${C.brown};color:${C.cream}`,
  family:  `background:${C.mid};color:${C.cream}`,
  premium: `background:${C.gold};color:${C.deep}`,
};

// ── ACTIVITIES ────────────────────────────────────────────────
const ACTS = [
  { icon: Compass,         tk:'a1', dk:'a1d' },
  { icon: UtensilsCrossed, tk:'a2', dk:'a2d' },
  { icon: Droplets,        tk:'a3', dk:'a3d' },
  { icon: Mountain,        tk:'a4', dk:'a4d' },
  { icon: Fish,            tk:'a5', dk:'a5d' },
  { icon: Leaf,            tk:'a6', dk:'a6d' },
  { icon: Flame,           tk:'a7', dk:'a7d' },
  { icon: Car,             tk:'a8', dk:'a8d' },
  { icon: Coffee,          tk:'a9', dk:'a9d' },
  { icon: Wifi,            tk:'a10', dk:'a10d' },
  { icon: Clock,           tk:'a11', dk:'a11d' },
];

const WA = 'https://wa.me/message/SNUKLEBLJCCNB1';

// On a GitHub Pages project site the app is served from a sub-path. Vite exposes
// it as `import.meta.env.BASE_URL` (e.g. '/chychkan-real/'), which already has a
// trailing slash — so strip the leading slash off asset paths before joining.
const asset = (p: string) => import.meta.env.BASE_URL + p.replace(/^\//, '');

// ── KYRGYZ MOTIFS ─────────────────────────────────────────────
// Tunduk — the crown of the yurt (as on the national flag), used as the brand mark.
function Tunduk({ size = 18, color = C.gold, opacity = 1 }: { size?: number; color?: string; opacity?: number }) {
  const arcs = (
    <g stroke={color} strokeWidth="2.4" strokeLinecap="round" fill="none">
      <path d="M9 29 C15 16, 33 16, 39 29" />
      <path d="M12 34 C17 24, 31 24, 36 34" />
      <path d="M15 39 C19 32, 29 32, 33 39" />
    </g>
  );
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true"
      style={{ flexShrink: 0, opacity, display: 'block' }}>
      <circle cx="24" cy="24" r="20.5" stroke={color} strokeWidth="3" />
      {arcs}
      <g transform="rotate(180 24 24)">{arcs}</g>
    </svg>
  );
}

// Kochkor muyuz — the ram's-horn motif from Kyrgyz felt carpets, used as a flourish.
function HornOrnament({ width = 64, color = C.gold, opacity = 1 }: { width?: number; color?: string; opacity?: number }) {
  return (
    <svg width={width} height={width / 2} viewBox="0 0 64 32" fill="none" aria-hidden="true"
      style={{ flexShrink: 0, opacity, display: 'block' }}>
      <g stroke={color} strokeWidth="2" strokeLinecap="round" fill="none">
        <path d="M32 28 C32 14 25 6 15 6 C7 6 3 12 5 18 C6.5 22.5 12 23.5 14.5 20 C16.5 17 14.5 13 11 13.5" />
        <path d="M32 28 C32 14 39 6 49 6 C57 6 61 12 59 18 C57.5 22.5 52 23.5 49.5 20 C47.5 17 49.5 13 53 13.5" />
      </g>
      <circle cx="32" cy="28" r="2.2" fill={color} />
    </svg>
  );
}

// Oversized, barely-visible word behind a section — pure texture.
function Watermark({ text }: { text: string }) {
  return (
    <span aria-hidden="true"
      style={{ position:'absolute', top:'2rem', right:'-0.5rem', zIndex:0,
        fontFamily:F.serif, fontStyle:'italic', fontWeight:600, lineHeight:1,
        fontSize:'clamp(5rem,14vw,12rem)', color:C.forest, opacity:0.05,
        whiteSpace:'nowrap', pointerEvents:'none', userSelect:'none' }}>
      {text}
    </span>
  );
}

// ── COUNT-UP STAT ─────────────────────────────────────────────
function CountUp({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLElement>(null);
  const [n, setN] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setN(value); return; }
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / 1400);
        setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [value]);

  return (
    <strong ref={ref} style={{ display:'block', fontFamily:F.serif, fontSize:'1.9rem',
      fontWeight:600, color:C.forest, lineHeight:1, fontVariantNumeric:'tabular-nums' }}>
      {n}{suffix}
    </strong>
  );
}

// ── SECTION LABEL ─────────────────────────────────────────────
function SectionLabel({ text, center = false }: { text: string; center?: boolean }) {
  return (
    <p className={`flex items-center gap-3 mb-4 ${center ? 'justify-center' : ''}`}
      style={{ fontFamily:F.sans, fontSize:'0.6rem', fontWeight:600,
        letterSpacing:'0.28em', textTransform:'uppercase', color:C.gold }}>
      <Tunduk size={15} />
      {text}
    </p>
  );
}

// ── LIGHTBOX ──────────────────────────────────────────────────
type GalleryData = { images: string[]; video: string };

function Lightbox({ gallery, name, onClose }: { gallery: GalleryData; name: string; onClose: () => void }) {
  // images first, then video as last "slide"
  const total = gallery.images.length + 1; // +1 for video
  const [idx, setIdx] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const prev = () => setIdx(i => (i - 1 + total) % total);
  const next = () => setIdx(i => (i + 1) % total);

  // keyboard nav
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const isVideo = idx === gallery.images.length;

  return (
    <div
      className="fixed inset-0 z-[500] flex items-center justify-center"
      style={{ background: 'rgba(10,18,12,0.96)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      {/* Inner — stop propagation so clicking media doesn't close */}
      <div className="relative w-full max-w-3xl mx-4 flex flex-col items-center"
        onClick={e => e.stopPropagation()}>

        {/* Close */}
        <button onClick={onClose} aria-label="Close gallery"
          className="absolute -top-12 right-0 p-2"
          style={{ color: 'rgba(247,242,232,0.6)', transition: 'color 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.color = C.cream)}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(247,242,232,0.6)')}
        ><X size={24} /></button>

        {/* Media */}
        <div style={{ width: '100%', aspectRatio: '3/4', position: 'relative', overflow: 'hidden', background: C.deep }}>
          {isVideo ? (
            <video
              ref={videoRef}
              src={asset(gallery.video)}
              controls
              autoPlay
              playsInline
              style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
            />
          ) : (
            <img
              src={asset(gallery.images[idx])}
              alt={`${name} ${idx + 1}`}
              style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
            />
          )}
        </div>

        {/* Prev / Next */}
        <button onClick={prev} aria-label="Previous"
          className="absolute left-0 top-1/2 -translate-y-1/2 p-3 hidden md:flex"
          style={{ color: C.cream, background: 'rgba(15,35,24,0.6)', transition: 'background 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.background = C.forest)}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(15,35,24,0.6)')}
        ><ChevronLeft size={22} /></button>
        <button onClick={next} aria-label="Next"
          className="absolute right-0 top-1/2 -translate-y-1/2 p-3 hidden md:flex"
          style={{ color: C.cream, background: 'rgba(15,35,24,0.6)', transition: 'background 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.background = C.forest)}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(15,35,24,0.6)')}
        ><ChevronRight size={22} /></button>

        {/* Dot indicators */}
        <div className="flex gap-2 mt-4">
          {Array.from({ length: total }).map((_, i) => (
            <button key={i} onClick={() => setIdx(i)} aria-label={`Slide ${i + 1}`}
              style={{
                width: i === idx ? 20 : 8, height: 8, borderRadius: 4,
                background: i === idx ? C.gold : 'rgba(247,242,232,0.25)',
                transition: 'all 0.3s', border: 'none', cursor: 'pointer', padding: 0,
              }}
            />
          ))}
        </div>

        {/* Counter + video hint */}
        <p style={{ fontFamily: F.sans, fontSize: '0.6rem', letterSpacing: '0.15em',
          color: 'rgba(247,242,232,0.4)', marginTop: '0.75rem', textTransform: 'uppercase' }}>
          {isVideo ? '▶ Video' : `${idx + 1} / ${gallery.images.length}`}
          {!isVideo && <span style={{ marginLeft: 12 }}>swipe or use ← →</span>}
        </p>

        {/* Mobile swipe */}
        <div className="absolute inset-0 flex md:hidden"
          onTouchStart={e => { (e.currentTarget as HTMLDivElement).dataset.tx = String(e.touches[0].clientX); }}
          onTouchEnd={e => {
            const start = Number((e.currentTarget as HTMLDivElement).dataset.tx ?? 0);
            const dx = e.changedTouches[0].clientX - start;
            if (Math.abs(dx) > 40) dx < 0 ? next() : prev();
          }}
          style={{ pointerEvents: 'auto' }}
        />
      </div>
    </div>
  );
}

// ── MAIN ──────────────────────────────────────────────────────
export default function Page() {
  const [lang, setLang]           = useState<Lang>('ky');
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [lightbox, setLightbox]   = useState<{ gallery: GalleryData; name: string } | null>(null);
  const heroParallax = useRef<HTMLDivElement>(null);
  const progressRef  = useRef<HTMLDivElement>(null);
  const tr = T[lang];

  // navbar state + scroll progress + hero parallax (direct style writes — no re-render per frame)
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const handler = () => {
      setScrolled(window.scrollY > 60);
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      if (progressRef.current)
        progressRef.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
      if (!reduceMotion && heroParallax.current && window.scrollY < window.innerHeight * 1.5)
        heroParallax.current.style.transform = `translateY(${window.scrollY * 0.25}px)`;
    };
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // section reveal
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } }),
      { threshold: 0.07, rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  const navLinks = [
    { href:'#about',     label: tr.nav_about },
    { href:'#rooms',     label: tr.nav_rooms },
    { href:'#activities',label: tr.nav_act   },
    { href:'#location',  label: tr.nav_loc   },
  ];

  return (
    <>
      {/* Scroll progress */}
      <div ref={progressRef} aria-hidden="true"
        style={{ position:'fixed', top:0, left:0, right:0, height:2, zIndex:60,
          background:`linear-gradient(to right, ${C.gold}, ${C.goldL})`,
          transform:'scaleX(0)', transformOrigin:'left' }} />

      {/* Film grain */}
      <div aria-hidden="true"
        style={{ position:'fixed', inset:0, zIndex:40, pointerEvents:'none',
          opacity:0.045, mixBlendMode:'overlay',
          backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E")` }} />

      {/* ════════════════════════════════════════
          NAVBAR
      ════════════════════════════════════════ */}
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? `rgba(15,35,24,0.96)` : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? `1px solid rgba(201,160,82,0.15)` : '1px solid transparent',
          padding: scrolled ? '0.75rem 2rem' : '1.25rem 2rem',
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">

          {/* Logo */}
          <a href="#" aria-label="Chychkan Home"
            style={{ display:'flex', alignItems:'center', gap:'0.65rem', textDecoration:'none' }}>
            <Tunduk size={28} />
            <span style={{ fontFamily:F.serif, fontSize:'1.3rem', fontWeight:600, color:C.cream,
              letterSpacing:'0.03em', lineHeight:1.1 }}>
              Chychkan
              <span style={{ display:'block', fontFamily:F.sans, fontSize:'0.55rem', fontWeight:400,
                letterSpacing:'0.22em', color:C.gold, textTransform:'uppercase', marginTop:1 }}>
                Touristic Complex
              </span>
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            {navLinks.map(l => (
              <a key={l.href} href={l.href}
                style={{ fontFamily:F.sans, fontSize:'0.65rem', fontWeight:500,
                  letterSpacing:'0.14em', textTransform:'uppercase', color:'rgba(247,242,232,0.75)',
                  textDecoration:'none', transition:'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = C.cream)}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(247,242,232,0.75)')}
              >{l.label}</a>
            ))}
          </nav>

          {/* Right: lang + book */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex overflow-hidden" style={{ border:`1px solid rgba(201,160,82,0.3)` }}>
              {(['ky','ru','en'] as Lang[]).map(l => (
                <button key={l} onClick={() => setLang(l)}
                  style={{ fontFamily:F.sans, fontSize:'0.58rem', fontWeight:700,
                    letterSpacing:'0.1em', padding:'0.35rem 0.6rem', border:'none', cursor:'pointer',
                    background: lang===l ? C.gold : 'transparent',
                    color: lang===l ? C.deep : 'rgba(247,242,232,0.5)',
                    transition:'all 0.2s' }}
                >{l.toUpperCase()}</button>
              ))}
            </div>
            <a href={WA} target="_blank" rel="noopener noreferrer"
              style={{ fontFamily:F.sans, background:C.gold, color:C.deep, fontSize:'0.6rem',
                fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase',
                padding:'0.5rem 1.1rem', textDecoration:'none', transition:'background 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.background = C.goldL)}
              onMouseLeave={e => (e.currentTarget.style.background = C.gold)}
            >{tr.nav_book}</a>
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden p-2" onClick={() => setMenuOpen(true)}
            aria-label="Open menu" style={{ color: C.cream }}>
            <Menu size={22} />
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {/* Lightbox */}
      {lightbox && (
        <Lightbox gallery={lightbox.gallery} name={lightbox.name} onClose={() => setLightbox(null)} />
      )}

      {menuOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col"
          style={{ background: C.deep }}>
          <div className="flex items-center justify-between px-6 py-5"
            style={{ borderBottom:`1px solid rgba(201,160,82,0.2)` }}>
            <span style={{ display:'flex', alignItems:'center', gap:'0.6rem' }}>
              <Tunduk size={22} />
              <span style={{ fontFamily:F.serif, fontSize:'1.2rem', color:C.cream }}>Chychkan</span>
            </span>
            <button onClick={() => setMenuOpen(false)} aria-label="Close menu" style={{ color:C.cream }}>
              <X size={22} />
            </button>
          </div>
          <nav className="flex flex-col flex-1 justify-center px-8 gap-6">
            {navLinks.map(l => (
              <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
                style={{ fontFamily:F.serif, fontSize:'2rem', fontWeight:500,
                  color:C.cream, textDecoration:'none', letterSpacing:'0.02em' }}
              >{l.label}</a>
            ))}
          </nav>
          <div className="px-8 pb-10 flex flex-col gap-4">
            <div className="flex" style={{ border:`1px solid rgba(201,160,82,0.3)`, width:'fit-content' }}>
              {(['ky','ru','en'] as Lang[]).map(l => (
                <button key={l} onClick={() => { setLang(l); setMenuOpen(false); }}
                  style={{ fontFamily:F.sans, fontSize:'0.65rem', fontWeight:700,
                    padding:'0.45rem 0.8rem', border:'none', cursor:'pointer',
                    background: lang===l ? C.gold : 'transparent',
                    color: lang===l ? C.deep : 'rgba(247,242,232,0.5)' }}
                >{l.toUpperCase()}</button>
              ))}
            </div>
            <a href={WA} target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center gap-2"
              style={{ fontFamily:F.sans, background:C.gold, color:C.deep, fontSize:'0.7rem',
                fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase',
                padding:'0.9rem', textDecoration:'none' }}
            >{tr.nav_book}</a>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════
          HERO
      ════════════════════════════════════════ */}
      <section id="hero" className="relative min-h-screen flex flex-col justify-end overflow-hidden"
        aria-label="Hero section">

        {/* Background image — outer div is scroll-parallaxed, inner keeps the Ken Burns drift.
            Extended above the viewport so the parallax shift never exposes an edge. */}
        <div ref={heroParallax} className="absolute inset-0" style={{ willChange:'transform' }}>
          <div className="hero-bg"
            style={{ position:'absolute', left:0, right:0, top:'-25%', height:'130%',
              backgroundImage:`url('${asset('/hero-bg.webp')}')`,
              backgroundSize:'cover', backgroundPosition:'center' }} />
        </div>

        {/* Gradient overlays */}
        <div className="absolute inset-0"
          style={{ background:'linear-gradient(to bottom, rgba(10,20,12,0.25) 0%, rgba(10,20,12,0.05) 40%, rgba(10,20,12,0.78) 100%)' }} />
        <div className="absolute inset-0"
          style={{ background:'linear-gradient(to right, rgba(10,20,12,0.4) 0%, transparent 65%)' }} />

        {/* Content */}
        <div className="relative z-10 px-6 pb-16 md:px-16 md:pb-24 max-w-4xl">

          {/* Season badge */}
          <div className="flex items-center gap-2 mb-6 fade-up fade-up-1">
            <span className="w-1.5 h-1.5 rounded-full"
              style={{ background:C.gold, boxShadow:`0 0 6px ${C.gold}`, flexShrink:0,
                animation:'pulse 2s ease-in-out infinite' }} />
            <span style={{ fontFamily:F.sans, fontSize:'0.6rem', fontWeight:600,
              letterSpacing:'0.25em', textTransform:'uppercase', color:C.goldL }}>
              {tr.season}
            </span>
          </div>

          {/* Headline */}
          <h1 className="fade-up fade-up-2" style={{ fontFamily:F.serif, lineHeight:0.95,
            letterSpacing:'-0.03em', color:C.cream, margin:'0 0 1.5rem' }}>
            <span style={{ display:'block', fontSize:'clamp(4.5rem,13vw,11rem)', fontWeight:500 }}>
              {tr.h1}
            </span>
            <em style={{ display:'block', fontSize:'clamp(3.8rem,11vw,9rem)', fontWeight:400,
              fontStyle:'italic', color:C.goldL }}>
              {tr.h2}
            </em>
          </h1>

          {/* Tagline */}
          <p className="fade-up fade-up-3" style={{ fontFamily:F.sans, fontSize:'0.7rem',
            fontWeight:300, letterSpacing:'0.14em', textTransform:'uppercase',
            color:'rgba(247,242,232,0.6)', marginBottom:'2rem', display:'flex',
            alignItems:'center', gap:'0.75rem' }}>
            <span style={{ width:32, height:1, background:C.gold, display:'block', flexShrink:0 }} />
            {tr.tagline}
          </p>

          {/* CTA */}
          <a href={WA} target="_blank" rel="noopener noreferrer"
            className="fade-up fade-up-4 inline-flex items-center gap-3 group"
            style={{ fontFamily:F.sans, background:C.gold, color:C.deep, fontSize:'0.65rem',
              fontWeight:700, letterSpacing:'0.18em', textTransform:'uppercase',
              padding:'0.95rem 2rem', textDecoration:'none', transition:'background 0.25s' }}
            onMouseEnter={e => (e.currentTarget.style.background = C.goldL)}
            onMouseLeave={e => (e.currentTarget.style.background = C.gold)}
          >
            {tr.cta}
            <ArrowRight size={14} style={{ transition:'transform 0.2s' }}
              className="group-hover:translate-x-1" />
          </a>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 right-8 z-10 hidden md:flex flex-col items-center gap-2"
          aria-hidden="true">
          <span style={{ fontFamily:F.sans, fontSize:'0.5rem', letterSpacing:'0.25em',
            color:'rgba(247,242,232,0.35)', textTransform:'uppercase', writingMode:'vertical-rl' }}>
            scroll
          </span>
          <span style={{ width:1, height:44,
            background:`linear-gradient(to bottom, ${C.gold}, transparent)` }} />
        </div>
      </section>

      {/* ════════════════════════════════════════
          MARQUEE
      ════════════════════════════════════════ */}
      <div aria-hidden="true"
        style={{ background:C.deep, borderBottom:'1px solid rgba(201,160,82,0.2)',
          overflow:'hidden', padding:'0.9rem 0' }}>
        <div className="marquee-track" style={{ display:'flex', width:'max-content' }}>
          {(() => {
            const items = [`${tr.h1} ${tr.h2}`, ...tr.tagline.split('·').map(s => s.trim())];
            // rendered 4× so the -50% loop point always has identical content behind it
            return [...items, ...items, ...items, ...items].map((item, i) => (
              <span key={i} style={{ display:'inline-flex', alignItems:'center', gap:'2.5rem',
                paddingRight:'2.5rem', fontFamily:F.serif, fontStyle:'italic', fontSize:'1.05rem',
                letterSpacing:'0.06em', color:'rgba(223,192,122,0.75)', whiteSpace:'nowrap' }}>
                {item}
                <Tunduk size={13} opacity={0.5} />
              </span>
            ));
          })()}
        </div>
      </div>

      {/* ════════════════════════════════════════
          ABOUT
      ════════════════════════════════════════ */}
      <section id="about" style={{ background:C.white, padding:'6rem 1.5rem',
        position:'relative', overflow:'hidden' }}>
        <Watermark text={tr.h1} />
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center relative z-10">

          {/* Text */}
          <div>
            <SectionLabel text={tr.about_label} />
            <h2 className="reveal" style={{ fontFamily:F.serif, fontSize:'clamp(2.4rem,5vw,4rem)',
              fontWeight:500, lineHeight:1.05, letterSpacing:'-0.02em', color:C.deep, marginBottom:'0.5rem' }}>
              {tr.about_title}
            </h2>
            <p className="reveal reveal-delay-1" style={{ fontFamily:F.serif, fontStyle:'italic',
              fontSize:'1.05rem', color:C.mid, marginBottom:'1.5rem' }}>
              {tr.about_italic}
            </p>
            <div style={{ width:44, height:1, background:C.gold, marginBottom:'1.75rem' }} />
            <p className="reveal reveal-delay-1" style={{ fontFamily:F.sans, fontSize:'0.85rem',
              fontWeight:300, lineHeight:1.9, color:C.muted, marginBottom:'1rem' }}>
              {tr.about_p1}
            </p>
            <p className="reveal reveal-delay-2" style={{ fontFamily:F.sans, fontSize:'0.85rem',
              fontWeight:300, lineHeight:1.9, color:C.muted, marginBottom:'2.5rem' }}>
              {tr.about_p2}
            </p>

            {/* Stats — numbers count up when scrolled into view */}
            <div className="grid grid-cols-2 gap-5 reveal reveal-delay-2">
              {([
                { num:2200, suffix:'м',  lk:'s_alt' }, { num:240, suffix:'км', lk:'s_km' },
                { num:2012, suffix:'',   lk:'s_yr'  }, { val:'B&B',            lk:'s_bb' },
              ] as { lk:string; num?:number; suffix?:string; val?:string }[]).map(s => (
                <div key={s.lk} style={{ borderLeft:`2px solid ${C.gold}`, paddingLeft:'1rem' }}>
                  {s.num !== undefined
                    ? <CountUp value={s.num} suffix={s.suffix ?? ''} />
                    : <strong style={{ display:'block', fontFamily:F.serif, fontSize:'1.9rem',
                        fontWeight:600, color:C.forest, lineHeight:1 }}>{s.val}</strong>}
                  <span style={{ fontFamily:F.sans, fontSize:'0.6rem', textTransform:'uppercase',
                    letterSpacing:'0.1em', color:C.muted }}>{tr[s.lk]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Video */}
          <div className="reveal reveal-delay-1 relative">
            <div style={{ aspectRatio:'4/5', overflow:'hidden', background:C.deep }}>
              <video
                src={asset('/about-video.mp4')}
                autoPlay muted loop playsInline
                style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}
              />
            </div>
            {/* Year accent */}
            <div className="absolute -bottom-5 -left-5 hidden md:flex flex-col items-center justify-center"
              style={{ width:90, height:90, background:C.forest,
                boxShadow:'0 12px 40px rgba(0,0,0,0.2)' }}>
              <strong style={{ fontFamily:F.serif, fontSize:'2rem', color:C.gold, lineHeight:1, fontWeight:600 }}>12+</strong>
              <span style={{ fontFamily:F.sans, fontSize:'0.5rem', letterSpacing:'0.15em',
                textTransform:'uppercase', color:C.creamD, marginTop:2 }}>seasons</span>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          ROOMS
      ════════════════════════════════════════ */}
      <section id="rooms" style={{ background:C.creamD, padding:'6rem 1.5rem',
        position:'relative', overflow:'hidden' }}>
        <Watermark text={tr.rooms_label} />
        <div className="max-w-6xl mx-auto relative z-10">

          <div className="mb-12">
            <SectionLabel text={tr.rooms_label} />
            <h2 className="reveal" style={{ fontFamily:F.serif, fontSize:'clamp(2.4rem,5vw,4rem)',
              fontWeight:500, letterSpacing:'-0.02em', color:C.deep }}>
              {tr.rooms_title}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {ROOMS.map((room, i) => (
              <article key={room.key} className={`reveal reveal-delay-${i+1}`}
                style={{ background:C.white, overflow:'hidden',
                  boxShadow:'0 2px 16px rgba(0,0,0,0.06)',
                  transition:'transform 0.35s, box-shadow 0.35s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform='translateY(-6px)';
                  (e.currentTarget as HTMLElement).style.boxShadow='0 16px 40px rgba(0,0,0,0.12)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform='';
                  (e.currentTarget as HTMLElement).style.boxShadow='0 2px 16px rgba(0,0,0,0.06)'; }}
              >
                {/* Image */}
                <div
                  style={{ position:'relative', background:C.creamD, overflow:'hidden',
                    cursor: room.gallery ? 'pointer' : 'default' }}
                  onClick={() => room.gallery && setLightbox({ gallery: room.gallery, name: tr[room.key] })}
                  role={room.gallery ? 'button' : undefined}
                  aria-label={room.gallery ? `View ${tr[room.key]} gallery` : undefined}
                >
                  <span style={{ position:'absolute', top:10, left:10, zIndex:1,
                    fontFamily:F.sans, fontSize:'0.55rem', fontWeight:700,
                    letterSpacing:'0.15em', textTransform:'uppercase',
                    padding:'0.2rem 0.55rem', ...(Object.fromEntries(
                      TIER_BADGE[room.tier].split(';').map(s => {
                        const [k,v] = s.split(':');
                        return [k?.trim().replace(/-([a-z])/g, (_,c) => c.toUpperCase()), v?.trim()];
                      }).filter(([k]) => k)
                    )) }}>
                    {tr[`t_${room.tier}`] ?? room.tier}
                  </span>
                  {/* Gallery badge */}
                  {room.gallery && (
                    <div style={{ position:'absolute', bottom:10, right:10, zIndex:1,
                      background:'rgba(15,35,24,0.75)', color:C.cream, backdropFilter:'blur(4px)',
                      padding:'0.25rem 0.6rem', display:'flex', alignItems:'center', gap:4,
                      fontFamily:F.sans, fontSize:'0.55rem', letterSpacing:'0.1em' }}>
                      <Play size={10} fill="currentColor" />
                      {room.gallery.images.length + 1} photos
                    </div>
                  )}
                  <img src={asset(room.img)} alt={tr[room.key]}
                    style={{ width:'100%', height:'auto', display:'block', transition:'transform 0.6s' }}
                    loading="lazy"
                    onMouseEnter={e => (e.currentTarget.style.transform='scale(1.02)')}
                    onMouseLeave={e => (e.currentTarget.style.transform='')}
                  />
                </div>

                {/* Info */}
                <div style={{ padding:'1.25rem' }}>
                  <h3 style={{ fontFamily:F.serif, fontSize:'1.25rem', fontWeight:500,
                    color:C.deep, marginBottom:'0.3rem', lineHeight:1.2 }}>
                    {tr[room.key]}
                  </h3>
                  <span style={{ display:'inline-block', fontFamily:F.sans, fontSize:'0.55rem',
                    letterSpacing:'0.12em', textTransform:'uppercase', border:`1px solid ${C.gold}`,
                    color:C.gold, padding:'0.12rem 0.45rem', marginBottom: room.singleUsd ? '0.5rem' : '1rem' }}>
                    {tr.bb}
                  </span>
                  {room.singleUsd && (
                    <p style={{ fontFamily:F.sans, fontSize:'0.6rem', color:C.muted,
                      lineHeight:1.5, marginBottom:'0.75rem', fontStyle:'italic' }}>
                      {tr.double_single}
                    </p>
                  )}
                  <div style={{ borderTop:`1px solid ${C.creamD}`, paddingTop:'0.9rem',
                    display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <div>
                      <span style={{ fontFamily:F.serif, fontSize:'1.4rem', fontWeight:600,
                        color:C.forest, lineHeight:1 }}>
                        {room.usd}
                        <small style={{ fontFamily:F.sans, fontSize:'0.55rem', fontWeight:300,
                          color:C.muted, marginLeft:2 }}>{tr.per_night}</small>
                      </span>
                      <span style={{ display:'block', fontFamily:F.sans, fontSize:'0.62rem',
                        color:C.muted, marginTop:1 }}>{room.kgs} KGS</span>
                    </div>
                    <a href={WA} target="_blank" rel="noopener noreferrer"
                      style={{ fontFamily:F.sans, background:C.forest, color:C.cream,
                        fontSize:'0.58rem', fontWeight:700, letterSpacing:'0.12em',
                        textTransform:'uppercase', padding:'0.5rem 0.9rem',
                        textDecoration:'none', transition:'background 0.2s',
                        minWidth:44, minHeight:44, display:'flex', alignItems:'center' }}
                      onMouseEnter={e => (e.currentTarget.style.background = C.deep)}
                      onMouseLeave={e => (e.currentTarget.style.background = C.forest)}
                    >{tr.book}</a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          ACTIVITIES
      ════════════════════════════════════════ */}
      <section id="activities" style={{ background:C.white, padding:'6rem 1.5rem' }}>
        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-14">
            <SectionLabel text={tr.act_label} center />
            <h2 className="reveal" style={{ fontFamily:F.serif, fontSize:'clamp(2.4rem,5vw,4rem)',
              fontWeight:500, letterSpacing:'-0.02em', color:C.deep, marginBottom:'0.75rem' }}>
              {tr.act_title}
            </h2>
            <p className="reveal reveal-delay-1" style={{ fontFamily:F.sans, fontSize:'0.83rem',
              fontWeight:300, color:C.muted, maxWidth:480, margin:'0 auto', lineHeight:1.8 }}>
              {tr.act_sub}
            </p>
          </div>

          {/* Ornament divider */}
          <div className="flex items-center justify-center mb-12" aria-hidden="true">
            <span style={{ width:60, height:1, background:`linear-gradient(to left, ${C.gold}, transparent)` }} />
            <span style={{ margin:'0 14px' }}><HornOrnament width={52} /></span>
            <span style={{ width:60, height:1, background:`linear-gradient(to right, ${C.gold}, transparent)` }} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px"
            style={{ background:`rgba(201,160,82,0.12)`, border:`1px solid rgba(201,160,82,0.12)` }}>
            {ACTS.map(({ icon: Icon, tk, dk }, i) => (
              <div key={tk} className={`reveal reveal-delay-${(i % 4) + 1}`}
                style={{ background:C.white, padding:'2rem 1.75rem',
                  transition:'background 0.3s, transform 0.3s',
                  display:'flex', flexDirection:'column', gap:'0.75rem' }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = C.forest;
                  const title = (e.currentTarget as HTMLElement).querySelector('.act-title') as HTMLElement;
                  const desc = (e.currentTarget as HTMLElement).querySelector('.act-desc') as HTMLElement;
                  const ico = (e.currentTarget as HTMLElement).querySelector('.act-icon') as HTMLElement;
                  if (title) title.style.color = C.cream;
                  if (desc) desc.style.color = 'rgba(237,229,208,0.65)';
                  if (ico) ico.style.color = C.goldL;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = C.white;
                  const title = (e.currentTarget as HTMLElement).querySelector('.act-title') as HTMLElement;
                  const desc = (e.currentTarget as HTMLElement).querySelector('.act-desc') as HTMLElement;
                  const ico = (e.currentTarget as HTMLElement).querySelector('.act-icon') as HTMLElement;
                  if (title) title.style.color = C.deep;
                  if (desc) desc.style.color = C.muted;
                  if (ico) ico.style.color = C.gold;
                }}
              >
                <Icon size={22} className="act-icon" style={{ color:C.gold, transition:'color 0.3s' }} />
                <div>
                  <p className="act-title" style={{ fontFamily:F.serif, fontSize:'1.1rem',
                    fontWeight:500, color:C.deep, transition:'color 0.3s', marginBottom:'0.25rem' }}>
                    {tr[tk]}
                  </p>
                  <p className="act-desc" style={{ fontFamily:F.sans, fontSize:'0.72rem',
                    fontWeight:300, color:C.muted, lineHeight:1.65, transition:'color 0.3s' }}>
                    {tr[dk]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          LOCATION
      ════════════════════════════════════════ */}
      <section id="location" style={{ background:C.creamD, padding:'6rem 1.5rem' }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start">

          {/* Directions */}
          <div>
            <SectionLabel text={tr.loc_label} />
            <h2 className="reveal" style={{ fontFamily:F.serif, fontSize:'clamp(2.2rem,4vw,3.4rem)',
              fontWeight:500, letterSpacing:'-0.02em', color:C.deep, marginBottom:'0.5rem' }}>
              {tr.loc_title}
            </h2>
            <p className="reveal reveal-delay-1" style={{ fontFamily:F.serif, fontStyle:'italic',
              fontSize:'1rem', color:C.mid, marginBottom:'2rem' }}>
              {tr.loc_sub}
            </p>

            {/* Route timeline — the gold line draws downward when the section scrolls in */}
            <div className="reveal" style={{ position:'relative' }}>
              <span className="route-draw" aria-hidden="true"
                style={{ position:'absolute', left:'calc(1.25rem - 0.5px)', top:'1.25rem',
                  bottom:'3rem', width:1,
                  background:`linear-gradient(to bottom, ${C.gold}, rgba(201,160,82,0.25))` }} />
              {[
                { n:'01', t:'d1t', b:'d1b' }, { n:'02', t:'d2t', b:'d2b' },
                { n:'03', t:'d3t', b:'d3b' }, { n:'04', t:'d4t', b:'d4b' },
              ].map((d, i, arr) => (
                <div key={d.n}
                  style={{ display:'grid', gridTemplateColumns:'2.5rem 1fr', gap:'1.1rem',
                    paddingBottom: i === arr.length - 1 ? 0 : '1.75rem', position:'relative' }}>
                  <span style={{ width:'2.5rem', height:'2.5rem', borderRadius:'50%',
                    border:`1px solid ${C.gold}`, background:C.creamD, display:'flex',
                    alignItems:'center', justifyContent:'center', fontFamily:F.serif,
                    fontSize:'0.95rem', fontWeight:600, color:C.gold,
                    position:'relative', zIndex:1 }}>{d.n}</span>
                  <div style={{ paddingTop:'0.3rem' }}>
                    <strong style={{ display:'block', fontFamily:F.sans, fontSize:'0.75rem',
                      fontWeight:600, color:C.deep, marginBottom:'0.2rem' }}>{tr[d.t]}</strong>
                    <span style={{ fontFamily:F.sans, fontSize:'0.72rem', fontWeight:300,
                      color:C.muted }}>{tr[d.b]}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Map links */}
            <div className="flex gap-3 mt-6 reveal reveal-delay-2">
              <a href="https://maps.google.com/?q=Chychkan+Gorge+Kyrgyzstan"
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2"
                style={{ fontFamily:F.sans, background:C.forest, color:C.cream, fontSize:'0.62rem',
                  fontWeight:600, letterSpacing:'0.12em', textTransform:'uppercase',
                  padding:'0.7rem 1.2rem', textDecoration:'none', transition:'background 0.2s',
                  minHeight:44 }}
                onMouseEnter={e => (e.currentTarget.style.background = C.deep)}
                onMouseLeave={e => (e.currentTarget.style.background = C.forest)}
              >
                <MapPin size={13} />
                {tr.map_google}
              </a>
              <a href="https://2gis.kg/bishkek/search/Touristic%20Complex%20Chychkan"
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2"
                style={{ fontFamily:F.sans, border:`1px solid ${C.forest}`, color:C.forest,
                  fontSize:'0.62rem', fontWeight:600, letterSpacing:'0.12em',
                  textTransform:'uppercase', padding:'0.7rem 1.2rem',
                  textDecoration:'none', transition:'all 0.2s', background:'transparent',
                  minHeight:44 }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background=C.forest;
                  (e.currentTarget as HTMLElement).style.color=C.cream; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background='transparent';
                  (e.currentTarget as HTMLElement).style.color=C.forest; }}
              >
                <MapPin size={13} />
                {tr.map_2gis}
              </a>
            </div>
          </div>

          {/* Map */}
          <div className="reveal reveal-delay-2">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d96000!2d73.4!3d41.75!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38bb44f4a2d63b1b%3A0xb2f0e5938ee3e31c!2sChychkan%20Gorge!5e0!3m2!1sen!2skg!4v1699000000000"
              style={{ width:'100%', aspectRatio:'4/3', border:0,
                filter:'contrast(1.05) saturate(0.75)', display:'block' }}
              allowFullScreen loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Chychkan Gorge location map"
            />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          CTA
      ════════════════════════════════════════ */}
      <section style={{ position:'relative', padding:'8rem 1.5rem',
        textAlign:'center', overflow:'hidden', background:C.forest }}>
        <div style={{ position:'absolute', inset:0,
          backgroundImage:`url('${asset('/kyrgyzstan-bg.jpg')}')`,
          backgroundSize:'cover', backgroundPosition:'center', opacity:0.12 }} />
        <div style={{ position:'absolute', inset:0,
          background:'linear-gradient(to bottom, rgba(27,61,47,0.6), rgba(15,35,24,0.8))' }} />

        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="flex justify-center mb-6" aria-hidden="true">
            <HornOrnament width={60} opacity={0.8} />
          </div>
          <SectionLabel text={tr.cta_label} center />
          <h2 className="reveal" style={{ fontFamily:F.serif, fontSize:'clamp(2.5rem,6vw,5rem)',
            fontWeight:500, lineHeight:1.05, letterSpacing:'-0.02em', color:C.cream,
            marginBottom:'0.75rem' }}>
            {tr.cta_title}
          </h2>
          <p className="reveal reveal-delay-1" style={{ fontFamily:F.serif, fontStyle:'italic',
            fontSize:'1.1rem', color:'rgba(247,242,232,0.6)', marginBottom:'2.5rem' }}>
            {tr.cta_italic}
          </p>
          <div className="flex flex-wrap gap-4 justify-center reveal reveal-delay-2">
            <a href={WA} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 group"
              style={{ fontFamily:F.sans, background:C.gold, color:C.deep, fontSize:'0.65rem',
                fontWeight:700, letterSpacing:'0.18em', textTransform:'uppercase',
                padding:'1.05rem 2.25rem', textDecoration:'none', transition:'background 0.25s',
                minHeight:48 }}
              onMouseEnter={e => (e.currentTarget.style.background = C.goldL)}
              onMouseLeave={e => (e.currentTarget.style.background = C.gold)}
            >
              {tr.cta_btn}
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="https://instagram.com/chychkan.tourism" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2"
              style={{ fontFamily:F.sans, border:`1px solid rgba(247,242,232,0.3)`, color:C.cream,
                fontSize:'0.65rem', fontWeight:600, letterSpacing:'0.18em',
                textTransform:'uppercase', padding:'1.05rem 2.25rem',
                textDecoration:'none', transition:'border-color 0.2s', minHeight:48 }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = C.cream)}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(247,242,232,0.3)')}
            >
              @chychkan.tourism
            </a>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════ */}
      <footer style={{ background:C.deep, borderTop:`1px solid rgba(201,160,82,0.15)`,
        padding:'2.5rem 1.5rem' }}>
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div style={{ display:'flex', alignItems:'center', gap:'0.8rem' }}>
            <Tunduk size={32} opacity={0.85} />
            <div>
              <span style={{ fontFamily:F.serif, fontSize:'1.05rem', fontWeight:500, color:C.cream }}>
                Touristic Complex Chychkan
              </span>
              <span style={{ display:'block', fontFamily:F.sans, fontSize:'0.55rem',
                letterSpacing:'0.2em', textTransform:'uppercase', color:C.gold, marginTop:4 }}>
                {tr.foot_open}
              </span>
            </div>
          </div>
          <nav className="flex gap-5" aria-label="Footer navigation">
            {(['#about','#rooms','#activities','#location'] as const).map((href, i) => (
              <a key={href} href={href}
                style={{ fontFamily:F.sans, fontSize:'0.6rem', letterSpacing:'0.12em',
                  textTransform:'uppercase', color:'rgba(237,229,208,0.4)',
                  textDecoration:'none', transition:'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = C.gold)}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(237,229,208,0.4)')}
              >
                {[tr.nav_about, tr.nav_rooms, tr.nav_act, tr.nav_loc][i]}
              </a>
            ))}
          </nav>
          <p style={{ fontFamily:F.sans, fontSize:'0.58rem', color:'rgba(237,229,208,0.25)' }}>
            {tr.foot_copy}
          </p>
        </div>
      </footer>
    </>
  );
}
