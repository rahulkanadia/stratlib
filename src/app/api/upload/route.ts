import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    const file = formData.get('file') as File;
    const name = formData.get('name') as string;
    const type = formData.get('type') as string;
    const description = formData.get('description') as string;
    const password = formData.get('password') as string;

    if (!file || !name || !type) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const originalExt = file.name.split('.').pop() || 'txt';
    const safeName = name.replace(/[^a-zA-Z0-9-_]/g, '_').toLowerCase();
    const uniqueFileName = `${Date.now()}_${safeName}.${originalExt}`;
    const filePath = `contributions_pending/${uniqueFileName}`;

    const headers = {
      'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    };

    const baseUrl = `https://api.github.com/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/contents/`;

    // --- NEW: CSV PASSWORD HANDLING ---
    if (password) {
      const csvPath = `contributions_pending/_passwords.csv`;
      let csvContent = 'filename,password\n';
      let csvSha = undefined;

      // 1. Try to fetch the existing CSV
      const getCsvRes = await fetch(`${baseUrl}${csvPath}`, { headers });
      if (getCsvRes.ok) {
        const csvData = await getCsvRes.json();
        // GitHub API returns content in base64
        csvContent = Buffer.from(csvData.content, 'base64').toString('utf-8');
        csvSha = csvData.sha; // We need the SHA to update an existing file
      }

      // 2. Append the new row
      csvContent += `${uniqueFileName},${password}\n`;

      // 3. Save the CSV back to GitHub
      await fetch(`${baseUrl}${csvPath}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          message: `System: Log password for ${uniqueFileName}`,
          content: Buffer.from(csvContent).toString('base64'),
          sha: csvSha,
        }),
      });
    }

    // --- UPLOAD THE ACTUAL FILE ---
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Content = buffer.toString('base64');
    
    // Password is removed from the commit message
    const commitMessage = `New Contribution: ${name} (${type})\n\nDescription: ${description || 'None'}`;

    const githubResponse = await fetch(`${baseUrl}${filePath}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        message: commitMessage,
        content: base64Content,
      }),
    });

    if (!githubResponse.ok) {
      return NextResponse.json({ error: "Failed to push to GitHub." }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Successfully added to the moderation queue!" }, { status: 200 });

  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}