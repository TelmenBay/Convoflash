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

  return (
    <Container maxWidth="100vw" sx={{ p: 0, minHeight: '100vh', backgroundImage: 'url(/bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <Head>
        <title>Convoflash</title>
        <meta name="description" content="Create flashcard from your text" />
      </Head>
      <AppBar position="static" sx={{ borderRadius: '20px', backgroundColor: 'white', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }}>
        <Toolbar>
          <Image src="/brand.png" alt="Convoflash Logo" href="/app" width={160} height={40} />
          <div style={{ flexGrow: 1 }} /> {/* Push elements to the right */}
          <SignedOut>
            <Button variant="contained" sx={{ backgroundColor: 'gold', color: 'black', borderRadius: '20px', mr: 2, '&:hover': { backgroundColor: 'darkgoldenrod' } }} href="https://github.com/TelmenBay/Convoflash">Learn More</Button>
            <Button variant="contained" sx={{ backgroundColor: 'gold', color: 'black', borderRadius: '20px', mr: 2, '&:hover': { backgroundColor: 'darkgoldenrod' } }} href="/sign-in">Login</Button>
            <Button variant="contained" sx={{ backgroundColor: 'gold', color: 'black', borderRadius: '20px', '&:hover': { backgroundColor: 'darkgoldenrod' } }} href="/sign-up">Sign Up</Button>
          </SignedOut>
          <SignedIn>
            <Button variant="contained" sx={{ backgroundColor: 'gold', color: 'black', borderRadius: '20px', mr: 2, '&:hover': { backgroundColor: 'darkgoldenrod' } }} href="https://github.com/TelmenBay/Convoflash">Learn More</Button>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', minHeight: 'calc(100vh - 64px)', textAlign: 'center', my: 4 }}>
        <Typography color='white' fontFamily="Courier New, sans-serif" fontWeight="bold" variant="h2" component="h1" gutterBottom>Welcome to Convoflash</Typography>
        <Typography color='white' fontFamily="Courier New, sans-serif" variant="h5" component="h2" gutterBottom>Have Conversations Anytime Anywhere</Typography>
        <Button variant="contained" color="primary" sx={{ mt: 2, mr: 2, backgroundColor: 'gold', color: 'black', borderRadius: '20px', '&:hover': { backgroundColor: 'darkgoldenrod' } }} href="/generate">Get Started</Button>
      </Box>
    </Container>
  );
}
