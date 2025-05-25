import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import { UserType } from './basic-types/userType.js';
import { ProfileType } from './basic-types/profileType.js';
import { PostType } from './basic-types/postType.js';
import { CreateUserInput, CreateProfileInput, CreatePostInput, ChangeUserInput, ChangeProfileInput, ChangePostInput } from './mutation-types/inputTypes.js';
import { PrismaClient } from '@prisma/client';
import { MemberTypeId } from '../../member-types/schemas.js';
import { UUIDType } from './uuid.js';

export const rootMutationType = new GraphQLObjectType({
  name: 'Mutations',
  fields: {
    createUser: {
      type: new GraphQLNonNull(UserType),
      args: {
        dto: { type: new GraphQLNonNull(CreateUserInput) },
      },
        resolve: async (_parent, {dto}: {dto: {name: string, balance: number}}, { prisma }: { prisma: PrismaClient }) => {
        return prisma.user.create({ data: dto });
      },
    },
    createProfile: {
      type: new GraphQLNonNull(ProfileType),
      args: {
        dto: { type: new GraphQLNonNull(CreateProfileInput) },
      },
      resolve: async (_parent,  {dto}: {dto: {isMale: boolean, yearOfBirth: number, userId: string, memberTypeId: MemberTypeId}} , { prisma }: { prisma: PrismaClient }) => {
        return prisma.profile.create({ data: {...dto} });
      },
    },
    createPost: {
      type: new GraphQLNonNull(PostType),
      args: {
        dto: { type: new GraphQLNonNull(CreatePostInput) },
      },
      resolve: async (
        _parent,
        { dto}: { dto:{ title: string; content: string; authorId: string } },
        { prisma }: { prisma: PrismaClient }
      ) => {
        return prisma.post.create({ data: {...dto} });
      },
    },
    changeUser: {
      type: new GraphQLNonNull(UserType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeUserInput) },
      },
      resolve: async (_parent, { id, dto }: { id: string; dto: { name?: string; balance?: number } }, { prisma }: { prisma: PrismaClient }) => {
        return prisma.user.update({ where: { id }, data: { ...dto } });
      },
    },
    changeProfile: {
      type: new GraphQLNonNull(ProfileType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeProfileInput) },
      },
      resolve: async (_parent, { id, dto }: { id: string; dto: { isMale?: boolean; yearOfBirth?: number; memberTypeId?: MemberTypeId } }, { prisma }: { prisma: PrismaClient }) => {
        return prisma.profile.update({ where: { id }, data: { ...dto } });
      },
    },
    changePost: {
      type: new GraphQLNonNull(PostType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangePostInput) },
      },
      resolve: async (_parent, { id, dto }: { id: string; dto: { title?: string; content?: string } }, { prisma }: { prisma: PrismaClient }) => {
        return prisma.post.update({ where: { id }, data: { ...dto } });
      },
    },
    deleteUser: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_parent, { id }: { id: string}, { prisma }: { prisma: PrismaClient }) => {
        await prisma.user.delete({ where: { id } });
        return `User with ID ${id} deleted successfully.`;
      },
    },
    deleteProfile: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (
        _parent,
        { id }: { id: string },
        { prisma }: { prisma: PrismaClient }
      ) => {
        await prisma.profile.delete({ where: { id } });
        return `Profile with ID ${id} deleted successfully.`;
      },
    },
    deletePost: {
      type: new GraphQLNonNull(GraphQLString), // Return a string confirmation
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (
        _parent,
        { id }: { id: string },
        { prisma }: { prisma: PrismaClient }
      ) => {
        await prisma.post.delete({ where: { id } });
        return `Post with ID ${id} deleted successfully.`;
      },
    },
    subscribeTo: {
      type: new GraphQLNonNull(GraphQLString), // Return a string confirmation
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (
        _parent,
        args: { userId: string; authorId: string },
        { prisma }: { prisma: PrismaClient }
      ) => {
        await prisma.subscribersOnAuthors.create({
          data: { subscriberId: args.userId, authorId: args.authorId },
        });
        return `User ${args.userId} subscribed to ${args.authorId}.`;
      },
    },
    unsubscribeFrom: {
      type: new GraphQLNonNull(GraphQLString), // Return a string confirmation
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (
        _parent,
        args: { userId: string; authorId: string },
        { prisma }: { prisma: PrismaClient }
      ) => {
        await prisma.subscribersOnAuthors.delete({
          where: { subscriberId_authorId: { subscriberId: args.userId, authorId: args.authorId } },
        });
        return `User ${args.userId} unsubscribed from ${args.authorId}.`;
      },
    },
  },
});