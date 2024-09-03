import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { User } from './user.model';
import { UserService } from './user.service';
import { AuthGuard } from './user.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('find/:id')
  async findUser(@Param('id') id: User['id']): Promise<Omit<User, 'password'>> {
    const user = await this.userService.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    delete user.password; // hide password

    return user;
  }

  @Post('create')
  async createUser(
    @Body() createUserDto: Pick<User, 'password' | 'name' | 'email' | 'phone'>,
  ): Promise<User> {
    if (createUserDto.password.length < 3)
      throw new BadRequestException('Password length must be greater than 3');

    if (createUserDto.name === "")
      throw new BadRequestException('Name cannot be empty');

    if (createUserDto.email === "")
      throw new BadRequestException('Email cannot be empty');

    return this.userService.addOne(createUserDto);
  }

  @Post('login')
  signIn(@Body() signInDto: Pick<User, 'id' | 'password'>) {
    return this.userService.signIn(signInDto.id, signInDto.password);
  }

  @UseGuards(AuthGuard)
  @Delete('delete/:id')
  async deleteUser(@Param('id') id: User['id']) {
    const deleted_rows = await this.userService.deleteUser(id);

    if (!deleted_rows) {
      throw new NotFoundException('User not found');
    }
  }
}
