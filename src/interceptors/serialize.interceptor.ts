import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { map, Observable } from 'rxjs';

interface ClassConstructor {
	new (...args: any[]): {};
}

export function Serialize(dto: ClassConstructor) {
	return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
	constructor(private dto: ClassConstructor) {}

	intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
		// run something before a request is handled by request handler
		console.log('before request handler');

		return next.handle().pipe(
			map((data: ClassConstructor) => {
				// Run something before the response is sent out
				console.log('before response is sent');

				return plainToInstance(this.dto, data, {
					excludeExtraneousValues: true,
				});
			}),
		);
	}
}
