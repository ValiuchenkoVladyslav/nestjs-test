import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private jwtService: JwtService,
  ) {}

  async addOne(
    user: Pick<User, 'name' | 'email' | 'phone' | 'password'>,
  ): Promise<User> {
    return this.userModel.create(user);
  }

  async findOne(id: User['id']): Promise<User | null> {
    return this.userModel.findOne({
      where: { id },
    });
  }

  async deleteUser(id: User['id']): Promise<number> {
    return await this.userModel.destroy({
      where: { id },
    });
  }

  async signIn(
    id: User['id'],
    password: User['password'],
  ): Promise<{ access_token: string }> {
    const user = await this.findOne(id);
    if (!user) {
      throw new UnauthorizedException();
    }

    if (user.password !== password) {
      throw new UnauthorizedException();
    }

    return {
      access_token: await this.jwtService.signAsync({
        sub: user.id,
        name: user.name,
      }),
    };
  }
}
