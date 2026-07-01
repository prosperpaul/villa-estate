export type Article = {
  slug: string;
  department: "Field Notes" | "Architects in Conversation" | "The Coast Issue" | "Marginalia";
  title: string;
  dek: string;
  date: string;
  readingMinutes: number;
  author: string;
  authorRole: string;
  cover: string;
  body: string[];
  pullquote?: string;
};

export const articles: Article[] = [
  {
    slug: "the-quiet-house",
    department: "Field Notes",
    title: "The Quiet House",
    dek: "On three residences that taught us how much a building can refuse to do.",
    date: "Spring 2026",
    readingMinutes: 11,
    author: "Léa Marchand",
    authorRole: "Founding Partner",
    cover: "/photo-13.avif",
    body: [
      "A few winters ago, on a difficult site above Antibes, I watched an architect reject — politely, but for the third time — a request to widen a single doorway. The owner, our client, had asked for thirty extra centimetres so a particular Italian sideboard could pass without being lifted. The architect listened, looked at his drawing, and said: \"If we widen the door, we have to move the wall. If we move the wall, the room is no longer the room.\" He left the doorway alone. The sideboard, as it happens, was sold.",
      "I have come to think of that exchange often. It is, I believe, the quietest possible definition of luxury — the refusal to compromise a proportion for a possession. The best houses we represent share this quality. They are not, in any obvious sense, generous. They do not flatter the visitor with great wide vistas or gestures of welcome. They simply hold their measure, and trust the visitor to meet them at it.",
      "Villa Aurelia, photographed for the cover of this issue, is the clearest example. The owners — a family I have known for almost a decade — speak of it as a house that taught them how to be quiet. The architect drew an unbroken loggia of teak and travertine along the cliff edge and refused to bend it for any of the conventional reasons (a better view, an easier kitchen, a wider corridor for the cellist). He understood, I think, that the house's job was to compose them, not the other way around.",
      "This is the kind of design discipline that, increasingly, the market does not reward. Our clients have stopped asking for square metres and started asking for evenings — \"a house in which we'd want to read until midnight,\" one woman said to me recently. It is the most useful brief I have been given in years. I have started writing it at the top of every site visit.",
      "The other two houses we have written about this season — Pavillon Noir, in Saint-Paul-de-Vence, and Casa del Vento, above Deià — share, in their different ways, the same refusal. Pavillon Noir is small, for the kind of house it is. Casa del Vento has only one bath in the principal suite, an act of restraint its restorer fought hard for against an early owner's preference. Both houses, we think, are better for what they do not contain.",
      "In a quieter market, this kind of editing of a brief is the work that most matters. It is rarely visible in a photograph and never visible in a price. It is, however, the difference between a house that one merely owns and a house in which one actually lives.",
    ],
    pullquote:
      "Our clients have stopped asking for square metres and started asking for evenings.",
  },
  {
    slug: "a-conversation-with-bernat-ferran",
    department: "Architects in Conversation",
    title: "A Conversation with Bernat Ferran",
    dek: "The former RCR associate on independence, restraint, and the houses one is asked to design twice.",
    date: "Spring 2026",
    readingMinutes: 18,
    author: "Elisabetta Marini",
    authorRole: "Partner, Italy",
    cover: "/photo-15.avif",
    body: [
      "We meet at the door of Maison Lumière at the moment the light begins to leave the bay. Bernat Ferran is, as I had been warned, not given to small talk; he greets me in the courtyard, points at a particular weathered-steel detail he had been disappointed in for thirteen years, and leads me inside without ceremony. The house is not yet finished. The owner, who is travelling, has left us a key and a small bottle of Sant Aniol behind a stack of books in the library.",
      "Ferran spent more than a decade as an associate at RCR, the Catalan studio led by Rafael Aranda, Carme Pigem and Ramon Vilalta — winners of the 2017 Pritzker Prize and, by general agreement, three of the most rigorous architects working in private commissions in Europe. He left in 2019. \"It was not a quarrel,\" he tells me. \"It was a wish to be wrong on my own.\"",
      "His first independent commission, completed three years later, is the house we are standing in. The brief was unusual: a couple in their late sixties, both writers, who had spent thirty years behind a hedge so dense their gardener could not enter it without ducking. They asked Ferran for a house that would, in their words, hold a quieter conversation with the light. Ferran refused the brief twice before accepting it.",
      "\"I told them: I do not believe in quiet conversations with light. Light is not polite. If you build a house for the light, the light wins. It will move your furniture. It will tell you when to eat. You will adjust your day to it. They listened. Then they said: yes, that is what we want.\"",
      "What followed was a four-year design process during which Ferran returned, in his words, to first principles he had not visited since architecture school. The result is a house of weathered steel, set deep into local stone, with no door wider than necessary and no window placed for view alone. Every aperture has been calculated against the angle of light it will admit and the season in which it will admit it. The principal living room receives full direct sun for only fourteen days of the year — a deliberate choice, Ferran explains, to make those fourteen days matter.",
      "I ask him whether he could have made these decisions inside RCR. He thinks for a long time. \"Probably. But I would have had to ask. And the asking would have made me a different architect. I had to stop asking.\"",
      "We talk, before he leaves, about the question of houses one is asked to design twice — the curse, he calls it, of any architect who has had a public success. \"Owners come to me and ask: design us a house like Lumière. I refuse them. Not because I am precious about the work. Because that is not how a house begins. A house begins with a place, a light, two people who do not yet agree what they want. Lumière was that conversation in that place. The conversation cannot repeat.\"",
      "He looks once, briefly, at the failing light over the bay. \"And neither should the house.\"",
    ],
    pullquote: "Light is not polite. If you build a house for the light, the light wins.",
  },
  {
    slug: "the-jacaranda",
    department: "Field Notes",
    title: "The Jacaranda",
    dek: "How a single seventy-year-old tree rebuilt a 1,150 m² house three times.",
    date: "Winter 2025",
    readingMinutes: 9,
    author: "Youssef Laraqui",
    authorRole: "Partner, North Africa",
    cover: "/photo-17.avif",
    body: [
      "When Studio KO first arrived on the site that would become Dar el Bahia, the tree was already there. A jacaranda, planted by the previous owner's grandfather some seventy years before, standing at the precise centre of what was then a derelict palmery. The brief asked, politely but unmistakably, for it to come down.",
      "The architects refused. They refused once in writing, twice in person, and a fourth time — to the considerable surprise of everyone present — by walking off the site on the afternoon they were shown the demolition stake. The tree, they said, was the house. Anything else they drew would have to be drawn around it.",
      "What followed was a year of revision. Three complete schemes were discarded. The kitchen was moved twice, the principal courtyard widened, narrowed, and widened again, the staff quarters relocated almost a hundred metres east. The pool, initially placed under the tree's shade, was moved to allow root growth. The house we have published in this issue is the fourth attempt.",
      "The jacaranda now stands at the heart of the largest of the three courtyards. The architects designed a low circular bench around it. In April, when the tree flowers, the courtyard floor lies a foot deep in violet petals.",
      "When I asked Karl Fournier, the founding partner of Studio KO, why they had fought so hard for a single tree, he was uncharacteristically brief. \"It was older than the brief,\" he said. \"It deserved a longer answer.\"",
    ],
  },
  {
    slug: "the-coast-issue",
    department: "The Coast Issue",
    title: "Letters from the Western Edge",
    dek: "A small portfolio of houses at the precise point where the road ends.",
    date: "Autumn 2025",
    readingMinutes: 22,
    author: "Síobhán Walsh",
    authorRole: "Associate, British Isles",
    cover: "/photo-19.avif",
    body: [
      "There is a particular kind of house — not common, never advertised — that you find only at the end of a road. Not a long road; not necessarily an interesting one. Simply the kind of road that ends, with a small turning circle, in the ocean. The house I am writing this from, on the Dingle Peninsula, is one of them. Outside, the wind is doing what the wind here does. Inside, it is quiet.",
      "The Coast House, designed by O'Donnell + Tuomey in 2019, sits at the very western edge of County Kerry on a twenty-two-acre plot bordered by the Atlantic on three sides. The brief, by the owner's account, was a single sentence: a long, low building that disappears when the rain comes in. The architects responded with a weathered-timber bar, two storeys high in places, single storey elsewhere, set parallel to the coastline and oriented to the most reliable horizons of light.",
      "I have visited the house in four seasons. In summer, you can stand at the eastern end and watch swallows feeding on the cliff updraft. In winter, the timber blackens with rain and the house seems, briefly, to be made of the same material as the cliff itself. It is, I think, the closest thing in our portfolio to a house that has chosen to be where it is rather than to be put there.",
      "We have, in the past three years, sold five such houses — in Connemara, in Caithness, in Brittany, in northern Cornwall, in the outer edge of the Algarve. Each was, in its own way, a building at the end of a road. Each was, almost without exception, sold privately, after a long correspondence, to a buyer who had spent at least one winter at the house before agreeing to acquire it.",
      "I include the houses in our journal because the practice of selling them is increasingly distinct from the practice of selling anywhere else. The conversations are slower. The viewings are longer. The brief is often, quietly, about weather rather than design. We have found, almost without exception, that the owners are happier for it.",
      "If you are reading this and the description has caused you to want, suddenly, to be at the end of a road, I am happy to write back. The houses, as ever, are too few. The patience required of the buyer is the principal asset.",
    ],
  },
];

export function getArticle(slug: string) {
  return articles.find((a) => a.slug === slug);
}
