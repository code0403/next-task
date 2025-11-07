import { CollectionConfig } from 'payload'

export const Seminars: CollectionConfig = {
  slug: 'seminars',
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
      name: 'color',
      type: 'select',
      hasMany: true,
      required: true,
      admin: {
        position: 'sidebar',
      },
      options: [
        {
          label: 'Red',
          value: 'red',
        },
        {
          label: 'Green',
          value: 'green',
        },
        {
          label: 'Blue',
          value: 'blue',
        },
        {
          label: 'Yellow',
          value: 'yellow',
        },
        {
          label: 'Orange',
          value: 'orange',
        },
      ],
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
