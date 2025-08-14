import { Hono } from 'hono'

export const authRoutes = new Hono()


authRoutes.get('/', (c) => {
        return c.json({})

})

