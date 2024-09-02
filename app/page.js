'use client';
import React from 'react';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { Box, AppBar, Button, Container, Toolbar, Typography } from '@mui/material';
import Head from 'next/head';
import getStripe from '../utils/get-stripe';
import Image from 'next/image';

export default function Home() {
  const handleSubmit = async () => {
    const checkoutSession = await fetch('/api/checkout_session', {
      method: 'POST',
      headers: { origin: 'http://localhost:3000' },
    });
    const checkoutSessionJson = await checkoutSession.json();

    if (checkoutSession.statusCode === 500) {
      console.error(checkoutSession.message);
      return;
    }

    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    });

    if (error) {
      console.warn(error.message);
    }
  };

  return React.createElement(
    Container,
    { maxWidth: '100vw' },
    React.createElement(
      Head,
      null,
      React.createElement('title', null, 'Convoflash'),
      React.createElement('meta', {
        name: 'description',
        content: 'Create flashcard from your text',
      })
    ),
    React.createElement(
      AppBar,
      { position: 'static' },
      React.createElement(
        Toolbar,
        null,
        React.createElement(Image, {
          src: '/brand.png',
          alt: 'Convoflash Logo',
          width: 160,
          height: 40,
        }),
        React.createElement('div', { style: { flexGrow: 1 } }), // This will push the elements to the right
        React.createElement(
          SignedOut,
          null,
          React.createElement(
            Button,
            {
              variant: 'outlined',
              color: 'inherit',
              href: 'https://github.com/TelmenBay/Convoflash',
              sx: { mr: 2 },
            },
            'Learn More'
          ),
          React.createElement(
            Button,
            {
              variant: 'outlined',
              color: 'inherit',
              href: '/sign-in',
              sx: { mr: 2 },
            },
            'Login'
          ),
          React.createElement(
            Button,
            { variant: 'outlined', color: 'inherit', href: '/sign-up' },
            'Sign Up'
          )
        ),
        React.createElement(
          SignedIn,
          null,
          React.createElement(
            Button,
            {
              variant: 'outlined',
              color: 'primary',
              sx: { mt: 2 },
              href: 'https://github.com/TelmenBay/Convoflash',
            },
            'Learn More'
          ),
          React.createElement(UserButton, null)
        )
      )
    ),
    React.createElement(
      Box,
      { sx: { textAlign: 'center', my: 4 } },
      React.createElement(
        Typography,
        { variant: 'h2', component: 'h1', gutterBottom: true },
        'Welcome to Convoflash'
      ),
      React.createElement(
        Typography,
        { variant: 'h5', component: 'h2', gutterBottom: true },
        'Have Conversations Anytime Anywhere'
      ),
      React.createElement(
        Button,
        {
          variant: 'contained',
          color: 'primary',
          sx: { mt: 2, mr: 2 },
          href: '/generate',
        },
        'Get Started'
      )
    )
  );
}
