import type { VercelRequest, VercelResponse } from '@vercel/node'
import { prisma } from '../lib/prisma.js'
import { JerseyType, ClothingType, MatchType, Brand } from '@prisma/client'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    return res.status(200).end()
  }

  const { id } = req.query

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: 'Invalid jersey ID' })
  }

  try {
    switch (req.method) {
      case 'GET':
        return await getJersey(req, res, parseInt(id))
      case 'PUT':
        return await updateJersey(req, res, parseInt(id))
      case 'DELETE':
        return await deleteJersey(req, res, parseInt(id))
      default:
        return res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({ error: 'Internal server error', details: String(error) })
  }
}

async function getJersey(req: VercelRequest, res: VercelResponse, id: number) {
  const jersey = await prisma.jersey.findUnique({
    where: { id },
    include: {
      image: {
        select: {
          id: true,
        },
      },
    },
  })

  if (!jersey) {
    return res.status(404).json({ error: 'Jersey not found' })
  }

  return res.status(200).json({
    ...jersey,
    hasImage: !!jersey.image,
    image: undefined,
  })
}

async function updateJersey(req: VercelRequest, res: VercelResponse, id: number) {
  const { name, brand, technology, jerseyType, clothingType, club, country, matchType, year, season, price } = req.body

  const existingJersey = await prisma.jersey.findUnique({
    where: { id },
  })

  if (!existingJersey) {
    return res.status(404).json({ error: 'Jersey not found' })
  }

  const updateData: any = {}
  if (name !== undefined) updateData.name = name
  if (brand !== undefined) updateData.brand = brand.toUpperCase() as Brand
  if (technology !== undefined) updateData.technology = technology || null
  if (jerseyType !== undefined) updateData.jerseyType = jerseyType.toUpperCase() as JerseyType
  if (clothingType !== undefined) updateData.clothingType = clothingType.toUpperCase() as ClothingType
  if (club !== undefined) updateData.club = club
  if (country !== undefined) updateData.country = country
  if (matchType !== undefined) updateData.matchType = matchType.toUpperCase() as MatchType
  if (year !== undefined) updateData.year = parseInt(year)
  if (season !== undefined) updateData.season = season
  if (price !== undefined) updateData.price = parseFloat(price)

  const jersey = await prisma.jersey.update({
    where: { id },
    data: updateData,
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
}

async function deleteJersey(req: VercelRequest, res: VercelResponse, id: number) {
  const existingJersey = await prisma.jersey.findUnique({
    where: { id },
  })

  if (!existingJersey) {
    return res.status(404).json({ error: 'Jersey not found' })
  }

  await prisma.jersey.delete({
    where: { id },
  })

  return res.status(204).end()
}