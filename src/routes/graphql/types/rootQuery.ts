import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLList,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { PostType } from './basic-types/postType.js';
import { ProfileType } from './basic-types/profileType.js';
import { MemberType, MemberTypeIdEnum } from './basic-types/memberType.js';
import { UserType } from './basic-types/userType.js';
import { PrismaClient } from '@prisma/client';

export const rootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    memberTypes: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MemberType))),
      resolve: async (_parent, _args, { prisma }: {prisma: PrismaClient}) => {
        return prisma.memberType.findMany();
      },
    },
    memberType: {
      type: MemberType,
      args: { id: { type: new GraphQLNonNull(MemberTypeIdEnum) } },
      resolve: async (_parent, { id }: {id: string}, { prisma }: {prisma: PrismaClient}) => {
        return prisma.memberType.findUnique({ where: { id } });
      },
    },
    users: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async (_parent, _args, { prisma }: {prisma: PrismaClient}) => {
        return prisma.user.findMany();
      },
    },
    user: {
      type: UserType,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_parent, { id }: {id: string}, { prisma }: {prisma: PrismaClient}) => {
        return prisma.user.findUnique({ where: { id } });
      },
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
      resolve: async (_parent, _args, { prisma }: {prisma: PrismaClient}) => {
        return prisma.post.findMany();
      },
    },
    post: {
      type: PostType,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_parent, { id }: {id: string}, { prisma }: {prisma: PrismaClient}) => {
        return prisma.post.findUnique({ where: { id } });
      },
    },
    profiles: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ProfileType))),
      resolve: async (_parent, _args, { prisma }: {prisma: PrismaClient}) => {
        return prisma.profile.findMany();
      },
    },
    profile: {
      type: ProfileType,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_parent, { id }: {id: string}, { prisma }: {prisma: PrismaClient}) => {
        return prisma.profile.findUnique({ where: { id } });
      },
    },
  },
});