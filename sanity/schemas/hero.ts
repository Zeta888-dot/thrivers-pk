import { defineField, defineType } from 'sanity'

const tileFields = (defaults: { title: string; tagline: string; link: string }) => [
  defineField({
    name: 'title',
    title: 'Title',
    description: 'Hero ke neeche wale tile ka bara title.',
    type: 'string',
    initialValue: defaults.title,
  }),
  defineField({
    name: 'tagline',
    title: 'Tagline',
    description: 'Chhoti line title ke upar, e.g. "Everyday essentials".',
    type: 'string',
    initialValue: defaults.tagline,
  }),
  defineField({
    name: 'body',
    title: 'Body',
    type: 'text',
    rows: 3,
    description: 'Optional. 2–3 short lines title ke neeche.',
  }),
  defineField({
    name: 'image',
    title: 'Image',
    type: 'image',
    options: { hotspot: true },
    description: 'Tile image. Hotspot crop desktop aur mobile dono par use hota hai.',
    fields: [
      defineField({
        name: 'alt',
        title: 'Alt Text',
        type: 'string',
        description: 'Image ka description (accessibility aur SEO ke liye).',
      }),
    ],
    validation: (rule) => rule.required(),
  }),
  defineField({
    name: 'link',
    title: 'Link',
    description: 'Tile par click karne par kahan jaye, e.g. /shop?origin=chitral_special.',
    type: 'string',
    initialValue: defaults.link,
  }),
  defineField({
    name: 'overlayOpacity',
    title: 'Overlay Opacity (%)',
    description: '0 = koi dark overlay nahi, 100 = solid black. Text readable rakhne ke liye 50–80 rakhein.',
    type: 'number',
    initialValue: 70,
    validation: (rule) => rule.min(0).max(100),
  }),
]

const collectionCardFields = (defaults: { title: string; subtitle: string; link: string }) => [
  defineField({
    name: 'title',
    title: 'Title',
    description: '"Shop by Category" card ka title. Khali chhorne par default title dikhega.',
    type: 'string',
    initialValue: defaults.title,
  }),
  defineField({
    name: 'subtitle',
    title: 'Subtitle',
    description: 'Title ke upar chhoti uppercase line, e.g. "Thrivers Originals".',
    type: 'string',
    initialValue: defaults.subtitle,
  }),
  defineField({
    name: 'image',
    title: 'Image',
    description:
      'Card ki image (hotspot crop). Khali chhore to hero ke neeche wale tile ki image use hogi; wo bhi na ho to neutral dark block dikhega.',
    type: 'image',
    options: { hotspot: true },
    fields: [
      defineField({
        name: 'alt',
        title: 'Alt Text',
        type: 'string',
        description: 'Image ka description (accessibility aur SEO ke liye).',
      }),
    ],
  }),
  defineField({
    name: 'link',
    title: 'Link',
    description: 'Card par click karne par kahan jaye. Khali chhorne par collection ka shop URL use hota hai.',
    type: 'string',
    initialValue: defaults.link,
  }),
  defineField({
    name: 'comingSoon',
    title: 'Coming Soon',
    description:
      'ON karne par card par "Coming soon" badge dikhta hai. Chitral Special khud bhi coming soon ho jata hai jab us mein 0 products hon.',
    type: 'boolean',
    initialValue: false,
  }),
  defineField({
    name: 'badgeText',
    title: 'Badge Text',
    description: 'Optional custom badge, e.g. "Coming soon" ya "New". Coming Soon ON ho to ye text use hota hai.',
    type: 'string',
  }),
]

