import { useState, useEffect, useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import Lenis from 'lenis';
import {
  UtensilsCrossed, Droplets, Mountain, Fish, Leaf,
  Flame, Car, Coffee, Wifi, Clock, Compass, MapPin,
  ArrowRight, Menu, X, ChevronLeft, ChevronRight, Play, Plus, Check, Users,
  Sun, Cloud, CloudRain, CloudSnow, CloudFog, CloudLightning, Volume2, VolumeX,
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
  red:    '#A63A2B', // shyrdak felt-carpet red — sparing accent
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
    nav_about:'Жөнүндө', nav_rooms:'Бөлмөлөр', nav_rest:'Ресторан', nav_act:'Активдүүлүк',
    nav_loc:'Жайгашкан жер', nav_book:'Брондоо',
    season:'Сезон: 1-май — 30-сентябрь',
    h1:'Чычкан', h2:'Капчыгайы',
    tagline:'Бишкектен 240 км · 2200м · 2012-жылдан берки',
    cta:'WhatsApp аркылуу брондоо',
    about_label:'Биз жөнүндө',
    about_title:'Тоолордун жүрөгүндө',
    about_italic:'Кыргызстандын эң кооз тоо аймагы',
    about_p1:'Чычкан комплекси Бишкек-Ош автожолундагы Ала-Бел ашуусунун арт жагында, деңиз деңгээлинен 2200 метр бийиктикте жайгашкан.',
    about_p2:'Кристалл таза суу, тоо абасы, чексиз жашыл токой — табигат менен биригүүнүн мыкты жери.',
    s_alt:'Деңиз деңгээлинен', s_km:'Бишкектен', s_yr:'Ачылган жыл', s_bb:'Эртең мен кирет',
    seasons_l:'сезон', snd:'Дарыянын добушу',
    meta_t:'Чычкан Капчыгайы — Тоо комплекси, Кыргызстан',
    meta_d:'Чычкан капчыгайындагы тоо комплекси, Бишкектен 240 км, 2200м. Бөлмөлөр, юрта, ресторан, ат жарышы, треккинг. 1-майдан 30-сентябрга чейин.',
    rooms_label:'Жайлоо', rooms_title:'Бөлмөлөр жана Баалар',
    bb:'Эртең мен кирет', per_night:'/түн', book:'Брондоо',
    hostel:'Жатакана', double:'Дабл', twin:'Твин', eco:'Экологиялык Үй', summer:'Жайкы Үй', lux:'Люкс (2 бөлмө)', yurt:'Балкондуу Юрта',
    t_hostel:'Жатакана', t_mid:'Комфорт', t_family:'Үй-бүлөлүк', t_premium:'Премиум',
    double_single:'Бир конок үчүн да жеткиликтүү: $50 / 4 500 KGS',
    rd_details:'Толугураак', rd_book_room:'Ушул бөлмөнү брондоо',
    cap_hostel:'4 конокко чейин', cap_double:'2 конок', cap_twin:'2 конок',
    cap_eco:'4 конокко чейин', cap_summer:'4 конокко чейин', cap_lux:'4 конокко чейин', cap_yurt:'3 конокко чейин',
    am_priv:'Жеке душ жана даараткана', am_shared:'Жалпы душ', am_view:'Тоо көрүнүшү',
    am_balcony:'Балкон', am_terrace:'Терраса', am_2rooms:'Эки бөлмө', am_heat:'Жылытуу',
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
    rest_label:'Даамдар', rest_title:'Кафе-Ресторан',
    rest_sub:'Кыргыз жана Азия ашканасы — тоо абасында',
    rest_note:'Меню сезонго жараша өзгөрөт',
    r1:'Бешбармак', r1d:'Улуттук даам — үй кесмеси жана эт',
    r2:'Тоо форели', r2d:'Тоо дарыяларынын таза балыгы',
    r3:'Самсы', r3d:'Тандырдан жаңы чыккан',
    r4:'Шашлык', r4d:'Чокто бышырылган эт',
    r5:'Боорсок жана чай', r5d:'Каймак жана варенье менен',
    r6:'Кымыз', r6d:'Жайкы сезондо — жайлоодон',
    faq_label:'Суроолор', faq_title:'Көп берилүүчү суроолор',
    f1:'Качан ачыксыздар?', f1a:'Ар жылы 1-майдан 30-сентябрга чейин иштейбиз. Кышында комплекс жабык.',
    f2:'Кантип брондоо керек?', f2a:'WhatsApp аркылуу жазыңыз — датаны, бөлмө түрүн жана конок санын көрсөтүңүз. Тез арада жооп беребиз.',
    f3:'Эртең мененки тамак киреби?', f3a:'Ооба, бардык бөлмөлөрдүн баасына эртең мененки тамак (B&B) кирет.',
    f4:'Кантип жетебиз?', f4a:'Бишкек-Ош трассасы (М41) менен, Ала-Бел ашуусунан кийин 40–50 км. Бишкектен болжол менен 3–3.5 саат.',
    f5:'Wi-Fi жана токтоочу жай барбы?', f5a:'Ооба, бүткүл аймакта акысыз Wi-Fi жана бардык конокторго акысыз токтоочу жай бар.',
    f6:'Үй-бүлө менен келсе болобу?', f6a:'Албетте! Үй-бүлөлүк бөлмөлөр, эко үй жана балдар үчүн кенен аянт бар.',
    gal_label:'Галерея', gal_title:'Тоолордогу учурлар',
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
    foot_copy:'Touristic Complex Chychkan',
  },
  ru: {
    nav_about:'О нас', nav_rooms:'Номера', nav_rest:'Ресторан', nav_act:'Активности',
    nav_loc:'Расположение', nav_book:'Бронирование',
    season:'Сезон: 1 мая — 30 сентября',
    h1:'Ущелье', h2:'Чычкан',
    tagline:'240 км от Бишкека · 2200м · С 2012 года',
    cta:'Забронировать в WhatsApp',
    about_label:'О нас',
    about_title:'В сердце гор',
    about_italic:'Одно из красивейших мест Кыргызстана',
    about_p1:'Комплекс «Чычкан» расположен на трассе Бишкек–Ош, за перевалом Ала-Бел, на высоте 2200 метров над уровнем моря.',
    about_p2:'Кристально чистые реки, горный воздух, бескрайние леса — лучшее место для единения с природой.',
    s_alt:'Над уровнем моря', s_km:'От Бишкека', s_yr:'Год основания', s_bb:'Завтрак включён',
    seasons_l:'сезонов', snd:'Звук реки',
    meta_t:'Ущелье Чычкан — Горный комплекс, Кыргызстан',
    meta_d:'Горный комплекс в ущелье Чычкан, 240 км от Бишкека, 2200м. Номера, юрта, ресторан, конные прогулки, треккинг. Открыт с 1 мая по 30 сентября.',
    rooms_label:'Проживание', rooms_title:'Номера и цены',
    bb:'Завтрак включён', per_night:'/ночь', book:'Забронировать',
    hostel:'Хостел', double:'Дабл', twin:'Твин', eco:'Эко Домик', summer:'Летник', lux:'Люкс (2 комнаты)', yurt:'Юрта с Балконом',
    t_hostel:'Хостел', t_mid:'Комфорт', t_family:'Семейный', t_premium:'Премиум',
    double_single:'Также доступен для 1 гостя: $50 / 4 500 KGS',
    rd_details:'Подробнее', rd_book_room:'Забронировать этот номер',
    cap_hostel:'До 4 гостей', cap_double:'2 гостя', cap_twin:'2 гостя',
    cap_eco:'До 4 гостей', cap_summer:'До 4 гостей', cap_lux:'До 4 гостей', cap_yurt:'До 3 гостей',
    am_priv:'Свой душ и туалет', am_shared:'Общий душ', am_view:'Вид на горы',
    am_balcony:'Балкон', am_terrace:'Терраса', am_2rooms:'Две комнаты', am_heat:'Отопление',
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
    rest_label:'Кухня', rest_title:'Кафе-Ресторан',
    rest_sub:'Кыргызская и азиатская кухня на горном воздухе',
    rest_note:'Меню меняется по сезону',
    r1:'Бешбармак', r1d:'Национальное блюдо — домашняя лапша и мясо',
    r2:'Горная форель', r2d:'Свежая рыба из горных рек',
    r3:'Самсы', r3d:'Прямо из тандыра',
    r4:'Шашлык', r4d:'Мясо на углях',
    r5:'Боорсоки и чай', r5d:'Со сливками и вареньем',
    r6:'Кымыз', r6d:'Летом — с джайлоо',
    faq_label:'Вопросы', faq_title:'Частые вопросы',
    f1:'Когда вы открыты?', f1a:'Работаем каждый год с 1 мая по 30 сентября. Зимой комплекс закрыт.',
    f2:'Как забронировать?', f2a:'Напишите нам в WhatsApp — укажите даты, тип номера и число гостей. Ответим быстро.',
    f3:'Завтрак включён?', f3a:'Да, завтрак (B&B) включён в стоимость всех номеров.',
    f4:'Как доехать?', f4a:'По трассе Бишкек–Ош (М41), 40–50 км после перевала Ала-Бел. Из Бишкека — примерно 3–3.5 часа.',
    f5:'Есть Wi-Fi и парковка?', f5a:'Да, бесплатный Wi-Fi по всей территории и бесплатная парковка для всех гостей.',
    f6:'Можно с семьёй?', f6a:'Конечно! Есть семейные номера, эко-домик и много места для детей.',
    gal_label:'Галерея', gal_title:'Моменты в горах',
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
    foot_copy:'Туристический комплекс Чычкан',
  },
  en: {
    nav_about:'About', nav_rooms:'Rooms', nav_rest:'Restaurant', nav_act:'Activities',
    nav_loc:'Location', nav_book:'Book',
    season:'Season: May 1 — September 30',
    h1:'Chychkan', h2:'Gorge',
    tagline:'240 km from Bishkek · 2,200m altitude · Est. 2012',
    cta:'Book via WhatsApp',
    about_label:'About Us',
    about_title:'In the heart of the mountains',
    about_italic:"One of Kyrgyzstan's most stunning natural retreats",
    about_p1:'Touristic Complex Chychkan sits on the Bishkek–Osh highway, past the Ala-Bel pass, at 2,200m above sea level.',
    about_p2:'Crystal rivers, mountain air, endless forest — the finest place to reconnect with nature.',
    s_alt:'Above sea level', s_km:'From Bishkek', s_yr:'Founded', s_bb:'Breakfast included',
    seasons_l:'seasons', snd:'River sound',
    meta_t:'Chychkan Gorge — Mountain Lodge, Kyrgyzstan',
    meta_d:'Mountain lodge in the Chychkan Gorge, 240 km from Bishkek at 2200m. Rooms, yurt, restaurant, horseback riding, trekking. Open May 1 — September 30.',
    rooms_label:'Accommodation', rooms_title:'Rooms & Rates',
    bb:'Breakfast included', per_night:'/night', book:'Book Now',
    hostel:'Hostel Room', double:'Double Room', twin:'Twin Room', eco:'Eco House', summer:'Summer House', lux:'Lux (2 rooms)', yurt:'Yurt with Balcony',
    t_hostel:'Hostel', t_mid:'Comfort', t_family:'Family', t_premium:'Premium',
    double_single:'Also available as single (1 guest): $50 / 4 500 KGS',
    rd_details:'Details', rd_book_room:'Book this room',
    cap_hostel:'Up to 4 guests', cap_double:'2 guests', cap_twin:'2 guests',
    cap_eco:'Up to 4 guests', cap_summer:'Up to 4 guests', cap_lux:'Up to 4 guests', cap_yurt:'Up to 3 guests',
    am_priv:'Private shower & WC', am_shared:'Shared shower', am_view:'Mountain view',
    am_balcony:'Balcony', am_terrace:'Terrace', am_2rooms:'Two rooms', am_heat:'Heating',
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
    rest_label:'The Table', rest_title:'Café-Restaurant',
    rest_sub:'Kyrgyz and Asian cuisine in the mountain air',
    rest_note:'The menu follows the season',
    r1:'Beshbarmak', r1d:'The national dish — hand-cut noodles and meat',
    r2:'Mountain Trout', r2d:'Fresh fish from the gorge rivers',
    r3:'Samsa', r3d:'Straight from the tandyr oven',
    r4:'Shashlik', r4d:'Charcoal-grilled skewers',
    r5:'Boorsok & Tea', r5d:'With cream and preserves',
    r6:'Kymyz', r6d:'In summer — from the high pastures',
    faq_label:'Questions', faq_title:'Frequently asked',
    f1:'When are you open?', f1a:'Every year from May 1 to September 30. The complex is closed in winter.',
    f2:'How do I book?', f2a:'Message us on WhatsApp with your dates, room type and number of guests. We reply quickly.',
    f3:'Is breakfast included?', f3a:'Yes — breakfast (B&B) is included in every room rate.',
    f4:'How do we get there?', f4a:'Take the Bishkek–Osh highway (M41); we are 40–50 km past the Ala-Bel pass. Around 3–3.5 hours from Bishkek.',
    f5:'Is there Wi-Fi and parking?', f5a:'Yes — free Wi-Fi across the complex and free parking for all guests.',
    f6:'Can we come with family?', f6a:'Of course! We have family rooms, an eco house, and plenty of space for kids.',
    gal_label:'Gallery', gal_title:'Moments in the mountains',
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
    foot_copy:'Touristic Complex Chychkan',
  },
};

