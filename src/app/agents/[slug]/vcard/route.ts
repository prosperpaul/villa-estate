import { getAgent } from "@/lib/agents";

// GET /agents/<slug>/vcard -> downloads a .vcf contact card that phones can import.
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getAgent(slug);
  if (!a) return new Response("Agent not found", { status: 404 });

  // vCard text must escape commas, semicolons and backslashes
  const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/([,;])/g, "\\$1");
  const [first, ...rest] = a.name.split(" ");

  const card = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${esc(rest.join(" "))};${esc(first)};;;`,
    `FN:${esc(a.name)}`,
    "ORG:Haven Properties",
    `TITLE:${esc(a.role)}`,
    `TEL;TYPE=WORK,VOICE:${a.phone}`,
    `EMAIL;TYPE=WORK:${a.email}`,
    `ADR;TYPE=WORK:;;;${esc(a.basedIn)};;;`,
    "END:VCARD",
  ].join("\r\n"); // the vCard spec uses CRLF line endings

  return new Response(card, {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `attachment; filename="${slug}.vcf"`,
    },
  });
}
