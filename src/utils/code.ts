import { randomUUID } from 'crypto';

const generateUniqueInviteCode = () => {
  const uuid = randomUUID();
  return uuid.replace(/-/g, '').toUpperCase().substring(0, 6);
};

export { generateUniqueInviteCode };
