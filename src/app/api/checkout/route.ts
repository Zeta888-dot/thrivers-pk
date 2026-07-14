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

    console.log("Order received. Customer email:", email) // Debugging ke liye

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
        size: item.size || '',
        color: item.color || '',
        image: item.images?.[0] || '',
      })),
      totalAmount,
      paymentMethod,
      status: 'Pending',
    }, {
      autoGenerateArrayKeys: true,
    })

    // 2. WhatsApp Notification
    const WHATSAPP_NUMBER = "923439766306"
    const whatsappMessage = `*🛍️ NEW ORDER - Thrivers PK*%0A%0A*Order ID:* ${order.orderId}%0A*Customer:* ${customerName}%0A*Phone:* ${phone}%0A${altPhone ? `*Alt Phone:* ${altPhone}%0A` : ''}*City:* ${city}%0A*Address:* ${address}%0A%0A*Items:*%0A${items.map((i: any) => `- ${i.name} (x${i.quantity})%0A  Size: ${i.size || 'N/A'} | Color: ${i.color || 'N/A'}%0A  Price: PKR ${i.price * i.quantity}`).join('%0A')}%0A%0A*Total: PKR ${totalAmount}*%0A*Payment:* ${paymentMethod}`

    // 3. Admin Email Notification (to Thrivers)
    const itemsList = items.map((item: any) => `
      <div style="border-bottom: 1px solid #eee; padding: 10px 0; display: flex; gap: 15px;">
        ${item.images?.[0] ? `<img src="${item.images[0]}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;" />` : ''}
        <div>
          <strong>${item.name}</strong><br/>
          Quantity: ${item.quantity} × PKR ${item.price}<br/>
          ${item.size ? `<span style="color: #666;">Size: ${item.size}</span> | ` : ''}${item.color ? `<span style="color: #666;">Color: ${item.color}</span>` : ''}<br/>
          <strong>Total: PKR ${item.price * item.quantity}</strong>
        </a>
      </div>
    `).join('')

    await resend.emails.send({
      from: 'Thrivers PK <onboarding@resend.dev>', // ✅ Yahan change kiya hai
      to: ['sheikhinsaan07@gmail.com'],
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

    // 4. Customer Confirmation Email (if customer provided email)
    if (email && email.trim() !== '') {
      console.log("Sending confirmation email to:", email) // ✅ Debugging ke liye
      
      await resend.emails.send({
        from: 'Thrivers PK <onboarding@resend.dev>', // ✅ Yahan bhi change kiya hai
        to: [email],
        subject: `Order Confirmed! ${order.orderId} - Thrivers PK`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="text-align: center; padding: 30px 0; background: #950606; color: white; border-radius: 10px 10px 0 0;">
              <h1 style="margin: 0; font-size: 28px;">🎉 Thank You for Your Order!</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Your order has been confirmed</p>
            </div>
            <div style="padding: 30px; background: #fff; border: 1px solid #eee;">
              <p style="font-size: 16px; color: #333;">Hi <strong>${customerName}</strong>,</p>
              <p style="font-size: 16px; color: #333;">Thank you for shopping with <strong>Thrivers PK</strong>! We've received your order and will process it shortly.</p>
              
              <div style="background: #f9f9f9; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <h2 style="color: #950606; margin-top: 0;">Order Summary</h2>
                <p style="margin: 5px 0;"><strong>Order ID:</strong> ${order.orderId}</p>
                <p style="margin: 5px 0;"><strong>Payment Method:</strong> ${paymentMethod}</p>
                <p style="margin: 5px 0;"><strong>Total Amount:</strong> <span style="color: #950606; font-size: 18px; font-weight: bold;">PKR ${totalAmount}</span></p>
              </div>

              <div style="background: #f9f9f9; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <h2 style="color: #950606; margin-top: 0;">Items Ordered</h2>
                ${itemsList}
              </div>

              <div style="background: #f9f9f9; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <h2 style="color: #950606; margin-top: 0;">Delivery Details</h2>
                <p style="margin: 5px 0;"><strong>Name:</strong> ${customerName}</p>
                <p style="margin: 5px 0;"><strong>Phone:</strong> ${phone}</p>
                <p style="margin: 5px 0;"><strong>Address:</strong> ${address}, ${city} ${postalCode ? `- ${postalCode}` : ''}</p>
              </div>

              <div style="text-align: center; margin: 30px 0; padding: 20px; background: #fff3f3; border-radius: 10px; border-left: 4px solid #950606;">
                <p style="margin: 0; font-size: 15px; color: #333;">
                  📞 <strong>Need Help?</strong><br/>
                  Contact us at <a href="mailto:sheikhinsaan07@gmail.com" style="color: #950606;">sheikhinsaan07@gmail.com</a><br/>
                  or WhatsApp: <a href="https://wa.me/923439766306" style="color: #950606;">+92 343 9766306</a>
                </p>
              </div>

              <p style="text-align: center; color: #666; font-size: 14px; margin-top: 30px;">
                We'll notify you once your order is shipped. Thank you for choosing Thrivers PK! 🛍️
              </p>
            </div>
            <div style="text-align: center; padding: 20px; background: #f9f9f9; color: #666; font-size: 12px; border-radius: 0 0 10px 10px;">
              <p style="margin: 0;">© 2026 Thrivers PK | Hayat Market, New Bazar, Chitral</p>
            </div>
          </div>
        `,
      })
    } else {
      console.log("No customer email provided, skipping confirmation email.")
    }

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