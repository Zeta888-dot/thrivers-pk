import { NextResponse } from 'next/server'
import { createClient } from 'next-sanity'
import { Resend } from 'resend'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'l9jivley',
  dataset: 'production',
  apiVersion: '2026-06-28',
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
  useCdn: false,
})

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { customerName, phone, altPhone, email, address, city, postalCode, items, totalAmount, paymentMethod } = body

    // 1. Save to Sanity
    const order = await client.create({
      _type: 'order',
      orderId: `ORD-${Date.now()}`,
      customerName,
      phone,
      altPhone,
      email,
      address,
      city,
      postalCode,
      items: items.map((item: any) => ({
        _key: Math.random().toString(36).substr(2, 9),
        productName: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.images?.[0] || '',
      })),
      totalAmount,
      paymentMethod,
      status: 'Pending',
    }, {
      autoGenerateArrayKeys: true,
    })

    // 2. WhatsApp Notification
    const WHATSAPP_NUMBER = "923453944210" // Tumhara number
    const whatsappMessage = `*🛍️ NEW ORDER - Thrivers PK*%0A%0A*Order ID:* ${order.orderId}%0A*Customer:* ${customerName}%0A*Phone:* ${phone}%0A${altPhone ? `*Alt Phone:* ${altPhone}%0A` : ''}*City:* ${city}%0A*Address:* ${address}%0A%0A*Items:*%0A${items.map((i: any) => `- ${i.name} (x${i.quantity}) - PKR ${i.price * i.quantity}`).join('%0A')}%0A%0A*Total: PKR ${totalAmount}*%0A*Payment:* ${paymentMethod}`
    
    // WhatsApp link generate karo (ye backend mein open nahi hoga, frontend par handle hoga)

    // 3. Email Notification
    const itemsList = items.map((item: any) => `
      <div style="border-bottom: 1px solid #eee; padding: 10px 0; display: flex; gap: 15px;">
        ${item.images?.[0] ? `<img src="${item.images[0]}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;" />` : ''}
        <div>
          <strong>${item.name}</strong><br/>
          Quantity: ${item.quantity} × PKR ${item.price}<br/>
          <strong>Total: PKR ${item.price * item.quantity}</strong>
        </div>
      </div>
    `).join('')

    await resend.emails.send({
      from: 'Thrivers PK <orders@resend.dev>',
      to: ['zahidazam714@gmail.com'],
      subject: `New Order ${order.orderId} - PKR ${totalAmount}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #950606;">🛍️ New Order Received!</h1>
          
          <div style="background: #f9f9f9; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h2>Order Details</h2>
            <p><strong>Order ID:</strong> ${order.orderId}</p>
            <p><strong>Payment Method:</strong> ${paymentMethod}</p>
          </div>

          <div style="background: #f9f9f9; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h2>Customer Information</h2>
            <p><strong>Name:</strong> ${customerName}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            ${altPhone ? `<p><strong>Alt Phone:</strong> ${altPhone}</p>` : ''}
            ${email ? `<p><strong>Email:</strong> ${email}</p>` : ''}
            <p><strong>City:</strong> ${city}</p>
            <p><strong>Address:</strong> ${address}</p>
            ${postalCode ? `<p><strong>Postal Code:</strong> ${postalCode}</p>` : ''}
          </div>

          <div style="background: #f9f9f9; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h2>Items Ordered</h2>
            ${itemsList}
            <div style="text-align: right; margin-top: 20px; font-size: 20px; font-weight: bold; color: #950606;">
              Total: PKR ${totalAmount}
            </div>
          </div>

          <p style="text-align: center; color: #666; margin-top: 30px;">
            This order was placed on Thrivers PK
          </p>
        </div>
      `,
    })

    return NextResponse.json({ 
      success: true, 
      orderId: order.orderId,
      whatsappLink: `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`
    })
  } catch (error) {
    console.error("Checkout error:", error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}