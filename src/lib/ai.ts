/**
 * AI Summarization module (Legacy)
 * Currently not in use for AI Digest as per user request for link-only feed.
 */
export async function summarizeNewsItem(item: any) {
  return {
    title: item.title,
    link: item.link,
    source: item.source,
    blob: '',
    highlights: []
  };
}
