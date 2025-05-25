import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLInt,
} from 'graphql';
import { UUIDType } from '../uuid.js';
import { MemberType, MemberTypeIdEnum } from '../basic-types/memberType.js';
import { PrismaClient, Profile } from '@prisma/client';

export const ProfileType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    memberTypeId: { type: new GraphQLNonNull(MemberTypeIdEnum) },
    memberType: {
      type: new GraphQLNonNull(MemberType),
      resolve: async (profile: Profile, _args, { prisma }: { prisma: PrismaClient }) => {
        const memberType = await prisma.memberType.findUnique({
          where: { id: profile.memberTypeId },
        });
        return memberType;
      },
    },
  }),
  })