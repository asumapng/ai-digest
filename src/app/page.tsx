'use client';

import ThreeScene from '@/components/ThreeScene';
import SubscribeForm from '@/components/SubscribeForm';
import NewsletterFeed from '@/components/NewsletterFeed';
import { styled } from '@/lib/stitches.config';

const Main = styled('main', {
  minHeight: '100vh',
  padding: '0 $5',
  position: 'relative',
  zIndex: 1,
});

const HeroSection = styled('section', {
  height: '80vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  maxWidth: '800px',
  margin: '0 auto',
});

const Logo = styled('div', {
  fontSize: '12px',
  fontWeight: 900,
  letterSpacing: '0.4em',
  color: '$orange',
  textTransform: 'uppercase',
  marginBottom: '$4',
  backgroundColor: 'rgba(200, 121, 65, 0.1)',
  padding: '4px 12px',
  borderRadius: '100px',
  border: '1px solid rgba(232, 201, 126, 0.2)',
});

const Headline = styled('h1', {
  fontSize: '$6',
  fontWeight: 900,
  color: '$white',
  lineHeight: 1.1,
  marginBottom: '$5',
  letterSpacing: '-0.04em',
  '@bp2': { fontSize: '$7' },
});

const Span = styled('span', {
  color: '$orange',
  display: 'block',
});

const Footer = styled('footer', {
  padding: '$6 0',
  textAlign: 'center',
  color: '$gray',
  fontSize: '$2',
  borderTop: '1px solid $border',
});

export default function Home() {
  return (
    <>
      <ThreeScene />
      <Main>
        <HeroSection>
          <Logo>Data & AI Intelligence</Logo>
          <Headline>
            AI <Span>Digest.</Span>
          </Headline>
          <SubscribeForm />
        </HeroSection>
        
        <NewsletterFeed />

        <Footer>
          &copy; 2026 AI Digest • Orange, White & Black • Bengaluru, IND
        </Footer>
      </Main>
    </>
  );
}
