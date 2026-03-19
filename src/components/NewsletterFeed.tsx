'use client';

import React, { useEffect, useState } from 'react';
import { styled, keyframes } from '../lib/stitches.config';
import { ExternalLink, Hash, Clock, Archive, ArrowRight } from 'lucide-react';

const slideUp = keyframes({
  '0%': { opacity: 0, transform: 'translateY(20px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
});

const Container = styled('div', {
  padding: '$6 0',
  width: '100%',
  maxWidth: '900px',
  margin: '0 auto',
});

const Header = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  marginBottom: '$5',
  gap: '$4',
  '@bp2': { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});

const SectionTitle = styled('h3', {
  fontSize: '$5',
  color: '$orange',
  display: 'flex',
  alignItems: 'center',
  gap: '$2',
  fontWeight: 800,
  margin: 0,
});

const TabGroup = styled('div', {
  display: 'flex',
  gap: '$2',
  background: 'rgba(255, 255, 255, 0.05)',
  padding: '4px',
  borderRadius: '12px',
  border: '1px solid $border',
});

const Tab = styled('button', {
  padding: '6px 16px',
  borderRadius: '8px',
  border: 'none',
  fontSize: '$2',
  fontWeight: 700,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  color: '$gray',
  background: 'transparent',

  variants: {
    active: {
      true: {
        background: '$orange',
        color: '$white',
      },
    },
  },

  '&:hover': {
    color: '$white',
    background: 'rgba(200, 121, 65, 0.2)',
  },
});

const ArchiveSelect = styled('select', {
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  color: '$white',
  border: '1px solid $border',
  borderRadius: '8px',
  padding: '6px 12px',
  fontSize: '$2',
  outline: 'none',
  cursor: 'pointer',
});

const NewsGrid = styled('div', {
  display: 'grid',
  gap: '$4',
  gridTemplateColumns: '1fr',
  '@bp2': { gridTemplateColumns: '1fr 1fr' },
});

const NewsCard = styled('div', {
  background: 'rgba(255, 255, 255, 0.03)',
  backdropFilter: 'blur(12px)',
  border: '1px solid $border',
  borderRadius: '20px',
  padding: '$4',
  transition: 'all 0.3s ease',
  animation: `${slideUp} 0.6s ease-out forwards`,
  display: 'flex',
  flexDirection: 'column',

  '&:hover': {
    background: 'rgba(255, 255, 255, 0.08)',
    borderColor: '$orange',
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
  },
});

const CardHeader = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: '$3',
});

const SourceTag = styled('span', {
  fontSize: '10px',
  backgroundColor: '$orangeDark',
  color: '$white',
  padding: '2px 8px',
  borderRadius: '4px',
  fontWeight: 800,
  textTransform: 'uppercase',
});

const CardTitle = styled('h4', {
  fontSize: '$4',
  fontWeight: 700,
  color: '$white',
  marginBottom: '$3',
  lineHeight: 1.3,
});

const CardBlob = styled('p', {
  fontSize: '$3',
  color: '$gray',
  marginBottom: '$4',
  lineHeight: 1.5,
  flex: 1,
});

const HighlightsList = styled('ul', {
  listStyle: 'none',
  padding: 0,
  margin: '0 0 $4 0',
});

const Highlight = styled('li', {
  fontSize: '$2',
  color: '$white',
  display: 'flex',
  alignItems: 'flex-start',
  gap: '$2',
  marginBottom: '$2',
  opacity: 0.9,

  '&:before': {
    content: '"•"',
    color: '$orange',
    fontWeight: 'bold',
  },
});

