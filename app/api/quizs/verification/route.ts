import { NextResponse } from 'next/server';
import { newVerification } from '@/actions/new-verification';  // Adjust the path to your `register` action

// Define the POST request handler
export async function GET(request: Request) {
    
  try {
    // Extract the request body
    //const body = await request.json();

    // Extract token parameter from url
    const token = request.url.split('=').pop()

    // Call the register function with the request body
    const response = await newVerification(token as string);

    // If there was an error (e.g., validation or duplicate email)
    if (response?.error) {
      return NextResponse.json({ error: response.error, message: "Code de verification invalide" }, { status: 400 });
    }

    // Success
    return NextResponse.json({ success: response?.success }, { status: 201 });

  } catch (error) {
    // Handle unexpected errors
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
