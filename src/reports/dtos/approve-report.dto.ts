import { IsBoolean } from 'class-validator';

export class ApproveReportDTO {
	@IsBoolean()
	approved: boolean;
}
