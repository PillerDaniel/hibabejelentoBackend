import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import Report from './Report';

@Entity('categories')
export default class Category {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ unique: true })
    name!: string;

    @OneToMany(() => Report, (report: Report) => report.category)
    reports!: Report[];
}
