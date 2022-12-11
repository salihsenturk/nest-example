import { User } from '../users/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Report {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	price: number;

	@Column()
	make: string;

	@Column()
	model: string;

	@Column()
	year: number;

	@Column()
	lng: number;

	@Column()
	lat: number;

	@Column()
	milage: number;

	@ManyToOne(() => User, (user) => user.reports, { eager: true })
	user: User;

	@Column({ default: false })
	approved: boolean;
}
