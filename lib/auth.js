import { compare, hash } from "bcrypt";

export const hashedPassword = async (password) => {
  const hashedPassword = await hash(password, 12);
  return hashedPassword;
};

export const compareHashedPassword = async (password, hashedPassword) => {
  const isValid = await compare(password, hashedPassword);

  return isValid;
};
