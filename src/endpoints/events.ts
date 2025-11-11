import type { Endpoint } from 'payload'

export const eventsEndpoint: Endpoint = {
  path: '/events',
  method: 'get',
  handler: async (args: any) => {
    const { req, res, payload } = args
    try {
       
      const now = new Date();

      // Fetching upcoming events directly at query level
      const events = await payload.find({
        collection: "events",
        where: {
          date: {
            greater_than: now,
          },
        },
        sort: "date",
      });

      res.status(200).json({
          success: true,
        message: 'Upcoming events fetched successfully',
        count: events.totalDocs,
        events: events.docs,
      })
      return res
    } catch (error) {
      payload.logger.error('Error fetching events:', error)
      res.status(500).json({ success: false, message: 'Failed to fetch events' })
      return res
    }
  },
}
