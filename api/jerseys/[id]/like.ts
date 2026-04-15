import type { VercelRequest, VercelResponse } from '@vercel/node'
import { prisma } from '../../lib/prisma'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { id } = req.query

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: 'Invalid jersey ID' })
  }

  try {
    const jerseyId = parseInt(id)

    const existingJersey = await prisma.jersey.findUnique({
      where: { id: jerseyId },
    })

    if (!existingJersey) {
      return res.status(404).json({ error: 'Jersey not found' })
    }

    const jersey = await prisma.jersey.update({
      where: { id: jerseyId },
      data: {
        likes: {
          increment: 1,
        },
      },
      include: {
        image: {
          select: {
            id: true,
          },
        },
      },
    })

    return res.status(200).json({
      ...jersey,
      hasImage: !!jersey.image,
      image: undefined,
    })
  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
