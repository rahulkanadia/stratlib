import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import Fuse from 'fuse.js';
import metadataList from '@/data/metadata.json';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    const helpText = `
==================================================
 STRATLIB FETCH API
==================================================
Usage: Provide a search query to fetch trading code.

--- LINUX / MAC (cURL) ---
Stream: curl -s "https://stratlib.vercel.app/api/fetch?query=moving+average"
Save:   curl -s "https://stratlib.vercel.app/api/fetch?query=moving+average" > script.txt

--- WINDOWS (PowerShell) ---
Stream: irm "https://stratlib.vercel.app/api/fetch?query=moving+average"
Save:   irm "https://stratlib.vercel.app/api/fetch?query=moving+average" | Out-File script.txt
==================================================
`;
    return new NextResponse(helpText, { status: 400, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  }

  const fuse = new Fuse(metadataList, { keys: ['name', 'description'], threshold: 0.4 });
  const results = fuse.search(query);

  if (results.length === 0) {
    return new NextResponse(`No matching scripts found for "${query}".\n`, { status: 404, headers: { 'Content-Type': 'text/plain' } });
  }

  const bestMatch = results[0].item;

  try {
    const filePath = path.join(process.cwd(), 'public', bestMatch.path);
    const fileContent = await fs.readFile(filePath, 'utf-8');

    const terminalOutput = [
      `// ==========================================`,
      `// StratLib: ${bestMatch.name} (${(100 - (results[0].score || 0) * 100).toFixed(0)}% match)`,
      `// ==========================================\n`,
      fileContent
    ].join('\n');

    return new NextResponse(terminalOutput, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    return new NextResponse("Error: Could not read file.\n", { status: 500, headers: { 'Content-Type': 'text/plain' } });
  }
}
