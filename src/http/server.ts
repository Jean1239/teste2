import { errorHandler } from '@/http/error-handler'
import fastify from 'fastify'

const app = fastify()

app.setErrorHandler(errorHandler)

app.listen({ host: '0.0.0.0', port: 3000 }, () => {
  console.log(`Server listening at http://localhost:${3000}`)
})
