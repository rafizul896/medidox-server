import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

export const generateToken =  (
  payload: JwtPayload,
  secret: string,
  expireIn: string,
) => {
  return jwt.sign(payload, secret, { expiresIn: expireIn } as SignOptions);
};

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as JwtPayload;
};
