// src/app/api/upload/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    const file = formData.get('file') as File;
    const name = formData.get('name') as string;
    const type = formData.get('type') as string;
    const description = formData.get('description') as string;

    if (!file || !name || !type) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    // 1. Clean the filename and add a timestamp to guarantee uniqueness
    const originalExt = file.name.split('.').pop() || 'txt';
    const safeName = name.replace(/[^a-zA-Z0-9-_]/g, '_').toLowerCase();
    const uniqueFileName = `${Date.now()}_${safeName}.${originalExt}`;
    const filePath = `contributions_pending/${uniqueFileName}`;

    // 2. Convert file to Base64 for the GitHub API
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Content = buffer.toString('base64');

    // 3. Construct the GitHub API Request
    const githubUrl = `https://api.github.com/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/contents/${filePath}`;
    
    // We append the type and description to the commit message so you can review it easily
    const commitMessage = `New Contribution: ${name} (${type})\n\nDescription: ${description || 'None'}`;

    const githubResponse = await fetch(githubUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: commitMessage,
        content: base64Content,
      }),
    });

    if (!githubResponse.ok) {
      const errorData = await githubResponse.json();
      console.error("GitHub API Error:", errorData);
      return NextResponse.json({ error: "Failed to push to GitHub." }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Successfully added to the moderation queue!" }, { status: 200 });

  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}