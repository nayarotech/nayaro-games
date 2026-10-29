import { adaptWorker } from "@/lib/integration";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const origin =
      process.env.MERGEFINITY_ORIGIN || "https://mergefinity.vercel.app";
    const upstream = await fetch(`${origin}/sw.js`, {
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });
    if (!upstream.ok) throw new Error("Worker unavailable");
    return new Response(adaptWorker(await upstream.text()), {
      headers: {
        "Content-Type": "application/javascript; charset=utf-8",
        "Cache-Control": "no-store",
        "Service-Worker-Allowed": "/mergefinity/",
      },
    });
  } catch {
    return new Response(
      "Offline support unavailable. Online play is still available.",
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
