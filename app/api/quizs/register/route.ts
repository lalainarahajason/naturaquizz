import { NextResponse } from 'next/server';
import { register } from '@/actions/register';  // Adjust the path to your `register` action
import { z } from 'zod';

// Define the POST request handler
export async function POST(request: Request) {
    
  try {
    // Extract the request body
    const body = await request.json();

    // Call the register function with the request body
    const response = await register(body);

    // If there was an error (e.g., validation or duplicate email)
    if (response.error) {
      return NextResponse.json({ error: response.error, message: response.message }, { status: 400 });
    }

    // Success
    return NextResponse.json({ success: response.success }, { status: 201 });

  } catch (error) {
    // Handle unexpected errors
    return NextResponse.json({ error: 'Something went wrong 2' }, { status: 500 });
  }
}
