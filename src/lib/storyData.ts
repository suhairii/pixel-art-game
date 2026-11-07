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
    location: "KAMPUNG WARISAN • PANTAI TIMUR",
    badge: "BABAK 1: PERMULAAN LANGKAH",
    quote: "“Biar lambat asalkan selamat, tapi bila melangkah, biarlah dengan tekad.”",
    introTitle: "Teratak Bonda & Harum Karipap",
    introText: [
      "Bismillah! Pagi yang hening di Kampung Warisan, bayu laut menyapa lembut pepohon kelapa dan rumah panggung kayu.",
      "Dani, seorang anak gadis berhijab yang penuh impian, mengikat kemas kasut trekking miliknya.",
      "Kutip Karipap Emas panas dan nikmati secawan Teh Tarik kaw untuk mengumpul tenaga sebelum menuju ke stesen keretapi!",
    ],
    clearTitle: "Tahniah! Langkah Pertama Berjaya!",
    clearText: [
      "Alhamdulillah! Seluruh bekalan di kampung telah siap dikumpul.",
      "Lambaian tangan bonda mengiringi langkah Dani menaiki keretapi malam menuju ke ibu kota Kuala Lumpur.",
    ],
    motivationalNote: "Pencapaian: Jiwa Warisan Terpahat",
  },
  1: {
    chapter: 2,
    location: "LEMBAH KLCC • KUALA LUMPUR",
    badge: "BABAK 2: KOTA METROPOLITAN",
    quote: "“Di celah rimba batu konkrit, jiwa anak watan tetap tidak akan goyah.”",
    introTitle: "Gemerlap Menara Berkembar",
    introText: [
      "Kuala Lumpur menyambut Dani dengan kilauan neon Menara Berkembar Petronas yang megah menembus awan.",
      "Kini laluannya lebih mencabar — melompat merentasi lintasan monorail, bumbung pencakar langit, dan menghindari dron keselamatan siber!",
      "Kumpulkan Bunga Raya kebangsaan untuk mengekalkan fokus dan stamina Dani!",
    ],
    clearTitle: "Lembah Metropolitan Ditakluki!",
    clearText: [
      "Hebat sekali! Dani berjaya melepasi labirin pencakar langit ibu kota.",
      "Kini penerbangan terus ke Sabah telah sedia berlepas. Matlamat terakhir: Puncak Tertinggi Asia Tenggara!",
    ],
    motivationalNote: "Pencapaian: Ketangkasan Kota Metropolitan",
  },
  2: {
    chapter: 3,
    location: "BANJARAN CROCKER • GUNUNG KINABALU",
    badge: "BABAK 3: PUNCAK AWAN KINABALU",
    quote: "“Setinggi mana pun gunung yang didaki, tunduklah sujud pada Ilahi.”",
    introTitle: "Menuju Puncak Low's Peak (4,095M)",
    introText: [
      "Suhu dingin mencucuk tulang di lereng granit Gunung Kinabalu. Kabut mistik berarak ditiup angin kencang gunung.",
      "Tebing-tebing batu yang licin memerlukan ketepatan lompatan dan keberanian yang jitu.",
      "Kibarkan semangat kembara, kutip bintang puncak, dan gapai tiang kejayaan di puncak Kinabalu!",
    ],
    clearTitle: "SUBHANALLAH! PUNCAK KINABALU DITAWAN!",
    clearText: [
      "Angin dingin membisikkan rasa syukur yang tak terhingga. Dani berdiri di Puncak Kinabalu memandang lautan awan yang keemasan.",
      "Perjalanan ribuan batu dari desa nelayan hingga ke puncak tertinggi membuktikan: Tiada impian yang mustahil bagi yang berusaha!",
    ],
    motivationalNote: "Pencapaian: Ratu Puncak Kinabalu",
  },
};