export const hero = defineType({
  name: 'hero',
  title: 'Hero Section',
  type: 'document',
  groups: [
    { name: 'content', title: 'Hero content', default: true },
    { name: 'tiles', title: 'Bottom tiles' },
    { name: 'collectionCards', title: 'Shop by Category cards' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Main Title',
      description:
        'Hero image ke upar bara title (mobile aur desktop dono par). Khali chhorne par sirf image dikhegi.',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      description: 'Title ke neeche chhoti line.',
      type: 'text',
      rows: 2,
      group: 'content',
    }),
    defineField({
      name: 'desktopImages',
      title: 'Desktop Images (Landscape - Multiple)',
      description:
        'Desktop hero carousel ki images. Multiple images daalein to arrows aur dots se slider ban jata hai. Recommended: 1920x1080px.',
      type: 'array',
      group: 'content',
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
      description:
        'Mobile hero carousel ki images. Recommended: 1080x1920px. Mobile par sirf ye dikhti hain, is liye kam az kam 1 zaroori hai.',
      type: 'array',
      group: 'content',
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
      description: 'Hero par pehla (solid) button ka text. Khali chhorne par button nahi dikhta.',
      type: 'string',
      group: 'content',
      initialValue: 'Shop Now',
    }),
    defineField({
      name: 'primaryButtonLink',
      title: 'Primary Button Link',
      description: 'Primary button kahan le jaye, e.g. /shop.',
      type: 'string',
      group: 'content',
      initialValue: '/shop',
    }),
    defineField({
      name: 'secondaryButtonText',
      title: 'Secondary Button Text',
      description: 'Hero par doosre (outline) button ka text. Khali chhorne par button nahi dikhta.',
      type: 'string',
      group: 'content',
      initialValue: 'Learn More',
    }),
    defineField({
      name: 'secondaryButtonLink',
      title: 'Secondary Button Link',
      description: 'Secondary button kahan le jaye, e.g. /about.',
      type: 'string',
      group: 'content',
      initialValue: '/about',
    }),
    defineField({
      name: 'overlayColor',
      title: 'Overlay Color',
      description:
        'Optional hex color for a tint over the whole hero image, e.g. #000000. Khali chhorein to koi color overlay nahi lagega (sirf neeche halka black gradient rehta hai).',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'overlayOpacity',
      title: 'Overlay Opacity',
      description: 'Overlay ki shade: 0 = koi overlay nahi, 1 = poori solid. Sirf tab lagta hai jab Overlay Color bhara ho.',
      type: 'number',
      group: 'content',
      initialValue: 0.4,
      validation: (rule) => rule.min(0).max(1),
    }),
    defineField({
      name: 'originalsTile',
      title: 'Bottom Tile (Left): Thrivers Originals',
      description: 'Hero ke neeche left tile. Ye "Shop by Category" card ki fallback image bhi hai.',
      type: 'object',
      group: 'tiles',
      fields: tileFields({
        title: 'Thrivers Originals',
        tagline: 'Built for the ones who go further',
        link: '/shop',
      }),
    }),
    defineField({
      name: 'chitralTile',
      title: 'Bottom Tile (Right): Chitral Special',
      description: 'Hero ke neeche right tile. Ye Chitral Special card ki fallback image bhi hai.',
      type: 'object',
      group: 'tiles',
      fields: tileFields({
        title: 'Chitral Special',
        tagline: 'Handcrafted in the valley',
        link: '/shop?origin=chitral_special',
      }),
    }),
    defineField({
      name: 'collectionCards',
      title: 'Shop by Category cards',
      description:
        'Homepage par hero ke bilkul neeche "Shop by Category" ke do bade collection cards. Image yahan se aati hai; khali ho to tile image, phir neutral dark block.',
      type: 'object',
      group: 'collectionCards',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: 'thrivers',
          title: 'Thrivers Collection Card',
          description: 'Left card (Thrivers Originals).',
          type: 'object',
          fields: collectionCardFields({
            title: 'Thrivers Originals',
            subtitle: 'Thrivers Originals',
            link: '/shop?origin=thrivers',
          }),
        }),
        defineField({
          name: 'chitral_special',
          title: 'Chitral Special Collection Card',
          description: 'Right card (Chitral Special).',
          type: 'object',
          fields: collectionCardFields({
            title: 'Chitral Special',
            subtitle: 'Handcrafted in the valley',
            link: '/shop?origin=chitral_special',
          }),
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'desktopImages.0',
    },
  },
})
