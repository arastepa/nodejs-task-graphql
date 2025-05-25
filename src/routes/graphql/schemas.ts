import { Type } from '@fastify/type-provider-typebox';
import { GraphQLSchema } from 'graphql';
import { rootQueryType } from './types/rootQuery.js';
import { rootMutationType } from './types/rootMutations.js';

export const gqlResponseSchema = Type.Partial(
  Type.Object({
    data: Type.Any(),
    errors: Type.Any(),
  }),
);

export const createGqlResponseSchema = {
  body: Type.Object(
    {
      query: Type.String(),
      variables: Type.Optional(Type.Record(Type.String(), Type.Any())),
    },
    {
      additionalProperties: false,
    },
  ),
};

export const RootSchema = new GraphQLSchema({
  query: rootQueryType,
  mutation: rootMutationType,
});
