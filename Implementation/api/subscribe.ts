import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Resend } from 'resend'

const resendApiKey = process.env.RESEND_API_KEY
const resendFrom = process.env.RESEND_FROM ?? 'GreenEarth Produce <onboarding@resend.dev>'
const resend = resendApiKey ? new Resend(resendApiKey) : null

function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' })
    }

    if (!resend) {
        return res.status(500).json({ message: 'Email service is not configured.' })
    }

    const { email } = req.body ?? {}

    if (!email || typeof email !== 'string' || !isValidEmail(email)) {
        return res.status(400).json({ message: 'Please enter a valid email address.' })
    }

    try {
        const { data, error } = await resend.emails.send({
            from: resendFrom,
            to: [email],
            subject: 'Welcome to GreenEarth Produce',
            html: `
        <h1>Thank you for subscribing!</h1>
        <p>You have successfully subscribed to GreenEarth Produce updates.</p>
        <p>We will keep you informed about seasonal products, company updates, and future offers.</p>
      `,
        })

        if (error) {
            console.error('Resend error:', error)
            return res.status(500).json({ message: 'Email could not be sent.' })
        }

        return res.status(200).json({
            message: 'Subscription confirmation email sent successfully.',
            id: data?.id,
        })
    } catch (error) {
        console.error('Unexpected subscribe error:', error)
        return res.status(500).json({ message: 'Something went wrong.' })
    }
}
