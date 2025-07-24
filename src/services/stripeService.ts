
import { loadStripe } from '@stripe/stripe-js';
import { fetchWithToken } from '../app/utils/fetchWithToken'; // Adjust the import path as necessary

export const initializeStripe = async () => {
  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    throw new Error('Stripe publishable key not configured');
  }

  const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  if (!stripe) {
    throw new Error('Failed to initialize Stripe');
  }
  return stripe;
};

// services/stripeService.ts
export const createCheckoutSession = async (email: string): Promise<{ url: string }> => {
  const response = await fetchWithToken(`${process.env.NEXT_PUBLIC_API_URL}/stripe/create-checkout-session`, {
    method: 'POST',
    body: JSON.stringify({ email }),
  });

  const data = await response.json();

  if (!data.url) {
    throw new Error('No se recibió una URL válida de Stripe');
  }

  return data;
};


export const createStripePayment = async (email: string): Promise<{ clientSecret: string }> => {
  const response = await fetchWithToken(`${process.env.NEXT_PUBLIC_API_URL}/stripe/create-order`, {
    method: 'POST',
    body: JSON.stringify({ email }),
  });

  const data = await response.json();

  if (!data.clientSecret) {
    throw new Error('Missing clientSecret in response');
  }

  return data;
};