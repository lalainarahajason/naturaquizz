import { NextResponse } from 'next/server';

// Handle GET request
export async function GET(request: Request) {
  
  return NextResponse.json({ message: 'This is a GET id' });
}