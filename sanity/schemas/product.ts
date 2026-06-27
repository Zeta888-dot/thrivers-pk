import { defineField, defineType } from 'sanity'

export const product = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
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
      rows: 3,
    }),
    defineField({
      name: 'price',
      title: 'Current Price',
      type: 'number',
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: 'compareAtPrice',
      title: 'Original Price (Compare At)',
      type: 'number',
      description: 'Show this price crossed out to display a discount',
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{ type: 'image' }],
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
    }),
    defineField({
      name: 'colors',
      title: 'Colors',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'sizes',
      title: 'Sizes',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'stock',
      title: 'Stock Status',
      type: 'string',
      options: {
        list: [
          { title: 'In Stock', value: 'in_stock' },
          { title: 'Low Stock', value: 'low_stock' },
          { title: 'Out of Stock', value: 'out_of_stock' },
          { title: 'Sold Out', value: 'sold_out' },
        ],
        layout: 'radio',
      },
      initialValue: 'in_stock',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'stockQuantity',
      title: 'Quantity Available',
      type: 'number',
      description: 'Number of items in stock',
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    }),
  ],
  preview: {
    select: {
      title: 'name',
      price: 'price',
      compareAtPrice: 'compareAtPrice',
      stock: 'stock',
      media: 'images[0]',
    },
    prepare(selection) {
      const { title, price, compareAtPrice, stock, media } = selection
      const discount = compareAtPrice && price ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100) : null
      const stockLabel = stock === 'in_stock' ? '✓' : stock === 'low_stock' ? '⚠' : '✗'
      
      return {
        title,
        subtitle: `PKR ${price}${discount ? ` (-${discount}%)` : ''} ${stockLabel}`,
        media,
      }
    },
  },
})