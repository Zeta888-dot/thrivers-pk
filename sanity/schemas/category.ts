import { defineField, defineType } from 'sanity'

export const category = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      description:
        'Category ka naam. Ye "Shop by Category" cards, Shop ke category filter aur product page par dikhta hai.',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'origin',
      title: 'Product Line',
      description:
        'Ye category "Thrivers Originals" ki hai ya "Chitral Special" ki. Purani categories bina origin ke Thrivers count hoti hain.',
      type: 'string',
      options: {
        list: [
          { title: 'Thrivers', value: 'thrivers' },
          { title: 'Chitral Special', value: 'chitral_special' },
        ],
        layout: 'radio',
      },
      initialValue: 'thrivers',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Order',
      description:
        'Chhota number pehle aata hai. Homepage aur Studio dono mein categories isi tarteeb mein dikhti hain. Khali chhorne par naam ke hisaab se sort hoti hain (ordered categories ke baad).',
      type: 'number',
      validation: (rule) => rule.integer().min(0),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      description:
        'URL ka hissa (e.g. /shop?category=hoodies). "Generate" dabao — naam se khud ban jayega.',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      description:
        'Optional short description. Filhaal website par nahi dikhti — sirf admin ke reference ke liye.',
      type: 'text',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      description:
        'Homepage ke "Shop by Category" card mein lagti hai. Khali chhorne par neutral placeholder dikhta hai. Landscape ya portrait dono chalega (card crop karta hai).',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Image ka chhota description (accessibility aur SEO ke liye).',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      origin: 'origin',
      order: 'order',
      media: 'image',
    },
    prepare({ title, origin, order, media }) {
      return {
        title,
        subtitle: `${origin === 'chitral_special' ? 'Chitral Special' : 'Thrivers Originals'}${
          typeof order === 'number' ? ` · #${order}` : ''
        }`,
        media,
      }
    },
  },
})
