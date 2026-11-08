import { DialogueLine } from "./gameTypes";

export const DIALOGUES: Record<string, DialogueLine> = {
  // INTRO DIALOGUE (When game starts)
  intro_1: {
    id: "intro_1",
    speaker: "jihan",
    speakerName: "Jihan • Sulawesi",
    portrait: "/jihan-portrait.png",
    text: "Alhamdulillah... Senja di anjungan Pantai Losari selalu menenangkan hati. Angin selat Makassar membawa aroma laut yang begitu khas.",
    emotion: "warm",
    nextId: "intro_2",
  },
  intro_2: {
    id: "intro_2",
    speaker: "dani",
    speakerName: "Dani • Malaysia",
    portrait: "/dani-portrait.png",
    text: "Betul tu, Jihan! Cantik sungguh panorama matahari terbenam kat sini. Jauh beza dengan hiruk-pikuk Kuala Lumpur. Rasa macam dalam lukisan!",
    emotion: "happy",
    nextId: "intro_3",
  },
  intro_3: {
    id: "intro_3",
    speaker: "jihan",
    speakerName: "Jihan • Sulawesi",
    portrait: "/jihan-portrait.png",
    text: "Yuk, kita telusuri dermaga kayu ini. Di sana ada kucing ramah Si Oyen, gerobak Pisang Epe bakar, dan Warkop Daeng Rauf yang legendaris!",
    emotion: "happy",
  },

  // CAT INTERACTION
  cat_1: {
    id: "cat_1",
    speaker: "jihan",
    speakerName: "Jihan • Sulawesi",
    portrait: "/jihan-portrait.png",
    text: "Wah, lihat Dani! Ada Si Oyen lagi tidur melingkar di atas papan dermaga. Gemas sekali!",
    emotion: "warm",
    nextId: "cat_2",
  },
  cat_2: {
    id: "cat_2",
    speaker: "kucing_oyen",
    speakerName: "Si Oyen • Kucing Dermaga",
    portrait: "/jihan-portrait.png",
    text: "Purrr... Nyaaa~ (Si Oyen membuka mata perlahan, menguap lebar, lalu menyandarkan kepalanya ke tanganmu dengan manja)",
    emotion: "happy",
    nextId: "cat_3",
  },
  cat_3: {
    id: "cat_3",
    speaker: "dani",
    speakerName: "Dani • Malaysia",
    portrait: "/dani-portrait.png",
    text: "Comelnya! Bulu tiga warna dia berkilat di bawah cahaya senja. Saya nak lukis Oyen dalam buku jurnal kembara saya nanti!",
    emotion: "happy",
  },

  // PISANG EPE & SARABA INTERACTION
  pisang_1: {
    id: "pisang_1",
    speaker: "jihan",
    speakerName: "Jihan • Sulawesi",
    portrait: "/jihan-portrait.png",
    text: "Nah Dani, ini dia kuliner wajib tepi Pantai Losari: Pisang Epe bakar saus gula merah durian dan secangkir Saraba jahe hangat!",
    emotion: "warm",
    nextId: "pisang_2",
  },
  pisang_2: {
    id: "pisang_2",
    speaker: "dani",
    speakerName: "Dani • Malaysia",
    portrait: "/dani-portrait.png",
    text: "Mmm! Harumnya bau pisang bakar berkaramel ni! Rasa dia manis legit, bila hirup Saraba terus rasa hangat satu badan. Sedap betul!",
    emotion: "happy",
    nextId: "pisang_3",
  },
  pisang_3: {
    id: "pisang_3",
    speaker: "jihan",
    speakerName: "Jihan • Sulawesi",
    portrait: "/jihan-portrait.png",
    text: "Kalau di Malaysia mirip jajanan apa biasanya, Dani?",
    emotion: "thoughtful",
    choices: [
      { text: "Mirip Pisang Goreng Madu & Teh Tarik Kaw!", nextId: "pisang_choice_a" },
      { text: "Lebih istimewa Pisang Epe ni, kuah dia unik sangat!", nextId: "pisang_choice_b" },
    ],
  },
  pisang_choice_a: {
    id: "pisang_choice_a",
    speaker: "dani",
    speakerName: "Dani • Malaysia",
    portrait: "/dani-portrait.png",
    text: "Ha'ah! Konsep pisang manis dengan minuman berempah, dua-dua negeri serumpun ada sentuhan rasa yang saling melengkapi!",
    emotion: "happy",
  },
  pisang_choice_b: {
    id: "pisang_choice_b",
    speaker: "dani",
    speakerName: "Dani • Malaysia",
    portrait: "/dani-portrait.png",
    text: "Betul! Tekstur pisang bakar yang dipenyet leper ni memang lain dari yang lain. Nanti bila Jihan ke Malaysia, saya belanja Karipap Bonda pula ya!",
    emotion: "happy",
  },

  // WARKOP LOSARI INTERACTION
  warkop_1: {
    id: "warkop_1",
    speaker: "daeng_rauf",
    speakerName: "Daeng Rauf • Pemilik Warkop",
    portrait: "/jihan-portrait.png",
    text: "Tabe' Jihan! Wah, bawa kawan jauh rupanya ya? Selamat datang ke Makassar, Nak!",
    emotion: "warm",
    nextId: "warkop_2",
  },
  warkop_2: {
    id: "warkop_2",
    speaker: "dani",
    speakerName: "Dani • Malaysia",
    portrait: "/dani-portrait.png",
    text: "Terima kasih, Daeng! Mesranya orang-orang kat sini. Kedai kayu atas air ni tenang sangat, dengar desiran ombak.",
    emotion: "happy",
    nextId: "warkop_3",
  },
  warkop_3: {
    id: "warkop_3",
    speaker: "daeng_rauf",
    speakerName: "Daeng Rauf • Pemilik Warkop",
    portrait: "/jihan-portrait.png",
    text: "Kopi Toraja panas sudah siap. Nikmatilah senja, anak muda. Pelaut Bugis zaman dulu mengarungi samudra sampai ke semenanjung dengan doa dan ketabahan.",
    emotion: "thoughtful",
  },

  // BENCH SUNSET INTERACTION
  bench_1: {
    id: "bench_1",
    speaker: "jihan",
    speakerName: "Jihan • Sulawesi",
    portrait: "/jihan-portrait.png",
    text: "Duduk di bangku kayu ini sambil menatap cakrawala... Dani, terima kasih sudah sudi datang menjelajah ke Sulawesi.",
    emotion: "warm",
    nextId: "bench_2",
  },
  bench_2: {
    id: "bench_2",
    speaker: "dani",
    speakerName: "Dani • Malaysia",
    portrait: "/dani-portrait.png",
    text: "Sama-sama, Jihan! Persahabatan kita bukti walau terpisah laut yang luas, cerita dan hati kita tetap satu rentak. Kembara kita baru sahaja bermula!",
    emotion: "happy",
  },

  // PIER WEST EDGE
  pier_1: {
    id: "pier_1",
    speaker: "dani",
    speakerName: "Dani • Malaysia",
    portrait: "/dani-portrait.png",
    text: "Hujung dermaga kayu ni menghadap Selat Makassar. Angin laut dia meniup lembut... terasa lapang dada.",
    emotion: "thoughtful",
    nextId: "pier_2",
  },
  pier_2: {
    id: "pier_2",
    speaker: "jihan",
    speakerName: "Jihan • Sulawesi",
    portrait: "/jihan-portrait.png",
    text: "Di sanalah tempat perahu Pinisi berlayar menembus ombak. Ayo kita jaga setiap kenangan manis perjalanan kita ini!",
    emotion: "happy",
  },

  // PANCI MISTERIUS & MONSTER SUMMON
  panci_1: {
    id: "panci_1",
    speaker: "narator",
    speakerName: "Misteri Pesisir Losari",
    portrait: "/jihan-portrait.png",
    text: "Panci besi hitam kuno bergetar dahsyat di atas batu karang! Asap ungu magis menyembur dari sela-sela tutupnya...",
    emotion: "thoughtful",
    nextId: "panci_2",
  },
  panci_2: {
    id: "panci_2",
    speaker: "jihan",
    speakerName: "Jihan • Sulawesi",
    portrait: "/jihan-portrait.png",
    text: "Awas Dani! Hawa dingin dan aura siluman purba merayap keluar dari kuali ini! Siapkan bilah katanamu!",
    emotion: "surprised",
  },
  panci_defeat: {
    id: "panci_defeat",
    speaker: "dani",
    speakerName: "Dani • Malaysia",
    portrait: "/dani-portrait.png",
    text: "Alhamdulillah! Batara Siluman Panci Purba berjaya ditumpaskan berkat paduan tebasan Katana kita berdua! Tengok di sebelah sana, tiba-tiba muncul sebuah pusaran portal dimensi misterius!",
    emotion: "happy",
    nextId: "panci_defeat_2",
  },
  panci_defeat_2: {
    id: "panci_defeat_2",
    speaker: "jihan",
    speakerName: "Jihan • Makassar",
    portrait: "/jihan_portrait.png",
    text: "Subhanallah! Portal itu memancarkan sinyal radio ke Perkampungan Menara Sinyal! Mari kita dekati dan melangkah masuk ke dalam portal untuk menyiasat siapa yang mengendalikan jaringan kabel menara di sana!",
    emotion: "thoughtful",
  },

  // ADIF & HAIRI ENCOUNTER & BATTLE
  adif_tower_1: {
    id: "adif_tower_1",
    speaker: "narator",
    speakerName: "Menara Transmisi Perkampungan",
    portrait: "/adif_portrait.png",
    text: "Di atas salah satu tower sinyal perkampungan yang saling terhubung kabel membentang di langit, tampak seorang pemuda bertopi koboi cokelat sedang asyik bertengger memeriksa sambungan kabel dengan tali laso...",
    emotion: "thoughtful",
    nextId: "adif_tower_2",
  },
  adif_tower_2: {
    id: "adif_tower_2",
    speaker: "adif",
    speakerName: "Adif • Sang Koboi Menara",
    portrait: "/adif_portrait.png",
    text: "Yee-haw! Halo kawan-kawan pengembara! Selamat datang di Perkampungan Menara Sinyal! Tunggu sebentar, saya kaitkan tali koboi ini dulu terus meluncur turun dari tower!",
    emotion: "happy",
    nextId: "adif_tower_3",
  },
  adif_tower_3: {
    id: "adif_tower_3",
    speaker: "adif",
    speakerName: "Adif • Sang Koboi Menara",
    portrait: "/adif_portrait.png",
    text: "Hup! Mendarat dengan mulus! Kenalkan, saya Adif sang penjaga jaringan menara sinyal perkampungan. Tapi eh, siapa itu kawan saya si Hairi yang jalan sambil marah-marah mukanya merah padam?",
    emotion: "surprised",
    nextId: "hairi_entry_1",
  },
  hairi_entry_1: {
    id: "hairi_entry_1",
    speaker: "hairi",
    speakerName: "Hairi • Pemuda Kaos Abu-abu",
    portrait: "/hairi_portrait.png",
    text: "PANTAS SAJA SINYAL NGADAT! Saya lagi sibuk kerja, kalian malah asyik main-main di sekitar tower transmisi! Muka saya sampai merah begini menahan emosi!",
    emotion: "surprised",
    nextId: "hairi_entry_2",
  },
  hairi_entry_2: {
    id: "hairi_entry_2",
    speaker: "hairi",
    speakerName: "Hairi • Pemuda Kaos Abu-abu",
    portrait: "/hairi_portrait.png",
    text: "Jangan lari kalian! Aktifkan Perisai XL dan Sarung Tinju Merah saya! Mari kita buktikan siapa yang terkuat di Losari!",
    emotion: "surprised",
    nextId: "adif_hairi_battle_start",
  },
  adif_hairi_battle_start: {
    id: "adif_hairi_battle_start",
    speaker: "adif",
    speakerName: "Adif • Sang Koboi Menara",
    portrait: "/adif_portrait.png",
    text: "Wah Hairi sudah pasang mode tempur! Dani, Jihan, ayo uji ketangkasan kita berempat! Tali laso koboi saya juga siap berputar!",
    emotion: "happy",
  },
  hairi_evolution_1: {
    id: "hairi_evolution_1",
    speaker: "hairi",
    speakerName: "Hairi • Fase 1 Tumbang",
    portrait: "/hairi_portrait.png",
    text: "Hah... Hah... Kalian pikir bisa menundukkanku semudah itu?! Itu tadi baru pemanasan wujud manusia biasa!",
    emotion: "surprised",
    nextId: "hairi_evolution_2",
  },
  hairi_evolution_2: {
    id: "hairi_evolution_2",
    speaker: "jihan",
    speakerName: "Jihan • Pendekar Anggun",
    portrait: "/jihan_portrait.png",
    text: "Dani, lihat! Muncul sirkuit cyan bercahaya di kaosnya dan dia mengenakan kacamata visor futuristik! Auranya melonjak drastis!",
    emotion: "surprised",
    nextId: "hairi_evolution_3",
  },
  hairi_evolution_3: {
    id: "hairi_evolution_3",
    speaker: "hairi",
    speakerName: "SUPER HAIRI • Mode Overclock",
    portrait: "/hairi_super_portrait.png",
    text: "INITIATING SYSTEM OVERCLOCK! Buka limit protokol daya transmisi! Sekarang rasakan kecepatan kilat dan ledakan energi kuantum Level 2!",
    emotion: "happy",
    nextId: "hairi_evolution_4",
  },
  hairi_evolution_4: {
    id: "hairi_evolution_4",
    speaker: "adif",
    speakerName: "Adif • Sang Koboi Menara",
    portrait: "/adif_portrait.png",
    text: "Waduh! Hairi berevolusi ke wujud Super! Darah lapis keduanya jauh lebih tebal dan serangannya luar biasa dahsyat! Dani, Jihan, waspada penuh!",
    emotion: "surprised",
  },
  adif_hairi_defeat: {
    id: "adif_hairi_defeat",
    speaker: "hairi",
    speakerName: "SUPER HAIRI • Sistem Overheat",
    portrait: "/hairi_super_portrait.png",
    text: "Bzzzt... Sistem sirkuit mengalami pendinginan... Kalian berdua luar biasa hebat bisa menembus pertahanan Level 2 Super Mode-ku. Emosiku sudah padam dan pikiranku kembali jernih.",
    emotion: "thoughtful",
    nextId: "adif_hairi_defeat_2",
  },
  adif_hairi_defeat_2: {
    id: "adif_hairi_defeat_2",
    speaker: "adif",
    speakerName: "Adif • Sang Koboi Menara",
    portrait: "/adif_portrait.png",
    text: "Hahaha mantap sekali! Mulai detik ini Hairi resmi bergabung sebagai rekan bertarung kalian dengan kekuatan supernya! Kita semua sekarang sahabat sejati!",
    emotion: "happy",
  },
};

// Legacy backwards compatibility
export interface StoryBeat {
  chapter: number;
  location: string;
  badge: string;
  quote: string;
  introTitle: string;
  introText: string[];
  clearTitle: string;
  clearText: string[];
  motivationalNote: string;
}

export const DANI_STORY: Record<number, StoryBeat> = {
  0: {
    chapter: 1,
    location: "PANTAI LOSARI • SULAWESI",
    badge: "BABAK 1: KEMBARA DUA SAHABAT",
    quote: "“Dua negeri serumpun, disatukan oleh indahnya senja dan hangatnya rasa.”",
    introTitle: "Anjungan Senja Pantai Losari",
    introText: [
      "Bismillah! Senja keemasan menyapa lembut dermaga kayu Pantai Losari, Makassar.",
      "Jihan dan Dani berjalan berdampingan menikmati aroma laut dan jajanan tradisional.",
    ],
    clearTitle: "Tahniah! Eksplorasi Berjaya!",
    clearText: [
      "Alhamdulillah! Seluruh jejak kenangan di dermaga telah siap dijelajahi.",
    ],
    motivationalNote: "Pencapaian: Persahabatan Sejati",
  },
};
