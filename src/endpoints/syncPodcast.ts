import type { Endpoint } from 'payload';
import payload from 'payload';
import Parser from 'rss-parser';

const parser = new Parser();

export const syncPodcastEndpoint: Endpoint = {
  path: '/sync-podcast-episodes',
  method: 'post',
  handler: async (...args: any[]) => {
    const req = args[0];
    const res = args[1];
    try {
      const rssFeedUrl =
        'https://feeds.npr.org/510289/podcast.xml'; //an temp url

      
      try {
        new URL(rssFeedUrl);
      } catch {
        payload.logger.error(`Invalid RSS feed URL: ${rssFeedUrl}`);
        return res.status(400).json({ error: 'Invalid RSS feed URL' });
      }

    
      const feed = await parser.parseURL(rssFeedUrl);
      if (!feed || !feed.items?.length) {
        payload.logger.warn('No podcast items found in the feed.');
        return res.status(200).json({ message: 'No podcast episodes found in feed.' });
      }

      let createdCount = 0;
      let skippedCount = 0;

      for (const item of feed.items) {
        const title = item.title?.trim() || '';
        const link = item.link || '';
        const guid = item.guid || '';

        if (!title || !link || !guid) {
          payload.logger.warn(`Skipping episode missing title or audio URL.`);
          continue;
        }

        // Validate episode URL
        try {
          new URL(link);
        } catch {
          payload.logger.warn(`Invalid episode URL: ${link}`);
          continue;
        }

        // Check if this episode already exists
        const existing = await payload.find({
          collection: 'podcast-episodes',
          where: {
            podigeeGuid: { equals: guid },
          },
          limit: 1,
        });

        if (existing.docs.length > 0) {
          skippedCount++;
          continue;
        }

        await payload.create({
          collection: 'podcast-episodes',
          data: {
            title,
            podigeeGuid: guid,
            link,
            description: item.contentSnippet || '',
            pubDate: item.pubDate || new Date().toISOString(),
          },
        });

        createdCount++;
      }

      payload.logger.info(`Sync complete. Created: ${createdCount}, Skipped: ${skippedCount}`);
      return res.status(200).json({
        message: 'Podcast episodes synced successfully',
        created: createdCount,
        skipped: skippedCount,
      });
    } catch (error) {
      payload.logger.error(`Error syncing podcast episodes: ${(error as Error).message}`);
      return res.status(500).json({ error: 'Failed to sync podcast episodes' });
    }
  },
};
