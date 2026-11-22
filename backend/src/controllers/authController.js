
import db from '../database/knex.js';
import bcrypt from 'bcryptjs';

// POST /api/auth/register
export async function register(request, reply) {
  try {
    const { name, email, password } = request.body || {};

    if (
      typeof name !== 'string' ||
      !name.trim() ||
      name.trim().length > 100
    ) {
      return reply.code(400).send({
        success: false,
        message: 'Name is required and must not exceed 100 characters.'
      });
    }

    if (
      typeof email !== 'string' ||
      email.trim().length > 255 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      return reply.code(400).send({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    if (
      typeof password !== 'string' ||
      password.length < 8 ||
      Buffer.byteLength(password, 'utf8') > 72
    ) {
      return reply.code(400).send({
        success: false,
        message: 'Password must be at least 8 characters and no more than 72 bytes.'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await db('users')
      .where({ email: normalizedEmail })
      .first();

    if (existingUser) {
      return reply.code(409).send({
        success: false,
        message: 'An account with this email already exists.'
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const [user] = await db('users')
      .insert({
        name: name.trim(),
        email: normalizedEmail,
        password_hash: passwordHash,
        role: 'user'
      })
      .returning(['id', 'name', 'email', 'role']);

    const token = request.server.jwt.sign({
      sub: user.id,
      email: user.email,
      role: user.role
    });

    return reply.code(201).send({
      success: true,
      message: 'Registration successful.',
      token,
      user
    });
  } catch (error) {
    if (error.code === '23505') {
      return reply.code(409).send({
        success: false,
        message: 'An account with this email already exists.'
      });
    }

    request.log.error(error);
    return reply.code(500).send({
      success: false,
      message: 'Unable to register account.'
    });
  }
}

// POST /api/auth/login
export async function login(request, reply) {
  try {
    const { email, password } = request.body || {};

    if (
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      !email.trim() ||
      !password
    ) {
      return reply.code(400).send({
        success: false,
        message: 'Email and password are required.'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await db('users')
      .where({ email: normalizedEmail })
      .first();

    if (
      !user ||
      !user.is_active ||
      !(await bcrypt.compare(password, user.password_hash))
    ) {
      return reply.code(401).send({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const token = request.server.jwt.sign({
      sub: user.id,
      email: user.email,
      role: user.role
    });

    return {
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({
      success: false,
      message: 'Unable to log in.'
    });
  }
}

// GET /api/auth/me
export async function getCurrentUser(request, reply) {
  try {
    const user = await db('users')
      .select('id', 'name', 'email', 'role')
      .where({
        id: request.user.sub,
        is_active: true
      })
      .first();

    if (!user) {
      return reply.code(401).send({
        success: false,
        message: 'User account not found or inactive.'
      });
    }

    return {
      success: true,
      user
    };
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({
      success: false,
      message: 'Unable to retrieve user profile.'
    });
  }
}
