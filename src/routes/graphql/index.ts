import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { RootSchema } from './schemas.js';
import depthLimit from 'graphql-depth-limit';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const { parse, validate, execute } = await import('graphql');
      const document = parse(req.body.query);
      const validationErrors = validate(RootSchema, document, [depthLimit(5)]);
      if (validationErrors.length > 0) {
        return { errors: validationErrors };
      }
      const result = await execute({
        schema: RootSchema,
        document,
        variableValues: req.body.variables,
        contextValue: { prisma },
      });

      return result;
    },
  });
};

export default plugin;
