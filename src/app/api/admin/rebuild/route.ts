import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  // 1. Verify the secret password
  if (secret !== process.env.ADMIN_SECRET) {
    return new NextResponse("Unauthorized. Nice try, though.", { status: 401 });
  }

  const deployHook = process.env.VERCEL_DEPLOY_HOOK_URL;
  if (!deployHook) {
    return new NextResponse("Server Error: Vercel deploy hook not configured in environment variables.", { status: 500 });
  }

  // 2. Ping Vercel to trigger the rebuild
  try {
    const response = await fetch(deployHook, { method: 'POST' });
    
    if (response.ok) {
      return new NextResponse("Success: Rebuild triggered! The library will update in about 60 seconds.", { status: 200 });
    } else {
      return new NextResponse("Failed to trigger Vercel rebuild.", { status: 500 });
    }
  } catch (error) {
    return new NextResponse("Error communicating with Vercel.", { status: 500 });
  }
}