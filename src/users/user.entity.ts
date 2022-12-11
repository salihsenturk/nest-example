import { Report } from '../reports/report.entity';
import { AfterInsert, AfterRemove, AfterUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	email: string;

	@Column()
	password: string;

	@Column({ default: true })
	admin: boolean;

	@OneToMany(() => Report, (report) => report.user)
	reports: Report[];

	@AfterInsert()
	logInsert() {
		console.log('inserted');
	}

	@AfterUpdate()
	logUpdate() {
		console.log('updated');
	}

	@AfterRemove()
	logRemove() {
		console.log('removed');
	}
}
