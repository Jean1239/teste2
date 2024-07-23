import { errorHandler } from '@/http/error-handler'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import fastify from 'fastify'
import fastifyJWT from '@fastify/jwt'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { env } from '@/env'
import { signUp } from '@/http/routes/auth/sign-up'
import { signIn } from '@/http/routes/auth/sign-in'
import { getProfile } from '@/http/routes/auth/get-profile'

const app = fastify()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)
app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'SampleApi',
      description: 'Sample backend service',
      version: '1.0.0',
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}`,
        description: 'Local server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

app.register(fastifyJWT, {
  secret: env.JWT_SECRET,
})

app.register(signUp)
app.register(signIn)
app.register(getProfile)

app.setErrorHandler(errorHandler)

app.listen({ host: '0.0.0.0', port: env.PORT }, () => {
  console.log(`Server listening at http://localhost:${env.PORT}`)
})
