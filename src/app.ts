import express, { Application } from 'express';
import { json, urlencoded } from 'body-parser';
import morgan from 'morgan';

import router from './routes';
import { db } from './config/db';

class MainApplication {
	express: Application;

	constructor() {
		this.express = express();

    this.DBConnect();
		this.middlewares();
		this.routes();
	}

	async DBConnect() {
		await db.$connect()
			.then(() => console.log('Connection has been established successfully.'))
			.catch((err) => console.error(err));
	}

	middlewares() {
		this.express.use(json());
    this.express.use(urlencoded({ extended: false }));
    this.express.use(morgan('dev'));
	}

	routes() {
		this.express.use(router);
	}
}

export const app = new MainApplication().express;
