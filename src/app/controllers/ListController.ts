import { Request, Response } from 'express';
import { listsUpdateInput } from '@prisma/client';

import { db } from '../../config/db';
import { getCurrentUser } from '../../utils/getCurrentUser';

interface IListCreatedBody {
	title: string;
	description: string;
	category: string;

	activities: [
		{
			responsibleEmail: string;
			description: string;
			prevDate: Date;
			execDate: Date;
			status: string;
		}
	];
}

class ListController {
	async createList(req: Request, res: Response) {
		const body: IListCreatedBody = req.body;

		const decoded = getCurrentUser(req, res);

		const list = await db.lists.create({
			include: {
				activities: { include: { users: true } },
				categories: true,
				users: true,
			},
			data: {
				title: body.title,
				description: body.description,
				users: {
					connect: { id: decoded },
				},
				categories: {
					create: {
						description: body.category,
					},
				},
				activities: {
					create: body.activities.map((act) => {
						return {
							description: act.description,
							status: {
								create: {
									description: act.status,
								},
							},
							dt_prev: new Date(),
							users: {
								connect: { email: act.responsibleEmail },
							},
						};
					}),
				},
			},
		});

		res.status(201).json(list);
	}

	async readAllLists(req: Request, res: Response) {
		const lists = await db.lists.findMany({
			include: {
				activities: { include: { users: true, status: true } },
        categories: true,
				users: true,
			},
		});

		res.json(lists);
	}

	async readOneList(req: Request, res: Response) {
		const { id } = req.params;
		const listId = Number(id);

		const list = await db.lists.findOne({
			where: { id: listId },
			include: {
				activities: { include: { users: true, status: true } },
				categories: true,
				users: true,
			},
		});

		res.json(list);
	}

	async readListsByName(req: Request, res: Response) {
		const { name } = req.query;
		const listName = name.toString();

		const listsByName = await db.lists.findMany({
			where: { title: listName },
			include: {
				activities: { include: { users: true } },
				categories: true,
				users: true,
			},
		});

		res.json(listsByName);
	}

	async updateList(req: Request, res: Response) {
		const { id } = req.params;
		const listId = Number(id);

		const body: listsUpdateInput = req.body;

		const list = await db.lists.findOne({ where: { id: listId } });

		if (!list) res.status(404).json({ msg: 'List not found' });

		try {
			const listUpdated = await db.lists.update({
				where: {
					id: listId,
				},
				data: body,
			});

			res.json(listUpdated);
		} catch (error) {
			console.log(error);
			res.status(500).json({ error: 'List not updated' });
		}
	}

	async deleteList(req: Request, res: Response) {
		const { id } = req.params;
		const listId = Number(id);

		const list = await db.lists.findOne({
			where: { id: listId },
			include: { activities: true },
    });

		try {
      list.activities.map(async (act) => {
        await db.activities.delete({ where: { id: act.id } });
      });

      await db.lists.delete({ where: { id: listId } });
      
      await db.categories.delete({ where: { id: list.categoryId } });
			res.json({ msg: 'List successful removed!' });
		} catch (error) {
			res.json({ error });
		}
	}
}

export default new ListController();
