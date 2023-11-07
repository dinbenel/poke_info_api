import { ConflictException, Injectable } from '@nestjs/common';
import { User, UserDocument } from './entities/user.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { errMsg } from 'src/constants/errorMessages';
import { hash } from 'bcrypt';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async create(userDto: CreateUserDto): Promise<UserDocument> {
    try {
      const user = await this.findByEmail(userDto.email);

      if (user) {
        throw new ConflictException(errMsg.userExist);
      }
      const hashedPass = await hash(userDto.password, 12);
      const dbUser = await this.userModel.create({
        ...userDto,
        password: hashedPass,
      });
      const { password, ...res } = dbUser;

      return res as UserDocument;
    } catch (error) {
      console.log('cant create user');
      console.log(error);
    }
  }

  async findByEmail(email: string) {
    try {
      const user = await this.userModel.findOne({ email }).lean().exec();

      return user;
    } catch (error) {
      console.log('cant get user by email');
      console.log(error);
    }
  }

  async findById(id: string) {
    try {
      const user = await this.userModel.findById(id).lean().exec();

      const { password, ...res } = user;

      return res;
    } catch (error) {
      console.log('cant get user by id');
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
