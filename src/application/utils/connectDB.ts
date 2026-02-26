import AppDataSource from '../../infrastructure/db/dataSource';

const connectDB = async (): Promise<void> => {
    try {
        await AppDataSource.initialize();
        console.log('Database connected successfully');
    } catch (err) {
        console.error('Error connecting to the database', err);
        process.exit(1);
    }
};

export default connectDB;
