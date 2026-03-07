import {
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    CreateDateColumn,
} from 'typeorm';

import Category from './Category';
import User from './User';

import { ReportStatus } from '../enums/ReportStatus';
import { ReportPriority } from '../enums/ReportPriority';

@Entity('reports')
export default class Report {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    title!: string;

    @Column()
    description!: string;

    @Column({ type: 'enum', enum: ReportStatus, default: ReportStatus.OPEN })
    status!: ReportStatus;

    @Column({ type: 'enum', enum: ReportPriority, default: ReportPriority.LOW })
    priority!: ReportPriority;

    @CreateDateColumn()
    createdAt!: Date;

    @ManyToOne(() => Category, (category) => category.reports, {
        nullable: false,
    })
    category!: Category;

    @ManyToOne(() => User, (user: User) => user.reportsCreated, {
        nullable: false,
    })
    reportedBy!: User;

    @ManyToOne(() => User, (user: User) => user.reportsManaged, {
        nullable: true,
    })
    managedBy?: User | null;
}
