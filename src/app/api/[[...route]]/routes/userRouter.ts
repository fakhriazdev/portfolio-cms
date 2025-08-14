import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

// Type definitions
interface User {
    id: string
    name: string
    email: string
    createdAt: string
}

// Validation schemas
const createUserSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.email('Invalid email format'),
})

const updateUserSchema = z.object({
    name: z.string().min(1).optional(),
    email: z.email().optional(),
})

const users: User[] = [
    {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        createdAt: new Date().toISOString(),
    },
    {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        createdAt: new Date().toISOString(),
    }
]

export const userRoutes = new Hono()

// GET /api/users - Get all users
userRoutes.get('/', (c) => {
    const page = parseInt(c.req.query('page') || '1')
    const limit = parseInt(c.req.query('limit') || '10')
    const search = c.req.query('search') || ''

    let filteredUsers = users

    if (search) {
        filteredUsers = users.filter(user =>
            user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase())
        )
    }

    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex)

    return c.json({
        users: paginatedUsers,
        pagination: {
            page,
            limit,
            total: filteredUsers.length,
            pages: Math.ceil(filteredUsers.length / limit)
        }
    })
})

// GET /api/users/:id - Get user by ID
userRoutes.get('/:id', (c) => {
    const id = c.req.param('id')
    const user = users.find(u => u.id === id)

    if (!user) {
        return c.json({ error: 'User not found' }, 404)
    }

    return c.json({ user })
})

// POST /api/users - Create new user
userRoutes.post('/', zValidator('json', createUserSchema), (c) => {
    const { name, email } = c.req.valid('json')

    // Check if email already exists
    const existingUser = users.find(u => u.email === email)
    if (existingUser) {
        return c.json({ error: 'Email already exists' }, 400)
    }

    const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        createdAt: new Date().toISOString(),
    }

    users.push(newUser)

    return c.json({ user: newUser }, 201)
})

// PUT /api/users/:id - Update user
userRoutes.put('/:id', zValidator('json', updateUserSchema), (c) => {
    const id = c.req.param('id')
    const updates = c.req.valid('json')

    const userIndex = users.findIndex(u => u.id === id)
    if (userIndex === -1) {
        return c.json({ error: 'User not found' }, 404)
    }

    // Check if email already exists (if updating email)
    if (updates.email) {
        const existingUser = users.find(u => u.email === updates.email && u.id !== id)
        if (existingUser) {
            return c.json({ error: 'Email already exists' }, 400)
        }
    }

    users[userIndex] = { ...users[userIndex], ...updates }

    return c.json({ user: users[userIndex] })
})

// DELETE /api/users/:id - Delete user
userRoutes.delete('/:id', (c) => {
    const id = c.req.param('id')
    const userIndex = users.findIndex(u => u.id === id)

    if (userIndex === -1) {
        return c.json({ error: 'User not found' }, 404)
    }

    const deletedUser = users.splice(userIndex, 1)[0]

    return c.json({ message: 'User deleted successfully', user: deletedUser })
})