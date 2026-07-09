import { defineField, defineType } from 'sanity'

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
  ],
  preview: {
    select: {
      title: 'title',
      media: 'desktopImages.0',
    },
  },
})