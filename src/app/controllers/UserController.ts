import { Request, Response } from 'express';
import { v4 } from 'uuid';
import bcrypt from 'bcryptjs';

import { db } from '../../config/db';

class UserController {
	async createUser(req: Request, res: Response) {
		const { name, phone, email, password } = req.body;

		var user = await db.users.findOne({ where: { email } });

		if (user) {
			res.status(400).json({ msg: 'This user already exists!' });
		}

		user = await db.users.create({
			data: {
				id: v4(),
				name,
				phone,
				email,
				password: await bcrypt.hash(password, 8),
			},
		});

		res.status(201).json(user);
	}

	async readAllUsers(req: Request, res: Response) {
		const users = await db.users.findMany();

		res.json(users);
	}

	async readUserById(req: Request, res: Response) {
		const { id } = req.params;

		const userById = await db.users.findOne({ where: { id } });

    if (userById === null) res.json([]);

		res.json(userById);
	}

	async readUsersByName(req: Request, res: Response) {
    const { name } = req.query;

    const userName = name.toString();

		const usersByName = await db.users.findMany({ where: { name: userName } });

		res.json(usersByName);
	}

	async update(req: Request, res: Response) {
		const { id } = req.params;
		const body: {
			name?: string;
			phone?: string;
			email?: string;
			password?: string;
		} = req.body;

		const userUpdated = await db.users.update({
			where: { id },
			data: body,
		});

		res.json(userUpdated);
	}

	async delete(req: Request, res: Response) {
		const { id } = req.params;

		await db.users
			.delete({ where: { id } })
			.then(() => res.json({ msg: 'User successful removed!' }))
			.catch((err) =>
				res
					.status(500)
					.json({ msg: 'Oops...', body: 'Error in this operation!' })
			);
	}
}

export default new UserController();
