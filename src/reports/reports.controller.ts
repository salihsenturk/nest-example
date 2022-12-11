import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { AuthGuard } from '../guards/auth.guard';
import { CreateReportDTO } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { User } from 'src/users/user.entity';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ReportDTO } from './dtos/report.dto';
import { ApproveReportDTO } from './dtos/approve-report.dto';
import { AdminGuard } from 'src/guards/admin.guard';
import { GetEstimateDTO } from './dtos/get-estimate.dto';

@Controller('reports')
@Serialize(ReportDTO)
export class ReportsController {
	constructor(private reportsService: ReportsService) {}

	@Post()
	@UseGuards(AuthGuard)
	createReport(@Body() body: CreateReportDTO, @CurrentUser() user: User) {
		return this.reportsService.create(body, user);
	}

	@Patch('/:id')
	@UseGuards(AdminGuard)
	approveReport(@Param('id') id: string, @Body() body: ApproveReportDTO) {
		return this.reportsService.changeApproval(id, body.approved);
	}

	@Get()
	getEstimate(@Query() query: GetEstimateDTO) {
		return this.reportsService.createEstimate(query);
	}
}
