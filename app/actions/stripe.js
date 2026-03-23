'use server';

import { formatAmountForStripe } from '@/lib/stripe-helpers';
import { stripe } from '@/service/stripe';
import { headers } from 'next/headers';
import Stripe from 'stripe';

export const createCheckoutSession = async (formData) => {
  const origin = headers().get('origin');

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'payment',
    submit_type: 'auto',
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'BDT',
          product_data: {
            name: formData.get('courseName'),
          },
          unit_amount: formatAmountForStripe(formData.get('coursePrice')),
        },
      },
    ],
    success_url: `${origin}/enroll-success?session_id={CHECKOUT_SESSION_ID}&courseId=${formData.get('courseId')}`,
    cancel_url: `${origin}/courses`,
    ui_mode: 'hosted',
    customer_email: formData.get('email'),
  });

  return {
    client_secret: checkoutSession.client_secret,
    url: checkoutSession.url,
  };
};

export const createPaymentIntent = async (data) => {
  const paymentIntent = await Stripe.paymentIntent.create({
    amount: formatAmountForStripe(formData.get('coursePrice')),
    automatic_payment_methods: { enabled: true },
    currency: 'BDT',
  });

  return {
    client_secret: paymentIntent.client_secret,
  };
};
