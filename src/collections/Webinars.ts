import { CollectionConfig } from 'payload'

export const Webinars: CollectionConfig = {
  slug: 'webinars',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'updatedAt'],
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
      name: 'dates',
      type: 'array',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'startDate',
              label: 'Start',
              type: 'date',
              required: true,
              admin: {
                date: {
                  pickerAppearance: 'dayAndTime',
                  displayFormat: 'dd.MM.yyyy HH:mm',
                  timeFormat: 'HH:mm',
                },
                width: '50%',
              },
            },
            {
              name: 'endDate',
              label: 'End',
              type: 'date',
              required: true,
              admin: {
                date: {
                  pickerAppearance: 'dayAndTime',
                  displayFormat: 'dd.MM.yyyy HH:mm',
                  timeFormat: 'HH:mm',
                },
                width: '50%',
              },
            },
          ],
        },
      ],
    },
  ],
}
