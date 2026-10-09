import { defineField, defineType } from 'sanity'

const tileFields = (defaults: { title: string; tagline: string; link: string }) => [
  defineField({
    name: 'title',
    title: 'Title',
    type: 'string',
    initialValue: defaults.title,
  }),
  defineField({
    name: 'tagline',
    title: 'Tagline',
    type: 'string',
    description: 'Chhoti line title ke neeche, e.g. "Everyday essentials"',
    initialValue: defaults.tagline,
  }),
  defineField({
    name: 'image',
    title: 'Image (Desktop)',
    type: 'image',
    options: { hotspot: true },
    description: 'Wide crop, recommended: 1200x600px',
  }),
  defineField({
    name: 'mobileImage',
    title: 'Image (Mobile)',
    type: 'image',
    options: { hotspot: true },
    description: 'Optional. Agar khali ho to desktop image use hogi',
  }),
  defineField({
    name: 'link',
    title: 'Link',
    type: 'string',
    initialValue: defaults.link,
  }),
]

export const hero = defineType({
  name: 'hero',
  title: 'Hero Section',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Main Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'desktopImages',
      title: 'Desktop Images (Landscape - Multiple)',
      description: 'Add multiple images for carousel. Recommended: 1920x1080px',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
            },
          ],
        },
      ],
      validation: (rule) => rule.required().min(1).error('At least one desktop image is required'),
    }),
    defineField({
      name: 'mobileImages',
      title: 'Mobile Images (Portrait - Multiple)',
      description: 'Add multiple images for mobile carousel. Recommended: 1080x1920px',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
            },
          ],
        },
      ],
      validation: (rule) => rule.required().min(1).error('At least one mobile image is required'),
    }),
    defineField({
      name: 'primaryButtonText',
      title: 'Primary Button Text',
      type: 'string',
      initialValue: 'Shop Now',
    }),
    defineField({
      name: 'primaryButtonLink',
      title: 'Primary Button Link',
      type: 'string',
      initialValue: '/shop',
    }),
    defineField({
      name: 'secondaryButtonText',
      title: 'Secondary Button Text',
      type: 'string',
      initialValue: 'Learn More',
    }),
    defineField({
      name: 'secondaryButtonLink',
      title: 'Secondary Button Link',
      type: 'string',
      initialValue: '/about',
    }),
    defineField({
      name: 'overlayColor',
      title: 'Overlay Color',
      type: 'string',
      initialValue: '#950606',
      description: 'Hex color for gradient overlay',
    }),
    defineField({
      name: 'overlayOpacity',
      title: 'Overlay Opacity',
      type: 'number',
      initialValue: 0.4,
      validation: (rule) => rule.min(0).max(1),
    }),
    defineField({
      name: 'originalsTile',
      title: 'Bottom Tile (Left): Thrivers Originals',
      type: 'object',
      fields: tileFields({
        title: 'Thrivers Originals',
        tagline: 'Built for the ones who go further',
        link: '/shop?origin=thrivers',
      }),
    }),
    defineField({
      name: 'chitralTile',
      title: 'Bottom Tile (Right): Chitral Special',
      type: 'object',
      fields: tileFields({
        title: 'Chitral Special',
        tagline: 'Handcrafted in the valley',
        link: '/shop?origin=chitral-special',
      }),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'desktopImages.0',
    },
  },
})
