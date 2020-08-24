import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const verifyJWT = (
	req: Request & { userId: string },
	res: Response,
	next: NextFunction
) => {
	let authHeader = req.headers['authorization'];

	if (!authHeader) {
    res.status(401).json({ auth: false, message: 'No token provided.' });
  }

  const [, token] = authHeader.split(' ');

	jwt.verify(token, process.env.APP_SECRET, function (
		err,
		decoded: { id: string }
	) {
		if (err) {
			res
				.status(500)
				.json({ auth: false, message: 'Failed to authenticate token.' });
		}

		req.userId = decoded.id;

		next();
	});
};