// ── ROOMS ─────────────────────────────────────────────────────
const ROOMS: {
  key: string; usd: string; kgs: string; tier: string; img: string;
  gallery: { images: string[]; video: string } | null;
  amen: string[];
  singleUsd?: string; singleKgs?: string;
}[] = [
  { key:'hostel',  usd:'$15',  kgs:'1 500', tier:'hostel',  img:'/gen/xl-room-hostel.webp', gallery: null,
    amen:['am_shared','a10'] },
  { key:'double',  usd:'$65',  kgs:'5 800', tier:'mid',     img:'/gen/xl-room-double.webp', gallery: null,
    amen:['am_priv','am_view'], singleUsd:'$50', singleKgs:'4 500' },
  { key:'twin',    usd:'$65',  kgs:'5 800', tier:'mid',     img:'/gen/xl-room-twin.webp',   gallery: null,
    amen:['am_priv','am_heat'] },
  { key:'eco',     usd:'$85',  kgs:'7 500', tier:'family',  img:'/gen/xl-room-eco.webp',    gallery: null,
    amen:['am_priv','am_heat','am_view'] },
  {
    key:'summer',  usd:'$85',  kgs:'7 500', tier:'premium', img:'/summer4.webp',
    gallery: {
      images: ['/summer4.webp', '/summer1.webp', '/summer2.webp', '/summer3.webp'],
      video: '/summer-video.mp4',
    },
    amen:['am_terrace','am_priv','am_view'],
  },
  { key:'lux',     usd:'$100', kgs:'8 800', tier:'premium', img:'/gen/xl-room-lux.webp',    gallery: null,
    amen:['am_2rooms','am_priv','am_view'] },
  { key:'yurt',    usd:'$100', kgs:'8 800', tier:'premium', img:'/gen/xl-room-yurt.webp',   gallery: null,
    amen:['am_balcony','am_view'] },
];

const TIER_BADGE: Record<string,string> = {
  hostel:  `background:${C.forest};color:${C.cream}`,
  mid:     `background:${C.brown};color:${C.cream}`,
  family:  `background:${C.mid};color:${C.cream}`,
  premium: `background:${C.red};color:${C.cream}`,
};

