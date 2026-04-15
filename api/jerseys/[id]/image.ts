import type { VercelRequest, VercelResponse } from '@vercel/node'
import { prisma } from '../../lib/prisma'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    return res.status(200).end()
  }

  const { id } = req.query

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: 'Invalid jersey ID' })
  }

  try {
    const jerseyId = parseInt(id)

    switch (req.method) {
      case 'GET':
        return await getImage(req, res, jerseyId)
      case 'POST':
        return await uploadImage(req, res, jerseyId)
      default:
        return res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

async function getImage(req: VercelRequest, res: VercelResponse, jerseyId: number) {
  const image = await prisma.jerseyImage.findUnique({
    where: { jerseyId },
  })

  if (!image) {
    return res.status(404).json({ error: 'Image not found' })
  }

  // Set cache headers for browser caching
  res.setHeader('Content-Type', image.contentType)
  res.setHeader('Cache-Control', 'public, max-age=86400, immutable')
  res.setHeader('ETag', `"${image.id}"`)

  // Convert base64 to buffer if needed
  let imageBuffer: Buffer
  if (typeof image.imageData === 'string') {
    imageBuffer = Buffer.from(image.imageData, 'base64')
  } else {
    imageBuffer = Buffer.from(image.imageData)
  }

  return res.status(200).send(imageBuffer)
}

async function uploadImage(req: VercelRequest, res: VercelResponse, jerseyId: number) {
  const { imageData, contentType } = req.body

  if (!imageData || !contentType) {
    return res.status(400).json({ error: 'Missing image data or content type' })
  }

  const existingJersey = await prisma.jersey.findUnique({
    where: { id: jerseyId },
  })

  if (!existingJersey) {
    return res.status(404).json({ error: 'Jersey not found' })
  }

  // Remove data URL prefix if present
  const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '')

  // Delete existing image if any
  await prisma.jerseyImage.deleteMany({
    where: { jerseyId },
  })

  // Create new image
  const image = await prisma.jerseyImage.create({
    data: {
      jerseyId,
      imageData: Buffer.from(base64Data, 'base64'),
      contentType,
    },
  })

  return res.status(201).json({
    id: image.id,
    jerseyId: image.jerseyId,
    contentType: image.contentType,
    createdAt: image.createdAt,
  })
}
