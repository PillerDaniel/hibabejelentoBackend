import { DataSource } from 'typeorm';
import path from 'path';

const root = process.cwd();

export default new DataSource({
    type: 'postgres',
    url: process.env.DBURL,
    synchronize: false,
    logging: false,

    entities: [path.join(root, 'src/domain/models/**/*.{ts,js}')],
    migrations: [path.join(root, 'migrations/**/*.{ts,js}')],
    subscribers: [path.join(root, 'src/domain/subscribers/**/*.{ts,js}')],
});
