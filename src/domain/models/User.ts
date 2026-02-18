import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';

import Report from './Report';

import { UserRole } from '../enums/UserRole';

@Entity('users')
export default class User {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ unique: true })
    username!: string;

    @Column()
    firstName!: string;

    @Column()
    lastName!: string;

    @Column({ unique: true })
    email!: string;

    @Column()
    password!: string;

    @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
    role!: UserRole;

    @Column({ default: true })
    active!: boolean;

    @CreateDateColumn()
    createdAt!: Date;

    @OneToMany(() => Report, (report: Report) => report.reportedBy)
    reportsCreated!: Report[];

    @OneToMany(() => Report, (report: Report) => report.managedBy)
    reportsManaged!: Report[];
}
