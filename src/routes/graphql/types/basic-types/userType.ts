import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLFloat,
  GraphQLList,
} from 'graphql';
import { UUIDType } from '../uuid.js';
import { ProfileType } from './profileType.js';
import { PostType } from './postType.js';
import { PrismaClient, User } from '@prisma/client';

export const UserType:GraphQLObjectType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
    profile: {
      type: ProfileType,
      // resolve: async (user: User, _args, { prisma }: {prisma: PrismaClient}) => {
      //   return prisma.profile.findUnique({ where: { userId: user.id } });
      // },
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
      resolve: async (user: User, _args, { prisma }: {prisma: PrismaClient}) => {
        return prisma.post.findMany({ where: { authorId: user.id } });
      },
    },
    userSubscribedTo: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async (user: User, _args, { prisma }: {prisma: PrismaClient}) => {
        const records = await prisma.subscribersOnAuthors.findMany({
          where: { subscriberId: user.id },
          select: { author: true },
        });
        return records.map((r) => r.author);
      },
    },
    subscribedToUser: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async (user: User, _args, { prisma }: {prisma: PrismaClient}) => {
        const records = await prisma.subscribersOnAuthors.findMany({
          where: { authorId: user.id },
          select: { subscriber: true },
        });
        return records.map((r) => r.subscriber);
      },
    },
  }),
});