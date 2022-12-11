import {
	Body,
	Controller,
	Delete,
	Get,
	NotFoundException,
	Param,
	Patch,
	Post,
	Query,
	Session,
	UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { Serialize } from '../interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { CreateUserDTO } from './dtos/create-user.dto';
import { UpdateUserDTO } from './dtos/update-user.dto';
import { UserDTO } from './dtos/user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('auth')
@Serialize(UserDTO)
export class UsersController {
	constructor(private usersService: UsersService, private authService: AuthService) {}

	// @Get('/whoami')
	// whoAmI(@Session() session: any) {
	// 	return this.usersService.findOne(session.userId);
	// }

	@Get('/whoami')
	@UseGuards(AuthGuard)
	whoAmI(@CurrentUser() user: User) {
		return user;
	}

	@Post('/signout')
	signOut(@Session() session: any) {
		session.userId = null;
	}

	@Post('/signup')
	async createUser(@Body() body: CreateUserDTO, @Session() session: any) {
		const user = await this.authService.signup(body.email, body.password);
		session.userId = user.id;
		return user;
	}

	@Post('/signin')
	async signin(@Body() body: CreateUserDTO, @Session() session: any) {
		const user = await this.authService.signin(body.email, body.password);
		session.userId = user.id;
		return user;
	}

	@Get('/:id')
	async findUser(@Param('id') id: string) {
		const user = await this.usersService.findOne(parseInt(id));
		if (!user) {
			throw new NotFoundException('User not found!');
		}
		return user;
	}

	@Get()
	findAllUsers(@Query('email') email: string) {
		return this.usersService.find(email);
	}

	@Delete('/:id')
	deleteUser(@Param('id') id: string) {
		return this.usersService.remove(parseInt(id));
	}

	@Patch('/:id')
	updateUser(@Param('id') id: string, @Body() body: UpdateUserDTO) {
		return this.usersService.update(parseInt(id), body);
	}
}
