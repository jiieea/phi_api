import { Reflector } from '@nestjs/core';
import { ROLE } from '../generated/prisma/enums.js';
import { SetMetadata } from '@nestjs/common';
export const roles = (...roles: ROLE[]) => SetMetadata('roles', roles);
