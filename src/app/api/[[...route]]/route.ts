import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { userRoutes } from './routes/userRouter'
import { authRoutes } from './routes/authRouter'

const app = new Hono().basePath('/api')

// Middleware
app.use('*', logger())
app.use('*', cors({
    origin: ['http://localhost:3000'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
}))

// Health check
app.get('/health', (c) => {
    return c.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    })
})

// API Routes
app.route('/users', userRoutes)
app.route('/auth', authRoutes)


// 404 handler
app.notFound((c) => {
    return c.json({ error: 'Route not found' }, 404)
})

// Error handler
app.onError((err, c) => {
    console.error(`Error: ${err.message}`)
    return c.json({
        error: 'Internal Server Error',
        message: err.message,
    }, 500)
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
export const PATCH = handle(app)