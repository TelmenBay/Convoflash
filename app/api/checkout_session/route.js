import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Helper function to convert amount to the format Stripe expects
const formatAmountForStripe = (amount) => {
  return Math.round(amount * 100); // Converts amount to cents
}

export async function GET(req) {
  const searchParams = req.nextUrl.searchParams;
  const session_id = searchParams.get('session_id');

  try {
    if (!session_id) {
      throw new Error('Session ID is required');
    }

    // Retrieve the checkout session
    const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);
    return NextResponse.json(checkoutSession);
  } 
  catch (error) {
    console.error('Error retrieving checkout session:', error);
    return NextResponse.json({ error: { message: error.message } }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    // Create checkout session parameters
    const params = {
      mode: 'subscription', // Ensure you want a subscription (change to 'payment' for a one-time payment)
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Pro subscription',
            },
            unit_amount: formatAmountForStripe(1.99), // Correct amount for Stripe (in cents)
            recurring: {
              interval: 'month',
              interval_count: 1 // Correct interval for subscriptions
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${req.headers.get('origin')}/result?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/result?session_id={CHECKOUT_SESSION_ID}`,
    };

    // Create the checkout session
    const checkoutSession = await stripe.checkout.sessions.create(params);

    // Return the created session
    return NextResponse.json(checkoutSession, { status: 200 });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json({ error: { message: error.message } }, { status: 500 });
  }
}
