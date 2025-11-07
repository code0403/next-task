import { CollectionConfig } from 'payload'

export const PodcastEpisodes: CollectionConfig = {
  slug: 'podcast-episodes',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'pubDate', 'status', 'updatedAt'],
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'podigeeGuid',
      label: 'Podigee GUID',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'pubDate',
      label: 'Publication Date',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
          displayFormat: 'yyyy-MM-dd HH:mm:ss',
          timeFormat: 'HH:mm:ss',
        },
      },
    },
    {
      name: 'link',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
  ],
}
