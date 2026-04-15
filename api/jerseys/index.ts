import type { VercelRequest, VercelResponse } from '@vercel/node'
import { prisma } from '../lib/prisma'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    return res.status(200).end()
  }

  // Check if this is a detail request (has id in query from rewrite)
  const { id } = req.query

  if (id && !Array.isArray(id)) {
    // Handle single jersey operations
    return handleJerseyById(req, res, id)
  }

  // Handle list operations
  try {
    switch (req.method) {
      case 'GET':
        // Parse query parameters
        const { sortBy, order, search } = req.query

        // Build orderBy based on parameters
        let orderBy: any = { createdAt: 'desc' }

        if (sortBy === 'likes') {
          orderBy = { likes: order === 'asc' ? 'asc' : 'desc' }
        } else if (sortBy === 'price') {
          orderBy = { price: order === 'asc' ? 'asc' : 'desc' }
        } else if (sortBy === 'createdAt') {
          orderBy = { createdAt: order === 'asc' ? 'asc' : 'desc' }
        }

        // Build where clause for search
        let where: any = {}
        if (search && typeof search === 'string' && search.trim()) {
          const searchTerm = search.trim()
          where = {
            OR: [
              { name: { contains: searchTerm } },
              { club: { contains: searchTerm } },
              { country: { contains: searchTerm } },
              { season: { contains: searchTerm } },
            ],
          }
        }

        const jerseys = await prisma.jersey.findMany({
          where,
          orderBy,
          include: { image: { select: { id: true } } },
        })
        return res.status(200).json(jerseys.map(j => ({
          ...j,
          hasImage: j.image !== null,
          image: undefined,
        })))
      case 'POST':
        const data = req.body
        const jersey = await prisma.jersey.create({
          data: {
            name: data.name,
            brand: (data.brand || 'other').toUpperCase(),
            technology: data.technology || null,
            jerseyType: data.jerseyType.toUpperCase(),
            clothingType: data.clothingType.toUpperCase(),
            club: data.club,
            country: data.country,
            matchType: data.matchType.toUpperCase(),
            year: data.year,
            season: data.season,
            price: data.price || 0,
          },
        })
        return res.status(201).json({ ...jersey, hasImage: false })
      default:
        return res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({ error: String(error) })
  }
}

async function handleJerseyById(req: VercelRequest, res: VercelResponse, id: string) {
  const jerseyId = parseInt(id)

  try {
    switch (req.method) {
      case 'GET':
        const jersey = await prisma.jersey.findUnique({
          where: { id: jerseyId },
          include: { image: { select: { id: true } } },
        })
        if (!jersey) {
          return res.status(404).json({ error: 'Jersey not found' })
        }
        return res.status(200).json({
          ...jersey,
          hasImage: jersey.image !== null,
          image: undefined,
        })
      case 'PUT':
        const data = req.body
        const updated = await prisma.jersey.update({
          where: { id: jerseyId },
          data: {
            name: data.name,
            brand: data.brand?.toUpperCase(),
            technology: data.technology,
            jerseyType: data.jerseyType?.toUpperCase(),
            clothingType: data.clothingType?.toUpperCase(),
            club: data.club,
            country: data.country,
            matchType: data.matchType?.toUpperCase(),
            year: data.year,
            season: data.season,
            price: data.price,
          },
        })
        return res.status(200).json({ ...updated, hasImage: false })
      case 'DELETE':
        await prisma.jersey.delete({ where: { id: jerseyId } })
        return res.status(204).end()
      default:
        return res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({ error: String(error) })
  }
}
