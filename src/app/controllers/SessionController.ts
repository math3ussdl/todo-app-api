import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { db } from '../../config/db';

class SessionController {
	async login(req: Request, res: Response) {
		const { email, password } = req.body;

		const user = await db.users.findOne({ where: { email } });

		if (!user) {
			res.status(404).json({ msg: 'User not found!' });
		}

		const isMatchPass = await bcrypt.compare(password, user.password);

		if (!isMatchPass) {
			res.status(401).json({ msg: 'Incorrect password!' });
		}

		res.json({
			user,
			token: jwt.sign({ id: user.id }, process.env.APP_SECRET),
		});
	}
}

export default new SessionController();
