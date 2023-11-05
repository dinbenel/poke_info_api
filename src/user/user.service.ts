import { ConflictException, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { errMsg } from 'src/constants/errorMessages';
import { hash } from 'argon2';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async create(userDto: CreateUserDto): Promise<User> {
    try {
      const user = await this.userModel.findOne({ email: userDto.email });
      if (user) {
        throw new ConflictException(errMsg.userExist);
      }
      const hashedPass = await hash(userDto.password);
      const dbUser = await this.userModel.create({
        ...userDto,
        password: hashedPass,
      });
      delete dbUser.password;
      return user;
    } catch (error) {
      console.log('cnat create user');
      console.log(error);
    }
  }

  async findAll(): Promise<User[]> {
    try {
      const users = await this.userModel.find().exec();
      return users;
    } catch (error) {
      console.log('cnat get all users');
      console.log(error);
    }
  }

  async findOne(id: string): Promise<User> {
    try {
      const user = await this.userModel.findById(id).lean().exec();
      return user;
    } catch (error) {
      console.log('cnat get user by id');
      console.log(error);
    }
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
