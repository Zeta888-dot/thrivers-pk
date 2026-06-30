import { NextResponse } from 'next/server'
import { createClient } from 'next-sanity'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'l9jivley',
  dataset: 'production',
  apiVersion: '2026-06-28',
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
  useCdn: false,
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { customerName, phone, address, items, totalAmount, paymentMethod } = body

    const order = await client.create({
      _type: 'order',
      orderId: `ORD-${Date.now()}`,
      customerName,
      phone,
      address,
      items: items.map((item: any) => ({
        _type: 'object',
        productName: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount,
      paymentMethod,
    })

    return NextResponse.json({ success: true, orderId: order.orderId })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}