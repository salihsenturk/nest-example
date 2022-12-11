import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { CreateReportDTO } from './dtos/create-report.dto';
import { Report } from './report.entity';
import { GetEstimateDTO } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
	constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

	create(reportDTO: CreateReportDTO, user: User) {
		const report = this.repo.create(reportDTO);
		report.user = user;
		return this.repo.save(report);
	}

	async changeApproval(id: string, approved: boolean) {
		const report = await this.repo.findOne({ where: { id: parseInt(id) } });

		if (!report) {
			throw new NotFoundException('Report not found');
		}

		report.approved = approved;
		return this.repo.save(report);
	}

	createEstimate(estimateDTO: GetEstimateDTO) {
		return this.repo
			.createQueryBuilder()
			.select('avg(price)', 'price')
			.where('make = :make', { make: estimateDTO.make })
			.andWhere('model = :model', { model: estimateDTO.model })
			.andWhere('lng - :lng between -5 and 5', { lng: estimateDTO.lng })
			.andWhere('lat - :lat between -5 and 5', { lat: estimateDTO.lat })
			.andWhere('year - :year between -3 and 3', { year: estimateDTO.year })
			.andWhere('approved is true')
			.orderBy('milage - :milage', 'DESC')
			.setParameters({ milage: estimateDTO.milage })
			.limit(3)
			.getRawOne();
	}
}
