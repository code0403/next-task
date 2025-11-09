import { NextRequest, NextResponse } from 'next/server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Parser from 'rss-parser'

export const POST = async (req: NextRequest) => {
    try {
        // const authHeader = req.headers.get('authorization')
        // const token = authHeader?.split(' ')[1]

        // if (token !== process.env.API_SECRET_TOKEN) {
        //     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        // }

        const payload = await getPayload({ config: configPromise })

        const { user } = await payload.auth({ headers: req.headers })
        // console.log('Authenticated user:', user)

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }


        const { feedUrl } = await req.json()

        if (!feedUrl) {
            return NextResponse.json({ error: 'feedUrl is required' }, { status: 400 })
        }

        const parser = new Parser()
        const feed = await parser.parseURL(feedUrl)

        const episodes = feed.items || []
        if (episodes.length === 0) {
            return NextResponse.json({ message: 'No episodes found in RSS feed.' }, { status: 200 })
        }

        // Fetch all existing episodes
        const existing = await payload.find({
            collection: 'podcast-episodes',
            limit: 1000,
            where: {
                podigeeGuid: { exists: true },
            },
        })

        const existingGuids = new Set(existing.docs.map((ep) => ep.podigeeGuid))

        const newEpisodes = []

        for (const item of episodes) {
            const guid = item.guid || item.id
            if (!guid || existingGuids.has(guid)) continue

            const episodeData = {
                title: item.title || 'Untitled Episode',
                podigeeGuid: guid,
                pubDate: item.pubDate ? new Date(item.pubDate) : new Date(),
                link: item.link || '',
                description: item.contentSnippet || item.content || '',
                _status: 'published',
            }

            const created = await payload.create({
                collection: 'podcast-episodes',
                data: episodeData,
            })

            newEpisodes.push(created)
        }

        return NextResponse.json({
            message: `${newEpisodes.length} new episodes added.`,
            newEpisodes,
        })
    } catch (err: any) {
        console.error('Error syncing podcast feed:', err)
        return NextResponse.json(
            { error: 'Failed to sync podcast feed', details: err.message },
            { status: 500 },
        )
    }
}
