import type { FastifyInstance } from 'fastify'

type FastifyErrorHandler = FastifyInstance['errorHandler']

export const errorHandler: FastifyErrorHandler = async (error, _, reply) => {
  console.error(error)
  reply.status(500).send({ message: 'Internal server error' })
}