// ── ACTIVITIES ────────────────────────────────────────────────
const ACTS: { icon: typeof Compass; tk: string; dk: string; img?: string }[] = [
  { icon: Compass,         tk:'a1', dk:'a1d', img:'/gen/g-jailoo.webp' },
  { icon: UtensilsCrossed, tk:'a2', dk:'a2d', img:'/gen/g-dish-samsa.webp' },
  { icon: Droplets,        tk:'a3', dk:'a3d' },
  { icon: Mountain,        tk:'a4', dk:'a4d', img:'/gen/g-forest.webp' },
  { icon: Fish,            tk:'a5', dk:'a5d', img:'/gen/g-river.webp' },
  { icon: Leaf,            tk:'a6', dk:'a6d', img:'/gen/g-berries.webp' },
  { icon: Flame,           tk:'a7', dk:'a7d', img:'/gen/g-night.webp' },
  { icon: Car,             tk:'a8', dk:'a8d' },
  { icon: Coffee,          tk:'a9', dk:'a9d', img:'/gen/g-dish-boorsok.webp' },
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

// ── ILLUSTRATED PANORAMA — generated artwork, 3 parallax layers ──
function Panorama() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const yFar  = useTransform(scrollYProgress, [0, 1], [0,  reduce ? 0 : -34]);
  const yMid  = useTransform(scrollYProgress, [0, 1], [18, reduce ? 18 : -58]);
  const yNear = useTransform(scrollYProgress, [0, 1], [40, reduce ? 40 : -96]);

  const layer = { position:'absolute' as const, left:0, right:0, top:-100, bottom:-100 };
  const svgProps = {
    viewBox: '0 0 1440 560',
    preserveAspectRatio: 'xMidYMax slice' as const,
    style: { width:'100%', height:'100%', display:'block' as const },
    'aria-hidden': true as const,
  };

  return (
    <section ref={ref} aria-hidden="true" className="relative overflow-hidden"
      style={{ height:'clamp(340px,46vw,560px)', background:'#F2E8D2' }}>

      {/* back — sky, sun, far ridge */}
      <motion.div style={{ ...layer, y: yFar }}>
        <svg {...svgProps}>
          <defs>
            <linearGradient id="pnSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#F7F2E8" />
              <stop offset="0.55" stopColor="#F2E8D2" />
              <stop offset="1" stopColor="#E9DFC2" />
            </linearGradient>
          </defs>
          <rect width="1440" height="560" fill="url(#pnSky)" />
          <circle cx="1064" cy="150" r="88" fill="#DFC07A" opacity="0.22" />
          <circle cx="1064" cy="150" r="46" fill="#DFC07A" opacity="0.9" />
          <path d="M520 120 q8 -8 16 0 M548 128 q7 -7 14 0 M300 168 q7 -7 14 0"
            stroke="#2E5E47" strokeWidth="2" fill="none" opacity="0.45" strokeLinecap="round" />
          <path d="M0 316 L150 208 L262 276 L420 170 L560 262 L730 186 L890 258 L1050 196 L1210 258 L1330 214 L1440 262 V560 H0 Z"
            fill="#9FB9A4" />
        </svg>
      </motion.div>

      {/* mid — mountains, gold ridge light, mist */}
      <motion.div style={{ ...layer, y: yMid }}>
        <svg {...svgProps}>
          <defs>
            <filter id="pnBlur"><feGaussianBlur stdDeviation="16" /></filter>
          </defs>
          <path d="M0 372 L120 268 L250 342 L400 240 L540 330 L700 250 L860 336 L1020 262 L1180 340 L1310 288 L1440 344 V560 H0 Z"
            fill="#4F7A5F" />
          <path d="M400 240 L462 288 M700 250 L646 296 M1020 262 L1076 308"
            stroke="#DFC07A" strokeWidth="1.5" opacity="0.55" />
          <ellipse cx="720" cy="366" rx="540" ry="44" fill="#F7F2E8" opacity="0.32" filter="url(#pnBlur)" />
        </svg>
      </motion.div>

      {/* near — dark hills, spruce forest, river, yurt, lodge */}
      <motion.div style={{ ...layer, y: yNear }}>
        <svg {...svgProps}>
          <defs>
            <linearGradient id="pnRiver" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#F7F2E8" stopOpacity="0.9" />
              <stop offset="1" stopColor="#DFC07A" stopOpacity="0.75" />
            </linearGradient>
            <g id="pnTree">
              <path d="M0 -64 L15 -36 L8 -36 L22 -10 L12 -10 L28 18 L-28 18 L-12 -10 L-22 -10 L-8 -36 L-15 -36 Z" />
            </g>
          </defs>

          <path d="M0 430 Q220 392 430 424 T860 428 T1440 416 V560 H0 Z" fill="#1B3D2F" />

          {/* river winding to the foreground */}
          <path d="M708 420 C 680 452 760 466 726 494 C 690 524 800 536 764 560 L 872 560 C 830 528 928 512 888 488 C 850 464 760 454 744 420 Z"
            fill="url(#pnRiver)" />

          {/* yurt on the left bank */}
          <g transform="translate(300 452)">
            <path d="M-36 0 a36 24 0 0 1 72 0 z" fill="#EDE5D0" />
            <path d="M-33 -9 h66" stroke="#C9A052" strokeWidth="1.4" opacity="0.7" />
            <rect x="-8" y="-17" width="16" height="17" rx="1.5" fill="#6B4226" />
            <circle cx="0" cy="-24" r="2.4" fill="#C9A052" />
          </g>

          {/* lodge on the right hill */}
          <g transform="translate(1130 420)">
            <path d="M-56 0 L0 -34 L56 0 Z" fill="#0F2318" />
            <rect x="-46" y="0" width="92" height="34" fill="#16342A" />
            <rect x="-26" y="10" width="13" height="13" fill="#DFC07A" opacity="0.9" />
            <rect x="13" y="10" width="13" height="13" fill="#DFC07A" opacity="0.9" />
          </g>

          {/* mid-ground trees */}
          <g fill="#163426">
            <use href="#pnTree" transform="translate(90 470) scale(0.55)" />
            <use href="#pnTree" transform="translate(190 466) scale(0.45)" />
            <use href="#pnTree" transform="translate(1010 466) scale(0.5)" />
            <use href="#pnTree" transform="translate(1330 470) scale(0.55)" />
          </g>

          {/* dark foreground */}
          <path d="M0 478 Q260 448 520 472 T1040 476 T1440 464 V560 H0 Z" fill="#0F2318" />
          <g fill="#0F2318">
            <use href="#pnTree" transform="translate(60 540) scale(1.15)" />
            <use href="#pnTree" transform="translate(160 548) scale(0.9)" />
            <use href="#pnTree" transform="translate(245 542) scale(1.25)" />
            <use href="#pnTree" transform="translate(1180 544) scale(1.05)" />
            <use href="#pnTree" transform="translate(1280 550) scale(0.85)" />
            <use href="#pnTree" transform="translate(1385 542) scale(1.2)" />
          </g>
        </svg>
      </motion.div>

      {/* etched caption */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-3"
        style={{ zIndex: 2 }}>
        <span style={{ width:26, height:1, background:'rgba(247,242,232,0.5)' }} />
        <span style={{ fontFamily:F.sans, fontSize:'0.55rem', fontWeight:600,
          letterSpacing:'0.3em', textTransform:'uppercase', color:'rgba(247,242,232,0.75)' }}>
          Чычкан · 2200м
        </span>
        <span style={{ width:26, height:1, background:'rgba(247,242,232,0.5)' }} />
      </div>
    </section>
  );
}

// ── RIVER AMBIENCE — synthesized with WebAudio, no audio files ──
// Two noise layers: brown-noise rumble through a slowly-wandering lowpass
// (the river body) and a quiet band-passed hiss (the spray).
function useRiverSound() {
  const ctxRef  = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const [on, setOn] = useState(false);

  const toggle = () => {
    if (!on) {
      if (!ctxRef.current) {
        const ctx = new AudioContext();
        const master = ctx.createGain();
        master.gain.value = 0;
        master.connect(ctx.destination);

        const noiseBuffer = (brown: boolean) => {
          const len = ctx.sampleRate * 4;
          const buf = ctx.createBuffer(1, len, ctx.sampleRate);
          const d = buf.getChannelData(0);
          let last = 0;
          for (let i = 0; i < len; i++) {
            const w = Math.random() * 2 - 1;
            if (brown) { last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5; }
            else d[i] = w;
          }
          return buf;
        };

        // river body
        const body = ctx.createBufferSource();
        body.buffer = noiseBuffer(true); body.loop = true;
        const lp = ctx.createBiquadFilter();
        lp.type = 'lowpass'; lp.frequency.value = 520; lp.Q.value = 0.4;
        body.connect(lp); lp.connect(master); body.start();

        // spray hiss
        const spray = ctx.createBufferSource();
        spray.buffer = noiseBuffer(false); spray.loop = true;
        const bp = ctx.createBiquadFilter();
        bp.type = 'bandpass'; bp.frequency.value = 1900; bp.Q.value = 0.7;
        const sprayGain = ctx.createGain(); sprayGain.gain.value = 0.10;
        spray.connect(bp); bp.connect(sprayGain); sprayGain.connect(master); spray.start();

        // slow wandering of the water
        const lfo = ctx.createOscillator(); lfo.frequency.value = 0.11;
        const lfoAmp = ctx.createGain(); lfoAmp.gain.value = 210;
        lfo.connect(lfoAmp); lfoAmp.connect(lp.frequency); lfo.start();

        ctxRef.current = ctx; gainRef.current = master;
      }
      ctxRef.current.resume();
      gainRef.current?.gain.setTargetAtTime(0.16, ctxRef.current.currentTime, 1.4);
      setOn(true);
    } else {
      if (ctxRef.current && gainRef.current) {
        gainRef.current.gain.setTargetAtTime(0, ctxRef.current.currentTime, 0.4);
        const ctx = ctxRef.current;
        setTimeout(() => { void ctx.suspend(); }, 1400);
      }
      setOn(false);
    }
  };
  return { on, toggle };
}

// ── LIVE GORGE WEATHER (Open-Meteo, no key, fails silently) ──
function useGorgeWeather() {
  const [wx, setWx] = useState<{ t: number; code: number } | null>(null);
  useEffect(() => {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=42.05&longitude=72.85&current=temperature_2m,weather_code')
      .then(r => r.json())
      .then(j => setWx({ t: Math.round(j.current.temperature_2m), code: j.current.weather_code }))
      .catch(() => {});
  }, []);
  return wx;
}

function WxIcon({ code, size = 13 }: { code: number; size?: number }) {
  const Icon =
    code <= 1 ? Sun :
    code <= 3 ? Cloud :
    code <= 48 ? CloudFog :
    code <= 67 ? CloudRain :
    code <= 77 ? CloudSnow :
    code <= 82 ? CloudRain :
    CloudLightning;
  return <Icon size={size} aria-hidden="true" />;
}

// ── JOURNEY STRIP — the road from Bishkek draws itself as you scroll ──
const ROAD_PATH = 'M80 320 C300 314 410 152 720 132 C1030 112 1160 294 1360 298';

function Journey({ caption }: { caption: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.9', 'end 0.4'] });
  const drawn = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const dist  = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  const label = {
    fontFamily: F.sans, fontSize: 11, fontWeight: 600 as const,
    letterSpacing: '0.18em', fill: C.muted,
  };

  return (
    <div ref={ref} className="reveal" style={{ marginBottom:'3.5rem' }}>
      <svg viewBox="0 0 1440 400" style={{ width:'100%', height:'auto', display:'block' }}
        aria-hidden="true">

        {/* faint backdrop ridges */}
        <path d="M0 344 L200 268 L360 330 L540 220 L700 320 L900 240 L1080 328 L1240 274 L1440 336 V400 H0 Z"
          fill="#2E5E47" opacity="0.08" />
        {/* the pass mountain with snow cap */}
        <path d="M552 336 L720 126 L888 336 Z" fill="#4F7A5F" opacity="0.22" />
        <path d="M688 166 L720 126 L752 166 L736 158 L720 172 L704 158 Z" fill="#F7F2E8" />

        {/* base road (faint dashes) + road that draws itself */}
        <path d={ROAD_PATH} fill="none" stroke="rgba(107,66,38,0.3)" strokeWidth="3"
          strokeDasharray="1 10" strokeLinecap="round" />
        <motion.path d={ROAD_PATH} fill="none" stroke={C.gold} strokeWidth="3"
          strokeLinecap="round" style={{ pathLength: reduce ? 1 : drawn }} />

        {/* travelling marker rides the same path */}
        {!reduce && (
          <motion.circle r="7" fill={C.gold} stroke="#FDFAF5" strokeWidth="2.5"
            style={{ offsetPath:`path('${ROAD_PATH}')`, offsetDistance: dist }} />
        )}

        {/* Bishkek — little skyline */}
        <g transform="translate(80 320)">
          <rect x="-30" y="-34" width="13" height="34" fill="#2E5E47" opacity="0.75" />
          <rect x="-13" y="-48" width="14" height="48" fill="#2E5E47" opacity="0.9" />
          <rect x="5" y="-26" width="12" height="26" fill="#2E5E47" opacity="0.6" />
          <circle r="5" cy="4" fill="#6B4226" />
        </g>

        {/* Ala-Bel flag */}
        <g transform="translate(720 126)">
          <line y2="-30" stroke="#6B4226" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M0 -30 l20 6 -20 6 z" fill={C.gold} />
        </g>

        {/* Chychkan — spruce + lodge + tunduk */}
        <g transform="translate(1360 298)">
          <path d="M-34 4 L-24 -34 L-14 4 Z M-24 -34 L-24 4" fill="#1B3D2F" />
          <path d="M2 4 v-20 h30 v20 z" fill="#1B3D2F" />
          <path d="M-4 -16 L17 -32 L38 -16 Z" fill="#0F2318" />
          <rect x="10" y="-10" width="7" height="8" fill="#DFC07A" />
          <circle r="5" cy="8" fill="#6B4226" />
        </g>

        {/* labels — readable on desktop only; mobile gets the HTML row below */}
        <g className="hidden sm:block">
          <text x="80" y="356" textAnchor="middle" style={label}>БИШКЕК · 750М</text>
          <text x="720" y="104" textAnchor="middle" style={{ ...label, fill:'#6B4226' }}>АЛА-БЕЛ · 3175М</text>
          <text x="1360" y="336" textAnchor="middle" style={{ ...label, fill:C.forest }}>ЧЫЧКАН · 2200М</text>
        </g>
      </svg>

      <div className="flex sm:hidden items-center justify-between" aria-hidden="true"
        style={{ fontFamily:F.sans, fontSize:'0.55rem', fontWeight:600, letterSpacing:'0.1em',
          color:C.muted, marginTop:'0.4rem' }}>
        <span>БИШКЕК · 750М</span>
        <span style={{ color:'#6B4226' }}>АЛА-БЕЛ · 3175М</span>
        <span style={{ color:C.forest }}>ЧЫЧКАН · 2200М</span>
      </div>

      <p style={{ fontFamily:F.serif, fontStyle:'italic', fontSize:'0.95rem', color:C.mid,
        textAlign:'center', margin:'0.5rem 0 0' }}>
        {caption}
      </p>
    </div>
  );
}

// ── NIGHT SCENE — generated starry-yurt artwork for the CTA ──
function NightScene() {
  // deterministic golden-angle star scatter — no randomness, stable across renders
  const stars = Array.from({ length: 72 }, (_, i) => ({
    x: Math.round(((i * 137.508) % 1440) * 10) / 10,
    y: Math.round((((i * 97.31) % 270) + 12) * 10) / 10,
    r: 0.5 + (i % 3) * 0.35,
    o: 0.2 + ((i * 7) % 10) / 20,
  }));
  return (
    <svg className="absolute inset-0" viewBox="0 0 1440 640" preserveAspectRatio="xMidYMax slice"
      style={{ width:'100%', height:'100%', display:'block' }} aria-hidden="true">
      <defs>
        <linearGradient id="nsSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#08130C" />
          <stop offset="0.7" stopColor="#122B1E" />
          <stop offset="1" stopColor="#1B3D2F" />
        </linearGradient>
        <radialGradient id="nsGlow">
          <stop offset="0" stopColor="#DFC07A" stopOpacity="0.4" />
          <stop offset="1" stopColor="#DFC07A" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1440" height="640" fill="url(#nsSky)" />
      {stars.map((s, i) => (
        <circle key={i} className="star" cx={s.x} cy={s.y} r={s.r} fill="#F7F2E8" opacity={s.o} />
      ))}
      {/* crescent moon */}
      <circle cx="1120" cy="104" r="32" fill="#EDE5D0" opacity="0.85" />
      <circle cx="1134" cy="94" r="29" fill="#0A170F" />
      {/* mountains */}
      <path d="M0 420 L200 300 L360 396 L560 280 L760 388 L980 292 L1180 392 L1320 330 L1440 396 V640 H0 Z"
        fill="#0C1B12" />
      <path d="M0 520 Q360 488 720 512 T1440 508 V640 H0 Z" fill="#08130C" />
      {/* glowing yurt — someone is home */}
      <g transform="translate(720 520)">
        <circle cx="0" cy="-10" r="130" fill="url(#nsGlow)" />
        <path d="M-58 0 a58 36 0 0 1 116 0 z" fill="#101E15" stroke="#C9A052" strokeOpacity="0.4" />
        <path d="M-52 -14 h104" stroke="#C9A052" strokeWidth="1" opacity="0.3" />
        <rect x="-13" y="-27" width="26" height="27" rx="2" fill="#DFC07A" opacity="0.95" />
        <circle cx="0" cy="-38" r="3" fill="#C9A052" />
        {/* smoke */}
        <path d="M0 -44 q-6 -10 2 -18 q8 -8 2 -18" stroke="rgba(247,242,232,0.35)"
          strokeWidth="2" fill="none" strokeLinecap="round" strokeDasharray="1 7" />
      </g>
    </svg>
  );
}

// ── MENU LINE-ART ICONS — one per dish ───────────────────────
function MenuIcon({ k }: { k: string }) {
  const paths: Record<string, ReactNode> = {
    r1: <> {/* beshbarmak — bowl with noodles */}
      <path d="M5 16 a9 7 0 0 0 18 0 z" />
      <path d="M8 12 q2.5 -3 5 0 q2.5 3 5 0" />
    </>,
    r2: <> {/* trout */}
      <path d="M4 14 q6.5 -6.5 14 0 q-6.5 6.5 -14 0 z" />
      <path d="M18 14 l5.5 -4 v8 z" />
      <circle cx="8.5" cy="13" r="0.6" fill="currentColor" />
    </>,
    r3: <> {/* samsa — triangle with steam */}
      <path d="M14 8 L23.5 23 H4.5 Z" />
      <path d="M14 2 q1.5 1.5 0 3.5" />
    </>,
    r4: <> {/* shashlik — skewer */}
      <path d="M4.5 23.5 L23.5 4.5" />
      <path d="M8 17 l3 3 M12.5 12.5 l3 3 M17 8 l3 3" />
    </>,
    r5: <> {/* kese bowl of tea */}
      <path d="M6 14 a8 6.5 0 0 0 16 0 z" />
      <path d="M11 10 q1 -2 0 -4 M16 10 q1 -2 0 -4" />
      <path d="M9 22 h10" />
    </>,
    r6: <> {/* kookor — kymyz flask */}
      <path d="M14 4 c-5.5 3.5 -7.5 8.5 -6 13.5 a6.5 5 0 0 0 12 0 c1.5 -5 -0.5 -10 -6 -13.5 z" />
      <path d="M11.5 4.5 h5" />
    </>,
  };
  return (
    <svg width="26" height="26" viewBox="0 0 28 28" fill="none" stroke="currentColor"
      strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
      style={{ color:C.gold, flexShrink:0, alignSelf:'center', opacity:0.9 }}>
      {paths[k]}
    </svg>
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

// ── HERO LETTER (staggered headline reveal) ───────────────────
const letterVariants = {
  hidden: { opacity: 0, y: '0.55em', rotateX: 55 },
  show: {
    opacity: 1, y: 0, rotateX: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
  },
};

function Letter({ ch }: { ch: string }) {
  return (
    <motion.span variants={letterVariants}
      style={{ display:'inline-block', whiteSpace:'pre', transformOrigin:'bottom', willChange:'transform' }}>
      {ch}
    </motion.span>
  );
}

// ── MAGNETIC WRAPPER — button leans toward the cursor ────────
function Magnetic({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [o, setO] = useState({ x: 0, y: 0 });
  return (
    <motion.div ref={ref} style={{ display:'inline-block' }}
      onMouseMove={e => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        setO({ x: (e.clientX - r.left - r.width / 2) * 0.22,
               y: (e.clientY - r.top - r.height / 2) * 0.35 });
      }}
      onMouseLeave={() => setO({ x: 0, y: 0 })}
      animate={{ x: o.x, y: o.y }}
      transition={{ type:'spring', stiffness: 180, damping: 14, mass: 0.5 }}>
      {children}
    </motion.div>
  );
}

// ── 3D TILT CARD ──────────────────────────────────────────────
function TiltCard({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [rot, setRot] = useState({ rx: 0, ry: 0 });

  return (
    <motion.div ref={ref} className={className}
      onMouseMove={e => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        setRot({ rx: y * -7, ry: x * 7 });
      }}
      onMouseLeave={() => setRot({ rx: 0, ry: 0 })}
      animate={{ rotateX: rot.rx, rotateY: rot.ry }}
      whileHover={{ y: -6 }}
      transition={{ type:'spring', stiffness: 220, damping: 18, mass: 0.6 }}
      style={{ transformStyle:'preserve-3d' }}>
      {children}
    </motion.div>
  );
}

// ── LOADING INTRO — brand curtain that lifts to reveal the hero ──
function Intro({ onReveal }: { onReveal: () => void }) {
  const [gone, setGone] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) { onReveal(); setGone(true); return; }
    const t = setTimeout(onReveal, 1500); // hero starts animating as the curtain lifts
    return () => clearTimeout(t);
  }, [reduce]); // eslint-disable-line react-hooks/exhaustive-deps

  if (gone || reduce) return null;
  return (
    <motion.div
      initial={{ y: 0 }} animate={{ y: '-100%' }}
      transition={{ delay: 1.5, duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
      onAnimationComplete={() => setGone(true)}
      style={{ position:'fixed', inset:0, zIndex:300, background:C.deep,
        display:'flex', flexDirection:'column', alignItems:'center',
        justifyContent:'center', gap:'1.1rem' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
        <Tunduk size={64} />
      </motion.div>
      <motion.span
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.6 }}
        style={{ fontFamily:F.serif, fontSize:'1.5rem', fontWeight:500,
          color:C.cream, letterSpacing:'0.06em' }}>
        Chychkan
      </motion.span>
      <motion.span
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        style={{ fontFamily:F.sans, fontSize:'0.55rem', fontWeight:600,
          letterSpacing:'0.3em', textTransform:'uppercase', color:C.gold }}>
        Kyrgyzstan · 2200m
      </motion.span>
    </motion.div>
  );
}

// ── FAQ ITEM ──────────────────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom:'1px solid rgba(201,160,82,0.25)' }}>
      <button onClick={() => setOpen(o => !o)} aria-expanded={open}
        className="w-full flex items-center justify-between gap-4"
        style={{ padding:'1.2rem 0', background:'none', border:'none', cursor:'pointer',
          textAlign:'left' }}>
        <span style={{ fontFamily:F.serif, fontSize:'1.1rem', fontWeight:500, color:C.deep }}>
          {q}
        </span>
        <motion.span animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.25 }}
          style={{ color:C.gold, flexShrink:0, display:'flex' }}>
          <Plus size={17} />
        </motion.span>
      </button>
      <motion.div initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{ overflow:'hidden' }}>
        <p style={{ fontFamily:F.sans, fontSize:'0.8rem', fontWeight:300, color:C.muted,
          lineHeight:1.8, margin:0, paddingBottom:'1.2rem' }}>
          {a}
        </p>
      </motion.div>
    </div>
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
          {isVideo ? '▶' : `${idx + 1} / ${gallery.images.length}`}
          {!isVideo && <span style={{ marginLeft: 12 }}>← →</span>}
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

// ── WEBGL DEPTH HERO — the gorge shifts in 3D under the cursor ──
// three.js is loaded lazily so it never blocks first paint; on mobile,
// reduced-motion, or missing WebGL the static image simply stays.
function DepthHero() {
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    import('three').then(THREE => {
      if (disposed) return;
      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
      } catch {
        return; // no WebGL — fallback image remains
      }

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0, 1);
      const loader = new THREE.TextureLoader();
      const uniforms = {
        uImg:   { value: loader.load(asset('/gen/g-hero.webp')) },
        uDepth: { value: loader.load(asset('/gen/g-hero-depth.webp')) },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uTime:  { value: 0 },
        uCover: { value: new THREE.Vector4(1, 1, 0, 0) }, // scale.xy, offset.xy
      };

      const mat = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: `
          varying vec2 vUv;
          void main() { vUv = uv; gl_Position = vec4(position.xy * 2.0, 0.0, 1.0); }`,
        fragmentShader: `
          uniform sampler2D uImg, uDepth;
          uniform vec2 uMouse;
          uniform float uTime;
          uniform vec4 uCover;
          varying vec2 vUv;
          void main() {
            vec2 uv = vUv * uCover.xy + uCover.zw;
            float d = texture2D(uDepth, uv).r;
            vec2 sway = vec2(sin(uTime * 0.22), cos(uTime * 0.17)) * 0.006;
            vec2 off = (uMouse - 0.5) * vec2(0.045, 0.03) * d + sway * d;
            gl_FragColor = texture2D(uImg, uv + off);
          }`,
      });
      scene.add(new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat));

      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      el.appendChild(renderer.domElement);
      Object.assign(renderer.domElement.style, {
        position: 'absolute', inset: '0', width: '100%', height: '100%',
        opacity: '0', transition: 'opacity 1.2s ease',
      });
      uniforms.uImg.value.colorSpace = THREE.SRGBColorSpace;

      const IMG_AR = 16 / 9; // g-hero aspect
      const fit = () => {
        const w = el.offsetWidth, h = el.offsetHeight;
        renderer.setSize(w, h, false);
        const ar = w / h;
        // cover-fit uv transform (like background-size: cover)
        if (ar > IMG_AR) uniforms.uCover.value.set(1, IMG_AR / ar, 0, (1 - IMG_AR / ar) / 2);
        else             uniforms.uCover.value.set(ar / IMG_AR, 1, (1 - ar / IMG_AR) / 2, 0);
      };
      fit();
      window.addEventListener('resize', fit);

      const target = { x: 0.5, y: 0.5 };
      const onMouse = (e: MouseEvent) => {
        target.x = e.clientX / window.innerWidth;
        target.y = 1 - e.clientY / window.innerHeight;
      };
      window.addEventListener('mousemove', onMouse, { passive: true });

      let raf = 0;
      let shown = false;
      const tick = (t: number) => {
        uniforms.uTime.value = t / 1000;
        const m = uniforms.uMouse.value;
        m.x += (target.x - m.x) * 0.045;
        m.y += (target.y - m.y) * 0.045;
        renderer.render(scene, camera);
        if (!shown && uniforms.uImg.value.image && uniforms.uDepth.value.image) {
          renderer.domElement.style.opacity = '1';
          shown = true;
        }
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);

      cleanup = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener('resize', fit);
        window.removeEventListener('mousemove', onMouse);
        renderer.dispose();
        el.removeChild(renderer.domElement);
      };
    });

    return () => { disposed = true; cleanup?.(); };
  }, []);

  return <div ref={wrap} className="absolute inset-0" aria-hidden="true" />;
}

