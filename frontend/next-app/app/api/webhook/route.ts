import { NextResponse } from 'next/server';

// Example: POST /api/webhook
export async function POST(request: Request) {
  try {
    // Expect JSON payload
    const body = await request.json();
    // Simple auth check – expects header "Authorization: Bearer <TOKEN>"
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing or invalid Authorization header' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    // TODO: validate token against your Google Sheets secret / service account
    // Placeholder: just log the payload
    console.log('Google Sheets webhook payload:', body);

    // TODO: Use Google Sheets API (e.g., googleapis package) to append rows.
    // For now we return success.
    return NextResponse.json({ message: 'Webhook received' }, { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
