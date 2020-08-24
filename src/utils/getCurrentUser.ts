import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const getCurrentUser = (req: Request, res: Response) => {
  const authHeader = req.headers['authorization'];

  const [, token] = authHeader.split(' ');

  let decodedToken: string;
  jwt.verify(token, process.env.APP_SECRET, function (
		err,
		decoded: { id: string }
	) {
    if (err) {
			res
				.status(500)
				.json({ auth: false, message: 'Failed to get the authenticated user!' });
    }
    
    decodedToken = decoded.id;
  });

  return decodedToken;
};
