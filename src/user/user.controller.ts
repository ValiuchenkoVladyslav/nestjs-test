import {
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
  async findUser(@Param('id') id: number): Promise<Omit<User, 'password'>> {
    const user = await this.userService.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    delete user.password; // hide password

    return user;
  }

  @Post('create')
  async createUser(
    @Body() createUserDto: { name: string; email: string; password: string },
  ): Promise<User> {
    return this.userService.addOne(createUserDto);
  }

  @Post('login')
  signIn(@Body() signInDto: { id: number; password: string }) {
    return this.userService.signIn(signInDto.id, signInDto.password);
  }

  @UseGuards(AuthGuard)
  @Delete('delete/:id')
  async deleteUser(@Param('id') id: number) {
    const deleted_rows = await this.userService.deleteUser(id);

    if (!deleted_rows) {
      throw new NotFoundException('User not found');
    }
  }
}