// ── ATMOSPHERE CANVAS — drifting mist or fireflies ───────────
function Atmosphere({ mode }: { mode: 'mist' | 'fireflies' }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;

    let w = (cv.width = cv.offsetWidth);
    let h = (cv.height = cv.offsetHeight);
    let raf = 0;
    let t = 0;

    const mist = mode === 'mist';
    const parts = Array.from({ length: mist ? 12 : 42 }, () => ({
      x: Math.random() * w,
      y: mist ? h * (0.35 + Math.random() * 0.6) : Math.random() * h,
      r: mist ? 90 + Math.random() * 170 : 0.8 + Math.random() * 1.7,
      s: mist ? 0.06 + Math.random() * 0.16 : 0.1 + Math.random() * 0.25,
      ph: Math.random() * Math.PI * 2,
      o: mist ? 0.04 + Math.random() * 0.08 : 0.3 + Math.random() * 0.5,
    }));

    const onResize = () => { w = cv.width = cv.offsetWidth; h = cv.height = cv.offsetHeight; };
    window.addEventListener('resize', onResize);

    const tick = () => {
      t += 0.008;
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        p.x += p.s;
        if (p.x - p.r > w) p.x = -p.r;
        if (mist) {
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
          g.addColorStop(0, `rgba(247,242,232,${p.o})`);
          g.addColorStop(1, 'rgba(247,242,232,0)');
          ctx.fillStyle = g;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
        } else {
          const y = p.y + Math.sin(t * 2 + p.ph) * 14;
          const glow = p.o * (0.45 + 0.55 * Math.sin(t * 3 + p.ph * 2) ** 2);
          ctx.fillStyle = `rgba(223,192,122,${glow})`;
          ctx.beginPath(); ctx.arc(p.x, y, p.r, 0, Math.PI * 2); ctx.fill();
        }
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); };
  }, [mode]);

  return <canvas ref={ref} className="absolute inset-0"
    style={{ width:'100%', height:'100%', pointerEvents:'none' }} aria-hidden="true" />;
}

