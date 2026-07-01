export type Agent = {
  slug: string;
  name: string;
  role: string;
  basedIn: string;
  joined: number;
  languages: string[];
  bio: string[];
  letter: string;
  expertise: string[];
  initials: string;
  email: string;
  phone: string;
};

export const agents: Agent[] = [
  {
    slug: "lea-marchand",
    name: "Léa Marchand",
    role: "Founding Partner",
    basedIn: "Antibes",
    joined: 2013,
    languages: ["French", "English", "Italian"],
    bio: [
      "Léa founded Vila Estate in the winter of 2013 after a decade with the private office of a Geneva-based collector, advising on the acquisition and disposal of architect-designed houses across the Mediterranean.",
      "She is a graduate of the École du Louvre and a slow reader. She lives in Antibes with her partner, an architectural historian, and a Siamese named Émile.",
    ],
    letter:
      "The houses we represent are not always the most expensive. They are the ones we found ourselves returning to — at unusual hours, often without purpose, simply because something in them required to be looked at again.",
    expertise: ["Côte d'Azur", "Cap d'Antibes", "Saint-Tropez", "20th-century French architects"],
    initials: "LM",
    email: "lea@vilaestate.co",
    phone: "+33 4 93 00 00 01",
  },
  {
    slug: "tomas-folguera",
    name: "Tomás Folguera",
    role: "Partner, Iberia",
    basedIn: "Palma de Mallorca",
    joined: 2016,
    languages: ["Spanish", "Catalan", "English"],
    bio: [
      "Tomás joined the practice in 2016 from the Palma office of Folguera Arquitectos — his father's firm — where he had worked for seven years on private restoration. He continues to act as a consulting historian on a number of Mallorca's protected agricultural estates.",
    ],
    letter:
      "Mallorca is not a market. It is a small island where every restoration is a question one is asked twice: once by the planning office, and once by the wind.",
    expertise: ["Mallorca", "Ibiza", "Menorca", "Mediterranean restoration"],
    initials: "TF",
    email: "tomas@vilaestate.co",
    phone: "+34 971 00 00 02",
  },
  {
    slug: "elisabetta-marini",
    name: "Elisabetta Marini",
    role: "Partner, Italy",
    basedIn: "Milan",
    joined: 2018,
    languages: ["Italian", "English", "French"],
    bio: [
      "Before joining the practice, Elisabetta spent eleven years with Christie's International Real Estate in Milan and a further two years curating an exhibition at the Triennale on the 20th-century private villa.",
    ],
    letter:
      "What is rare in the lakes is not the house. It is the conversation that preserves it across three generations. We try to begin that conversation as carefully as we can.",
    expertise: ["Lake Como", "Lake Maggiore", "Venice", "Italian modernism"],
    initials: "EM",
    email: "elisabetta@vilaestate.co",
    phone: "+39 02 0000 0003",
  },
  {
    slug: "youssef-laraqui",
    name: "Youssef Laraqui",
    role: "Partner, North Africa",
    basedIn: "Marrakech",
    joined: 2019,
    languages: ["Arabic", "French", "English"],
    bio: [
      "Youssef trained as an architect at the École Spéciale d'Architecture in Paris before returning to Marrakech to lead the conservation programme at the Jardin Majorelle. He joined the practice in 2019.",
    ],
    letter:
      "A house in the Palmeraie is a house with two views: the one through the window, and the one the gardener has been keeping for it.",
    expertise: ["Marrakech", "Palmeraie", "Tangier", "Riad conservation"],
    initials: "YL",
    email: "youssef@vilaestate.co",
    phone: "+212 524 00 00 04",
  },
  {
    slug: "siobhan-walsh",
    name: "Síobhán Walsh",
    role: "Associate, British Isles",
    basedIn: "London",
    joined: 2021,
    languages: ["English", "Irish"],
    bio: [
      "Síobhán read English at Trinity College Dublin and spent six years at The Modern House in London. She joined our British Isles desk in 2021.",
    ],
    letter:
      "The houses I love most are the ones that look slightly embarrassed to be photographed. They are usually the ones that have been lived in properly.",
    expertise: ["Ireland", "Scottish Highlands", "Cornwall", "Coastal modernism"],
    initials: "SW",
    email: "siobhan@vilaestate.co",
    phone: "+44 20 0000 0005",
  },
];

export function getAgent(slug: string) {
  return agents.find((a) => a.slug === slug);
}