const CardFooter = styled('div', {
  borderTop: '1px solid $border',
  paddingTop: '$3',
  marginTop: 'auto',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const ReadMore = styled('a', {
  color: '$orange',
  fontSize: '$2',
  fontWeight: 700,
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  '&:hover': { textDecoration: 'underline' },
});

const LoadMoreButton = styled('button', {
  gridColumn: '1 / -1',
  margin: '$6 auto',
  padding: '12px 32px',
  background: 'transparent',
  color: '$white',
  border: '1px solid $border',
  borderRadius: '100px',
  fontSize: '$2',
  fontWeight: 700,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',

  '&:hover': {
    background: '$white',
    borderColor: '$white',
    color: '#000000 !important',
    '& *': { color: '#000000 !important' },
  },

  '&:disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
});

const HeaderWrapper = styled('div', {
  marginBottom: '40px',
  borderBottom: '1px solid rgba(232, 201, 126, 0.2)',
  paddingBottom: '20px',
});

export default function NewsletterFeed() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [archiveDates, setArchiveDates] = useState<{ date: string }[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'latest' | 'archive'>('latest');
  const [mounted, setMounted] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setMounted(true);
    // Fetch latest news
    fetchNews();
    // Fetch archive dates
    fetch('/api/news?type=archive_dates')
      .then(res => res.json())
      .then(data => Array.isArray(data) && setArchiveDates(data));
  }, []);

  const fetchNews = (date?: string, p = 1, append = false) => {
    if (append) setLoadingMore(true);
    else setLoading(true);

    const url = date 
      ? `/api/news?date=${date}&page=${p}&limit=10` 
      : `/api/news?page=${p}&limit=10`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          if (append) setNews(prev => [...prev, ...data]);
          else setNews(data);
          
          setHasMore(data.length === 10);
        } else {
          if (!append) setNews([]);
          setHasMore(false);
        }
        setLoading(false);
        setLoadingMore(false);
      })
      .catch(() => {
        setLoading(false);
        setLoadingMore(false);
      });
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchNews(selectedDate, nextPage, true);
  };

  const handleTabChange = (tab: 'latest' | 'archive') => {
    setActiveTab(tab);
    setPage(1);
    if (tab === 'latest') {
      setSelectedDate('');
      fetchNews(undefined, 1);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const date = e.target.value;
    setSelectedDate(date);
    setPage(1);
    if (date) {
      setActiveTab('archive');
      fetchNews(date, 1);
    }
  };

  if (!mounted) {
    return (
      <Container id="archive">
        <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: '#666' }}>Initializing Intelligence Feed...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container id="archive">
      <HeaderWrapper>
        <Header>
          <SectionTitle>
            <Clock size={24} /> Recent Intel
          </SectionTitle>
          <TabGroup>
            <Tab 
              active={activeTab === 'latest'} 
              onClick={() => handleTabChange('latest')}
            >
              Latest Pulse
            </Tab>
            <ArchiveSelect 
              onChange={handleDateChange} 
              value={selectedDate}
              style={{ display: archiveDates.length > 0 ? 'block' : 'none' }}
            >
              <option value="">Previous Scraps</option>
              {archiveDates.map(d => (
                <option key={d.date} value={d.date}>{d.date}</option>
              ))}
            </ArchiveSelect>
          </TabGroup>
        </Header>
        {archiveDates.length === 0 && !loading && (
          <p style={{ fontSize: '12px', color: '$gray', opacity: 0.6 }}>No historical records found yet.</p>
        )}
      </HeaderWrapper>

      <NewsGrid>
        {loading ? (
          <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '$gray' }}>Loading intelligence...</p>
        ) : Array.isArray(news) && news.length > 0 ? (
          news.map((item, idx) => (
            <NewsCard key={item.id} style={{ animationDelay: `${idx * 0.1}s` }}>
              <CardHeader>
                <SourceTag>{item.source}</SourceTag>
                <Hash size={14} color="#C87941" />
              </CardHeader>
              <CardTitle>{item.title}</CardTitle>
              <CardFooter>
                <ReadMore href={item.link} target="_blank">
                  Visit Source <ExternalLink size={14} />
                </ReadMore>
              </CardFooter>
            </NewsCard>
          ))
        ) : (
          <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '$gray' }}>
            No news found for this period.
          </p>
        )}

        {hasMore && news.length > 0 && (
          <LoadMoreButton onClick={handleLoadMore} disabled={loadingMore}>
            {loadingMore ? 'Fetching More...' : (
              <>
                Load More Content <ArrowRight size={16} />
              </>
            )}
          </LoadMoreButton>
        )}
      </NewsGrid>
    </Container>
  );
}
