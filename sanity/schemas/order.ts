import { defineField, defineType } from 'sanity'

export const order = defineType({
  name: 'order',
  title: 'Order',
  type: 'document',
  fields: [
    defineField({ name: 'orderId', title: 'Order ID', type: 'string' }),
    defineField({ name: 'customerName', title: 'Customer Name', type: 'string' }),
    defineField({ name: 'phone', title: 'Phone Number', type: 'string' }),
    defineField({ name: 'altPhone', title: 'Alternative Phone Number', type: 'string' }),
    defineField({ name: 'email', title: 'Email Address', type: 'string' }),
    defineField({ name: 'address', title: 'Delivery Address', type: 'text' }),
    defineField({ name: 'city', title: 'City', type: 'string' }),
    defineField({ name: 'postalCode', title: 'Postal Code', type: 'string' }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'productName', type: 'string', title: 'Product Name' },
          { name: 'quantity', type: 'number', title: 'Quantity' },
          { name: 'price', type: 'number', title: 'Price' },
        ]
      }]
    }),
    defineField({ name: 'totalAmount', title: 'Total Amount', type: 'number' }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: { list: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], layout: 'radio' },
      initialValue: 'Pending',
    }),
    defineField({
      name: 'paymentMethod',
      title: 'Payment Method',
      type: 'string',
      options: { list: ['Cash on Delivery', 'WhatsApp Order'], layout: 'radio' },
    }),
  ],
})