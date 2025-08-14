import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

export const authRoutes = new Hono()


// GET /api/users/:id - Get user by ID
authRoutes.get('/', (c) => {
        return c.json({})

})

