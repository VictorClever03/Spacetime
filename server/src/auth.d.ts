/* eslint-disable prettier/prettier */
// fastify-jwt.d.ts
import '@fastify/jwt'

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: {
      sub: string
      name: string
      avatarUrl: string
    } // user type is return type of `request.user` object
  }
}
