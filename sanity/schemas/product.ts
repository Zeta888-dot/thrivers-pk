import { defineField, defineType } from 'sanity'

export const product = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      description: 'Product ka naam. Ye product cards, product page aur search mein dikhta hai.',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      description: 'URL ka hissa (e.g. /product/black-hoodie). "Generate" dabao — naam se khud ban jayega.',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'origin',
      title: 'Product Line',
      description:
        'Ye product "Thrivers Originals" mein jayega ya "Chitral Special" mein. Homepage ke sections aur Shop filters isi se bante hain.',
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
      name: 'description',
      title: 'Product Description',
      type: 'array',
      description:
        'Product page ke "Description & Size Chart" section mein dikhta hai. Bold, list aur headings use kar sakte hain.',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Heading', value: 'h2' },
            { title: 'Subheading', value: 'h3' },
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Number', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Underline', value: 'underline' },
            ],
          },
        },
      ],
    }),
    defineField({
      name: 'price',
      title: 'Current Price (Rs.)',
      description:
        'Aaj ki selling price. Product card aur product page par ye price dikhti hai. Sirf number likhein, e.g. 2500.',
      type: 'number',
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: 'compareAtPrice',
      title: 'Original Price (Compare At)',
      description:
        'Purani price. Agar ye Current Price se zyada ho to price crossed out dikhegi, card par "Sale" badge aayega aur product homepage ke "On Sale" section mein chala jayega. Sale na ho to khali chhor dein.',
      type: 'number',
      validation: (rule) =>
        rule.min(0).custom((value, context) => {
          const price = (context.document?.price as number | undefined) ?? 0
          if (typeof value === 'number' && value > 0 && value <= price) {
            return 'Compare-at price current price se zyada honi chahiye, warna discount nahi dikhega.'
          }
          return true
        }),
    }),
    defineField({
      name: 'images',
      title: 'Images',
      description:
        'Product ki images. Pehli image card par main image hoti hai; baqi product page aur hover par dikhti hain. Kam az kam 1 image daalein.',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'category',
      title: 'Category',
      description:
        'Product kis category mein hai. Sirf isi Product Line ki categories list mein aati hain. Shop aur "Shop by Category" isi se filter hota hai.',
      type: 'reference',
      to: [{ type: 'category' }],
      options: {
        filter: ({ document }) => ({
          filter: 'coalesce(origin, "thrivers") == $origin',
          params: { origin: (document?.origin as string | undefined) || 'thrivers' },
        }),
      },
    }),
    defineField({
      name: 'colors',
      title: 'Colors',
      description:
        'Available colors ke naam (e.g. Black, White, Olive). Product page par color swatches ban jate hain.',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'sizes',
      title: 'Sizes',
      description:
        'Available sizes (e.g. S, M, L). Product page aur quick view par size buttons ban jate hain. Koi size na ho to size selector nahi dikhega.',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'unavailableSizes',
      title: 'Out of Stock Sizes',
      description:
        'Jo sizes khatam hain wo yahan select karein. Website par ye sizes line ke sath disabled dikhenge aur select nahi ho sakenge.',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'S', value: 'S' },
          { title: 'M', value: 'M' },
          { title: 'L', value: 'L' },
          { title: 'XL', value: 'XL' },
          { title: 'XXL', value: 'XXL' },
        ],
        layout: 'grid',
      },
    }),
    defineField({
      name: 'stock',
      title: 'Stock Status',
      description:
        'Website par stock label set karta hai. "Out of Stock" ya "Sold Out" par product card par "Sold out" pill aata hai aur Add to cart band ho jata hai.',
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
      description:
        'Kitne pieces bache hain. 0 likhne par product khud "Sold out" ho jata hai aur sizes disable ho jate hain. Khali chhor dein to sirf Stock Status mana jayega.',
      type: 'number',
      validation: (rule) => rule.min(0).integer(),
    }),
    defineField({
      name: 'featured',
      title: 'Featured on Homepage',
      description:
        'ON karne par product homepage ke "Best Sellers" section mein sabse pehle dikhta hai. Agar koi product featured na ho to naye products automatically dikhte hain.',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'badges',
      title: 'Product Badges',
      description:
        'Card par dikhne wale badges. "New Arrival" homepage ke "New Drops" section ko chalata hai; "Best Seller" shop ke Best selling sort mein upar rakhta hai; "Sale" badge discount par khud lag jata hai.',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'New Arrival (New Drops section)', value: 'New Arrival' },
          { title: 'Best Seller', value: 'Best Seller' },
          { title: 'Sale', value: 'Sale' },
          { title: 'Trending', value: 'Trending' },
          { title: 'Limited Edition', value: 'Limited Edition' },
        ],
        layout: 'list',
      },
    }),
    defineField({
      name: 'collections',
      title: 'Collections',
      description:
        'Marketing collections. Shop page ke "Collections" filter mein ye values dikhti hain. Ek product multiple collections mein ho sakta hai.',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Summer Collection', value: 'Summer Collection' },
          { title: 'Winter Collection', value: 'Winter Collection' },
          { title: 'Streetwear', value: 'Streetwear' },
          { title: 'Formal Wear', value: 'Formal Wear' },
          { title: 'Accessories', value: 'Accessories' },
        ],
        layout: 'list',
      },
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      description:
        'Search keywords (e.g. hoodie, oversized, winter). Shop page aur header search in tags par bhi match karta hai — product ke naam ke ilawa.',
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
      origin: 'origin',
      media: 'images.0',
    },
    prepare({ title, origin, media }) {
      return {
        title,
        subtitle: origin === 'chitral_special' ? 'Chitral Special' : 'Thrivers Originals',
        media,
      }
    },
  },
})
