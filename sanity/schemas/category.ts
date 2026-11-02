import { defineField, defineType } from 'sanity'

export const category = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'origin',
      title: 'Product Line',
      description: 'Existing categories without an origin are treated as Thrivers.',
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
        'Lower numbers appear first. Categories without an order appear after ordered categories, sorted by name.',
      type: 'number',
      validation: (rule) => rule.integer().min(0),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
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
      type: 'text',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
    }),
  ],
})