// ── ROOM DETAIL SHEET ─────────────────────────────────────────
function RoomSheet({ room, tr, onClose, onGallery }: {
  room: (typeof ROOMS)[number]; tr: Record<string, string>;
  onClose: () => void; onGallery: () => void;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', handler); document.body.style.overflow = ''; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <motion.div className="fixed inset-0 z-[500] flex items-end sm:items-center justify-center"
      style={{ background:'rgba(10,18,12,0.9)', backdropFilter:'blur(6px)' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onClose}>
      <motion.div onClick={e => e.stopPropagation()}
        initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ type:'spring', stiffness: 160, damping: 22 }}
        style={{ background:C.white, width:'100%', maxWidth:520, maxHeight:'92vh',
          overflowY:'auto', position:'relative' }}>

        <button onClick={onClose} aria-label="Close"
          style={{ position:'absolute', top:10, right:10, zIndex:2, width:36, height:36,
            display:'flex', alignItems:'center', justifyContent:'center',
            background:'rgba(15,35,24,0.65)', color:C.cream, border:'none',
            cursor:'pointer', backdropFilter:'blur(4px)' }}>
          <X size={18} />
        </button>

        <div style={{ position:'relative' }}>
          <img src={asset(room.img)} alt={tr[room.key]}
            style={{ width:'100%', aspectRatio:'16/10', objectFit:'cover', display:'block' }} />
          {room.gallery && (
            <button onClick={onGallery}
              style={{ position:'absolute', bottom:12, right:12, display:'flex',
                alignItems:'center', gap:6, background:'rgba(15,35,24,0.8)', color:C.cream,
                border:'none', cursor:'pointer', padding:'0.45rem 0.8rem',
                fontFamily:F.sans, fontSize:'0.6rem', fontWeight:600,
                letterSpacing:'0.12em', textTransform:'uppercase', backdropFilter:'blur(4px)' }}>
              <Play size={11} fill="currentColor" />
              {room.gallery.images.length + 1}
            </button>
          )}
        </div>

        <div style={{ padding:'1.5rem 1.6rem 1.75rem' }}>
          <span style={{ fontFamily:F.sans, fontSize:'0.55rem', fontWeight:700,
            letterSpacing:'0.15em', textTransform:'uppercase', color:C.gold }}>
            {tr[`t_${room.tier}`] ?? room.tier}
          </span>
          <h3 style={{ fontFamily:F.serif, fontSize:'1.8rem', fontWeight:500,
            color:C.deep, margin:'0.25rem 0 1rem', lineHeight:1.1 }}>
            {tr[room.key]}
          </h3>

          <div className="flex items-center gap-2 mb-3"
            style={{ fontFamily:F.sans, fontSize:'0.75rem', color:C.muted }}>
            <Users size={14} style={{ color:C.gold }} />
            {tr[`cap_${room.key}`]}
          </div>

          <ul style={{ listStyle:'none', margin:'0 0 1.25rem', padding:0,
            display:'grid', gap:'0.45rem' }}>
            {[...room.amen, 'bb', 'a8'].map(k => (
              <li key={k} className="flex items-center gap-2"
                style={{ fontFamily:F.sans, fontSize:'0.78rem', fontWeight:300, color:C.muted }}>
                <Check size={13} style={{ color:C.mid, flexShrink:0 }} />
                {tr[k]}
              </li>
            ))}
          </ul>

          {room.singleUsd && (
            <p style={{ fontFamily:F.sans, fontSize:'0.68rem', fontStyle:'italic',
              color:C.muted, marginBottom:'1rem' }}>
              {tr.double_single}
            </p>
          )}

          <div style={{ borderTop:`1px solid ${C.creamD}`, paddingTop:'1.1rem',
            display:'flex', alignItems:'center', justifyContent:'space-between', gap:'1rem' }}>
            <div>
              <span style={{ fontFamily:F.serif, fontSize:'1.7rem', fontWeight:600,
                color:C.forest, lineHeight:1 }}>
                {room.usd}
                <small style={{ fontFamily:F.sans, fontSize:'0.6rem', fontWeight:300,
                  color:C.muted, marginLeft:3 }}>{tr.per_night}</small>
              </span>
              <span style={{ display:'block', fontFamily:F.sans, fontSize:'0.65rem',
                color:C.muted, marginTop:2 }}>{room.kgs} KGS · {tr.bb}</span>
            </div>
            <a href={WA} target="_blank" rel="noopener noreferrer"
              style={{ fontFamily:F.sans, background:C.gold, color:C.deep, fontSize:'0.6rem',
                fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase',
                padding:'0.85rem 1.3rem', textDecoration:'none', whiteSpace:'nowrap' }}>
              {tr.rd_book_room}
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── MAIN ──────────────────────────────────────────────────────
export default function Page() {
  const [lang, setLang]           = useState<Lang>('ky');
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [lightbox, setLightbox]   = useState<{ gallery: GalleryData; name: string } | null>(null);
  const [introDone, setIntroDone] = useState(false);
  const [activeSec, setActiveSec] = useState('');
  const [hoverDish, setHoverDish] = useState<string | null>(null);
  const [dishPos, setDishPos]     = useState({ x: 0, y: 0 });
  const [roomSheet, setRoomSheet] = useState<string | null>(null);
  const sheetRoom = roomSheet ? ROOMS.find(r => r.key === roomSheet) : undefined;
  const river = useRiverSound();
  const wx = useGorgeWeather();
  const tr = T[lang];

  // keep the document language, title, and description in sync
  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = T[lang].meta_t;
    document.querySelector('meta[name="description"]')?.setAttribute('content', T[lang].meta_d);
  }, [lang]);

  // highlight the nav link for the section in view
  useEffect(() => {
    const ids = ['about', 'rooms', 'restaurant', 'activities', 'location'];
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActiveSec(`#${e.target.id}`); }),
      { rootMargin: '-40% 0px -55% 0px' }
    );
    ids.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  const reduceMotion = useReducedMotion();
  const { scrollY, scrollYProgress } = useScroll();
  // hero background drifts down at quarter speed as you scroll past it
  const heroY = useTransform(scrollY, [0, 1000], [0, reduceMotion ? 0 : 250]);

  // Lenis inertia scrolling — the whole site glides instead of jumping
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({ autoRaf: true, anchors: true });
    return () => lenis.destroy();
  }, []);

  // navbar scroll state
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
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
    { href:'#restaurant',label: tr.nav_rest  },
    { href:'#activities',label: tr.nav_act   },
    { href:'#location',  label: tr.nav_loc   },
  ];

  return (
    <>
      {/* Loading intro curtain */}
      <Intro onReveal={() => setIntroDone(true)} />

      {/* Scroll progress */}
      <motion.div aria-hidden="true"
        style={{ position:'fixed', top:0, left:0, right:0, height:2, zIndex:60,
          background:`linear-gradient(to right, ${C.gold}, ${C.goldL})`,
          scaleX: scrollYProgress, transformOrigin:'left' }} />

      {/* Floating WhatsApp — appears once the hero is scrolled past */}
      <motion.a href={WA} target="_blank" rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        initial={false}
        animate={{ opacity: scrolled ? 1 : 0, scale: scrolled ? 1 : 0.4 }}
        transition={{ type:'spring', stiffness: 260, damping: 20 }}
        style={{ position:'fixed', bottom:'1.4rem', right:'1.4rem', zIndex:45,
          width:56, height:56, borderRadius:'50%', background:'#25D366',
          display:'flex', alignItems:'center', justifyContent:'center',
          boxShadow:'0 8px 28px rgba(0,0,0,0.35)',
          pointerEvents: scrolled ? 'auto' : 'none' }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </motion.a>

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
            {navLinks.map(l => {
              const isActive = activeSec === l.href;
              return (
                <a key={l.href} href={l.href}
                  style={{ fontFamily:F.sans, fontSize:'0.65rem', fontWeight:500,
                    letterSpacing:'0.14em', textTransform:'uppercase',
                    color: isActive ? C.goldL : 'rgba(247,242,232,0.75)',
                    borderBottom: isActive ? `1px solid ${C.gold}` : '1px solid transparent',
                    paddingBottom: 2, textDecoration:'none', transition:'color 0.2s, border-color 0.2s' }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = C.cream; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = 'rgba(247,242,232,0.75)'; }}
                >{l.label}</a>
              );
            })}
          </nav>

          {/* Right: sound + lang + book */}
          <div className="hidden md:flex items-center gap-4">
            <button onClick={river.toggle} aria-label={tr.snd} aria-pressed={river.on}
              title={tr.snd}
              style={{ background:'none', border:'none', cursor:'pointer', padding:10,
                minWidth:40, minHeight:40, alignItems:'center', justifyContent:'center',
                color: river.on ? C.goldL : 'rgba(247,242,232,0.45)', transition:'color 0.2s',
                display:'flex' }}>
              {river.on ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>
            <div className="flex overflow-hidden" style={{ border:`1px solid rgba(201,160,82,0.3)` }}>
              {(['ky','ru','en'] as Lang[]).map(l => (
                <button key={l} onClick={() => setLang(l)}
                  aria-pressed={lang === l}
                  style={{ fontFamily:F.sans, fontSize:'0.58rem', fontWeight:700,
                    letterSpacing:'0.1em', padding:'0.55rem 0.7rem', border:'none', cursor:'pointer',
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

      {sheetRoom && (
        <RoomSheet room={sheetRoom} tr={tr}
          onClose={() => setRoomSheet(null)}
          onGallery={() => {
            if (sheetRoom.gallery) {
              setLightbox({ gallery: sheetRoom.gallery, name: tr[sheetRoom.key] });
              setRoomSheet(null);
            }
          }} />
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
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden"
        aria-label="Hero section">

        {/* Background — scroll-parallaxed. Static Ken Burns photo as base;
            on desktop a WebGL depth-parallax layer fades in over it and the
            gorge shifts in 3D under the cursor. */}
        <motion.div className="absolute inset-0" style={{ y: heroY, willChange:'transform' }}>
          <div style={{ position:'absolute', left:0, right:0, top:'-20%', height:'125%' }}>
            <div className="hero-bg"
              style={{ position:'absolute', inset:0,
                backgroundImage:`url('${asset('/gen/g-hero.webp')}')`,
                backgroundSize:'cover', backgroundPosition:'center' }} />
            <DepthHero />
          </div>
        </motion.div>

        {/* Gradient overlay */}
        <div className="absolute inset-0"
          style={{ background:'linear-gradient(to bottom, rgba(10,20,12,0.55) 0%, rgba(10,20,12,0.28) 45%, rgba(10,20,12,0.85) 100%)' }} />

        {/* Living mist */}
        <Atmosphere mode="mist" />

        {/* Gold inset frame */}
        <motion.div aria-hidden="true" className="absolute z-10 pointer-events-none hidden md:block"
          initial={{ opacity: 0 }} animate={{ opacity: introDone ? 1 : 0 }}
          transition={{ duration: 1.6, delay: 0.6 }}
          style={{ inset:'1.4rem', border:'1px solid rgba(201,160,82,0.35)' }} />

        {/* Content — centered ceremony */}
        <div className="relative z-10 px-6 flex flex-col items-center text-center max-w-5xl mx-auto"
          style={{ perspective: 900 }}>

          {/* Tunduk crest spins in */}
          <motion.div
            initial={{ opacity: 0, rotate: -120, scale: 0.4 }}
            animate={introDone ? { opacity: 1, rotate: 0, scale: 1 } : {}}
            transition={{ type:'spring', stiffness: 55, damping: 13, delay: 0.1 }}>
            <Tunduk size={54} />
          </motion.div>

          {/* Season badge */}
          <motion.div className="flex items-center gap-2 mt-6 mb-8"
            initial={{ opacity: 0, y: 14 }} animate={introDone ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}>
            <span className="w-1.5 h-1.5 rounded-full"
              style={{ background:C.gold, boxShadow:`0 0 6px ${C.gold}`, flexShrink:0,
                animation:'pulse 2s ease-in-out infinite' }} />
            <span style={{ fontFamily:F.sans, fontSize:'0.6rem', fontWeight:600,
              letterSpacing:'0.25em', textTransform:'uppercase', color:C.goldL }}>
              {tr.season} · {new Date().getFullYear()}
            </span>
            {wx && (
              <span className="flex items-center gap-1.5"
                style={{ fontFamily:F.sans, fontSize:'0.6rem', fontWeight:600,
                  letterSpacing:'0.2em', color:'rgba(247,242,232,0.75)',
                  borderLeft:'1px solid rgba(201,160,82,0.4)', paddingLeft:'0.7rem', marginLeft:'0.2rem' }}>
                <WxIcon code={wx.code} />
                {wx.t}°C
              </span>
            )}
          </motion.div>

          {/* Headline — letters rise one by one; replays on language switch */}
          <motion.h1 key={lang} initial="hidden" animate={introDone ? 'show' : 'hidden'}
            variants={{ hidden:{}, show:{ transition:{ staggerChildren:0.045, delayChildren:0.3 } } }}
            style={{ fontFamily:F.serif, lineHeight:0.98, letterSpacing:'-0.03em',
              color:C.cream, margin:'0 0 1.75rem' }}>
            <span style={{ display:'block', fontSize:'clamp(3.6rem,11vw,9.5rem)', fontWeight:500 }}>
              {tr.h1.split('').map((ch, i) => <Letter key={i} ch={ch} />)}
            </span>
            <em style={{ display:'block', fontSize:'clamp(3rem,9vw,7.5rem)', fontWeight:400,
              fontStyle:'italic', color:C.goldL }}>
              {tr.h2.split('').map((ch, i) => <Letter key={i} ch={ch} />)}
            </em>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 14 }} animate={introDone ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.0 }}
            style={{ fontFamily:F.sans, fontSize:'0.7rem', fontWeight:300,
              letterSpacing:'0.14em', textTransform:'uppercase',
              color:'rgba(247,242,232,0.65)', marginBottom:'2.25rem', display:'flex',
              alignItems:'center', gap:'0.9rem' }}>
            <span style={{ width:32, height:1, background:C.gold, display:'block', flexShrink:0 }} />
            {tr.tagline}
            <span style={{ width:32, height:1, background:C.gold, display:'block', flexShrink:0 }} />
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 14 }} animate={introDone ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.2 }}>
            <Magnetic>
            <a href={WA} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-3 group"
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
            </Magnetic>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-2"
          aria-hidden="true"
          initial={{ opacity: 0 }} animate={introDone ? { opacity: 1 } : {}}
          transition={{ delay: 1.7, duration: 1 }}>
          <span style={{ fontFamily:F.sans, fontSize:'0.5rem', letterSpacing:'0.25em',
            color:'rgba(247,242,232,0.4)', textTransform:'uppercase' }}>
            scroll
          </span>
          <span style={{ width:1, height:40,
            background:`linear-gradient(to bottom, ${C.gold}, transparent)` }} />
        </motion.div>
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
              <strong style={{ fontFamily:F.serif, fontSize:'2rem', color:C.gold, lineHeight:1, fontWeight:600 }}>
                {new Date().getFullYear() - 2012}+
              </strong>
              <span style={{ fontFamily:F.sans, fontSize:'0.5rem', letterSpacing:'0.15em',
                textTransform:'uppercase', color:C.creamD, marginTop:2 }}>{tr.seasons_l}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          ILLUSTRATED PANORAMA
      ════════════════════════════════════════ */}
      <Panorama />

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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            style={{ perspective: 1200 }}>
            {ROOMS.map((room, i) => (
              <TiltCard key={room.key} className={`reveal reveal-delay-${i+1}`}>
              <article
                style={{ background:C.white, overflow:'hidden',
                  boxShadow:'0 2px 16px rgba(0,0,0,0.08)' }}
              >
                {/* Image — opens the room detail sheet */}
                <div
                  style={{ position:'relative', background:C.creamD, overflow:'hidden',
                    cursor:'pointer' }}
                  onClick={() => setRoomSheet(room.key)}
                  role="button"
                  aria-label={`${tr.rd_details}: ${tr[room.key]}`}
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
                  {/* Editorial index */}
                  <span aria-hidden="true" style={{ position:'absolute', top:6, right:12, zIndex:1,
                    fontFamily:F.serif, fontStyle:'italic', fontSize:'1.6rem', fontWeight:600,
                    color:C.cream, opacity:0.85, textShadow:'0 2px 10px rgba(0,0,0,0.45)' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {/* Gallery badge */}
                  {room.gallery && (
                    <div style={{ position:'absolute', bottom:10, right:10, zIndex:1,
                      background:'rgba(15,35,24,0.75)', color:C.cream, backdropFilter:'blur(4px)',
                      padding:'0.25rem 0.6rem', display:'flex', alignItems:'center', gap:4,
                      fontFamily:F.sans, fontSize:'0.55rem', letterSpacing:'0.1em' }}>
                      <Play size={10} fill="currentColor" />
                      {room.gallery.images.length + 1}
                    </div>
                  )}
                  <img src={asset(room.img)} alt={tr[room.key]}
                    style={{ width:'100%', aspectRatio:'4/3', objectFit:'cover',
                      display:'block', transition:'transform 0.6s' }}
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
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          RESTAURANT — menu card
      ════════════════════════════════════════ */}
      <section id="restaurant" style={{ background:C.deep, padding:'6.5rem 1.5rem',
        position:'relative', overflow:'hidden' }}>
        {/* faint valley photo behind the menu */}
        <div aria-hidden="true" style={{ position:'absolute', inset:0,
          backgroundImage:`url('${asset('/gen/g-jailoo.webp')}')`,
          backgroundSize:'cover', backgroundPosition:'center', opacity:0.07 }} />

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <div className="flex justify-center mb-6" aria-hidden="true">
            <HornOrnament width={58} />
          </div>
          <SectionLabel text={tr.rest_label} center />
          <h2 className="reveal" style={{ fontFamily:F.serif, fontSize:'clamp(2.4rem,5vw,4rem)',
            fontWeight:500, letterSpacing:'-0.02em', color:C.cream, marginBottom:'0.6rem' }}>
            {tr.rest_title}
          </h2>
          <p className="reveal reveal-delay-1" style={{ fontFamily:F.serif, fontStyle:'italic',
            fontSize:'1.05rem', color:'rgba(223,192,122,0.85)', marginBottom:'3rem' }}>
            {tr.rest_sub}
          </p>

          {/* menu list with dotted leaders — hover a dish to see its photo */}
          <div className="text-left relative"
            onMouseMove={e => {
              const r = e.currentTarget.getBoundingClientRect();
              setDishPos({ x: e.clientX - r.left, y: e.clientY - r.top });
            }}
            onMouseLeave={() => setHoverDish(null)}>
            {(['r1','r2','r3','r4','r5','r6'] as const).map((k, i) => (
              <div key={k} className={`reveal reveal-delay-${(i % 3) + 1} flex items-baseline gap-4`}
                onMouseEnter={() => setHoverDish(k)}
                style={{ padding:'1.1rem 0',
                  borderBottom: i < 5 ? '1px solid rgba(201,160,82,0.15)' : 'none' }}>
                <MenuIcon k={k} />
                <span style={{ fontFamily:F.serif, fontSize:'1.2rem', fontWeight:500,
                  color:C.cream, whiteSpace:'nowrap' }}>{tr[k]}</span>
                <span aria-hidden="true" style={{ flex:1, minWidth:24,
                  borderBottom:'1px dotted rgba(201,160,82,0.4)',
                  transform:'translateY(-5px)' }} />
                <span style={{ fontFamily:F.sans, fontSize:'0.72rem', fontWeight:300,
                  color:'rgba(237,229,208,0.6)', textAlign:'right' }}>{tr[`${k}d`]}</span>
              </div>
            ))}

            {/* floating dish photo (desktop only, decorative) */}
            <motion.img
              className="hidden md:block"
              src={hoverDish ? asset(`/gen/g-dish-${
                ({ r1:'beshbarmak', r2:'trout', r3:'samsa', r4:'shashlik', r5:'boorsok', r6:'kymyz' })[hoverDish]
              }.webp`) : undefined}
              alt=""
              aria-hidden="true"
              initial={false}
              animate={{ opacity: hoverDish ? 1 : 0, scale: hoverDish ? 1 : 0.85,
                x: dishPos.x + 30, y: dishPos.y - 190 }}
              transition={{ opacity:{ duration:0.2 }, scale:{ duration:0.25 },
                x:{ type:'spring', stiffness:150, damping:20 },
                y:{ type:'spring', stiffness:150, damping:20 } }}
              style={{ position:'absolute', top:0, left:0, width:190, height:190,
                objectFit:'cover', pointerEvents:'none', zIndex:20,
                border:`1px solid rgba(201,160,82,0.5)`,
                boxShadow:'0 20px 50px rgba(0,0,0,0.5)' }}
            />
          </div>

          <p className="reveal" style={{ fontFamily:F.sans, fontSize:'0.6rem', fontWeight:500,
            letterSpacing:'0.2em', textTransform:'uppercase', color:'rgba(201,160,82,0.6)',
            marginTop:'2.5rem' }}>
            — {tr.rest_note} —
          </p>
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
            {ACTS.map(({ icon: Icon, tk, dk, img }, i) => (
              <div key={tk} className={`act-tile reveal reveal-delay-${(i % 4) + 1}`}
                style={{ background:C.white, padding:'2rem 1.75rem',
                  transition:'background 0.3s, transform 0.3s', position:'relative',
                  overflow:'hidden',
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
                {img && (
                  <img src={asset(img)} alt="" aria-hidden="true" loading="lazy" className="act-img"
                    style={{ position:'absolute', inset:0, width:'100%', height:'100%',
                      objectFit:'cover' }} />
                )}
                <div className="flex items-start justify-between" style={{ position:'relative', zIndex:1 }}>
                  <Icon size={22} className="act-icon" style={{ color:C.gold, transition:'color 0.3s' }} />
                  <span aria-hidden="true" style={{ fontFamily:F.serif, fontStyle:'italic',
                    fontSize:'0.85rem', fontWeight:600, color:C.red, opacity:0.45 }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <div style={{ position:'relative', zIndex:1 }}>
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
          GALLERY BAND
      ════════════════════════════════════════ */}
      <section aria-label={tr.gal_title}
        style={{ background:C.deep, padding:'5rem 0 5.5rem', overflow:'hidden',
          borderTop:`1px solid rgba(201,160,82,0.15)` }}>
        <div className="max-w-6xl mx-auto px-6 mb-10">
          <SectionLabel text={tr.gal_label} />
          <h2 className="reveal" style={{ fontFamily:F.serif, fontSize:'clamp(2rem,4vw,3.2rem)',
            fontWeight:500, letterSpacing:'-0.02em', color:C.cream }}>
            {tr.gal_title}
          </h2>
        </div>
        {/* endless drifting film strip — pauses on hover */}
        <div className="gallery-track" style={{ display:'flex', gap:'1rem', width:'max-content' }}>
          {(() => {
            const shots = [
              '/summer1.webp', '/gen/g-river.webp', '/gen/g-jailoo.webp',
              '/summer2.webp', '/gen/g-forest.webp', '/gen/g-hero.webp',
              '/gen/xl-room-yurt.webp', '/summer3.webp', '/gen/g-night.webp',
              '/summer4.webp', '/gen/g-berries.webp',
            ];
            return [...shots, ...shots].map((src, i) => (
              <img key={i} src={asset(src)} alt="" loading="lazy"
                style={{ height:'clamp(220px,30vw,340px)', width:'auto', display:'block',
                  flexShrink:0 }} />
            ));
          })()}
        </div>
      </section>

      {/* ════════════════════════════════════════
          LOCATION
      ════════════════════════════════════════ */}
      <section id="location" style={{ background:C.creamD, padding:'6rem 1.5rem' }}>
        {/* Journey strip — full width above the details grid */}
        <div className="max-w-6xl mx-auto">
          <Journey caption={tr.d4b} />
        </div>
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
          FAQ
      ════════════════════════════════════════ */}
      <section id="faq" style={{ background:C.white, padding:'6rem 1.5rem' }}>
        <div className="max-w-2xl mx-auto">
          <SectionLabel text={tr.faq_label} />
          <h2 className="reveal" style={{ fontFamily:F.serif, fontSize:'clamp(2.2rem,4vw,3.4rem)',
            fontWeight:500, letterSpacing:'-0.02em', color:C.deep, marginBottom:'2rem' }}>
            {tr.faq_title}
          </h2>
          <div className="reveal reveal-delay-1">
            {([1,2,3,4,5,6] as const).map(i => (
              <FaqItem key={`${lang}-${i}`} q={tr[`f${i}`]} a={tr[`f${i}a`]} />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          CTA
      ════════════════════════════════════════ */}
      <section style={{ position:'relative', padding:'8rem 1.5rem',
        textAlign:'center', overflow:'hidden', background:C.deep }}>
        <NightScene />
        <Atmosphere mode="fireflies" />

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
            <Magnetic>
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
            </Magnetic>
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
          <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Footer navigation"
            style={{ whiteSpace:'nowrap' }}>
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
            © {new Date().getFullYear()} {tr.foot_copy}
          </p>
        </div>
      </footer>
    </>
  );
}
