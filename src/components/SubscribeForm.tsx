'use client';

import React, { useState } from 'react';
import { styled, keyframes } from '../lib/stitches.config';
import { Mail, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';

const fadeIn = keyframes({
  '0%': { opacity: 0, transform: 'translateY(10px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
});

const FormContainer = styled('div', {
  maxWidth: '500px',
  width: '100%',
  background: 'rgba(20, 20, 20, 0.7)',
  backdropFilter: 'blur(10px)',
  padding: '$5',
  borderRadius: '24px',
  border: '1px solid $border',
  boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
  animation: `${fadeIn} 0.8s ease-out forwards`,
});

const Title = styled('h2', {
  fontSize: '$5',
  fontWeight: 800,
  color: '$white',
  marginBottom: '$2',
  letterSpacing: '-0.02em',
});

const Description = styled('p', {
  color: '$gray',
  fontSize: '$3',
  marginBottom: '$4',
  lineHeight: 1.5,
});

const InputGroup = styled('div', {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
});

const IconWrapper = styled('div', {
  position: 'absolute',
  left: '$3',
  color: '$gray',
});

const Input = styled('input', {
  width: '100%',
  backgroundColor: '#000000',
  border: '2px solid $border',
  borderRadius: '16px',
  padding: '16px 16px 16px 48px',
  color: '$white',
  fontSize: '$3',
  outline: 'none',
  transition: 'all 0.3s ease',

  '&:focus': {
    borderColor: '$orange',
    boxShadow: '0 0 0 4px rgba(200, 121, 65, 0.1)',
  },
});

const SubmitButton = styled('button', {
  position: 'absolute',
  right: '8px',
  backgroundColor: '$orange',
  color: '$white',
  border: 'none',
  borderRadius: '12px',
  padding: '10px 16px',
  fontWeight: 700,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  transition: 'all 0.3s ease',

  '&:hover': {
    backgroundColor: '$white',
    color: '#000000 !important',
    transform: 'scale(1.02)',
    '& *': { color: '#000000 !important' },
  },

  '&:disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
});

const Message = styled('p', {
  marginTop: '$3',
  fontSize: '$2',
  textAlign: 'center',
  variants: {
    type: {
      success: { color: '#4ade80' },
      error: { color: '#f87171' },
    },
  },
});

export default function SubscribeForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus('success');
        setMessage("You're in! Welcome to the loop.");
        setEmail('');
      } else {
        setStatus('error');
        setMessage('Something went wrong. Please try again.');
      }
    } catch (err) {
      setStatus('error');
      setMessage('Network error. Check your connection.');
    }
  };

  return (
    <FormContainer>
      <Title>Stay ahead of the curve.</Title>
      <Description>
        Get the previous day's AI and Data Science intelligence, curated and summarized at 9 AM daily.
      </Description>
      <form onSubmit={handleSubmit}>
        <InputGroup>
          <IconWrapper>
            <Mail size={18} />
          </IconWrapper>
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === 'loading' || status === 'success'}
          />
          <SubmitButton type="submit" disabled={status === 'loading' || status === 'success'}>
            {status === 'loading' ? (
              <Loader2 size={18} className="animate-spin" />
            ) : status === 'success' ? (
              <CheckCircle2 size={18} />
            ) : (
              <>
                Subscribe <ArrowRight size={18} />
              </>
            )}
          </SubmitButton>
        </InputGroup>
      </form>
      {message && <Message type={status === 'error' ? 'error' : 'success'}>{message}</Message>}
    </FormContainer>
  );
}
