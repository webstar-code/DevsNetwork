import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`
}

export const unquieId = () => uuidv4();

export function createRandomUser() {
  return {
    id: faker.string.uuid(),
    name: faker.internet.userName(),
    email: faker.internet.email(),
    photoUrl: faker.image.avatar(),
    createdAt: new Date().toDateString(),
    lastLoginAt: new Date().toDateString()
  };
}
const MAX = 25;
export const USERS = faker.helpers.multiple(createRandomUser, {
  count: MAX,
});
