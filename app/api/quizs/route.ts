import { NextResponse } from 'next/server';

// Handle GET request
export async function GET(request: Request) {
  return NextResponse.json({ message: 'This is a GET request' });
}

// Handle POST request
export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({ message: 'This is a POST request', data: body });
}
