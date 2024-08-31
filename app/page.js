'use client'
import React from 'react'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { Box, AppBar, Button, Container, Toolbar, Typography, Grid} from '@mui/material'
import Head from 'next/head'
import getStripe from '../utils/get-stripe'




export default function Home() {

  const handleSubmit = async () => {
    const checkoutSession = await fetch('/api/checkout_session', {
      method: 'POST',
      headers: { origin: 'http://localhost:3000' },
    })
    const checkoutSessionJson = await checkoutSession.json()

    if (checkoutSession.statusCode === 500) {
      console.error(checkoutSession.message)
      return
    }

    const stripe = await getStripe()
    const {error} = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    })

    if (error) {
      console.warn(error.message)
    }
  }
  return(
    <Container maxWidth="100vw">
      <Head>
        <title>Convoflash</title>
        <meta name = "description" content="Create flashcard from your text" />
      </Head>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{flexGrow: 1}}>
            Convoflash
          </Typography>
          <SignedOut>
            <Button color="inherit" href="/sign-in">Login</Button>
            <Button color="inherit" href="/sign-up">Sign Up</Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>


      <Box sx={{textAlign: 'center', my: 4}}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Convoflash
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Have Conversations Anytime Anywhere
        </Typography>
        <Button variant="contained" color="primary" sx={{mt: 2, mr: 2}} href="/generate">
          Get Started
        </Button>
        <Button variant="outlined" color="primary" sx={{mt: 2}} href="https://github.com/TelmenBay/Convoflash">
          Learn More
        </Button>
      </Box>
      <Box sx={{my: 6}}>
        <Typography variant="h4" gutterBottom sx={{ textAlign: 'center' }} >Features</Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{
              p:3,
              border: '1px solid',
              borderColor: 'grey.300',
              borderRadius: 2,
            }}>
            <Typography variant='h6' gutterBottom sx={{ textAlign: 'center' }}>Easy Text Input</Typography>
            <Typography sx={{ textAlign: 'center' }}>
              {' '}
              Simply input your "Target Language" and "Source Language". Our software will do the rest.
            </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{
              p:3,
              border: '1px solid',
              borderColor: 'grey.300',
              borderRadius: 2,
            }}>
            <Typography variant='h6' gutterBottom sx={{ textAlign: 'center' }}>Smart Flashcards</Typography>
            <Typography sx={{ textAlign: 'center' }}>
              {' '}
              Our AI Intelligently breaks down your text into concise flashcards, perfect for studying.
            </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{
              p:3,
              border: '1px solid',
              borderColor: 'grey.300',
              borderRadius: 2,
            }}>
            <Typography variant='h6' gutterBottom sx={{ textAlign: 'center' }}>No Langauge Barrier</Typography>
            <Typography sx={{ textAlign: 'center' }}>
              {' '}
              Accessible to anyone around the world from any device. Talk to anyone with Convoflash.
            </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{my: 6, textAlign: 'center'}}>
        <Typography variant="h4" gutterBottom>Pricing</Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box sx={{
              p:3,
              border: '1px solid',
              borderColor: 'grey.300',
              borderRadius: 2,
            }}>
              <Typography variant='h5' gutterBottom>Free</Typography>
              <Typography variant='h6' gutterBottom>No Payment</Typography>
              <Typography>
                {' '}
                Access to basic flashcard features and limited storage.
              </Typography>
              <Button variant='contained' color='primary' sx={{mt: 2}} href='/generate'>
                Choose Free
              </Button>
            </Box> 
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{
              p:3,
              border: '1px solid',
              borderColor: 'grey.300',
              borderRadius: 2,
            }}>
              <Typography variant='h5' gutterBottom>Pro</Typography>
              <Typography variant='h6' gutterBottom>$1.99 / One Time Payment</Typography>
              <Typography>
                {' '}
                Unlimited flashcards and storage, with priority support.
              </Typography>
              <Button variant='contained' color='primary' sx={{mt: 2}} onClick={handleSubmit}>
                Choose Pro
              </Button>
            </Box> 
          </Grid>
          
        </Grid>
      </Box>

    </Container>
      
  )}