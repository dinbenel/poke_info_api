import { ConflictException, Injectable } from '@nestjs/common';
import { User, UserDocument } from './entities/user.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { errMsg } from 'src/constants/errorMessages';
import { hash } from 'bcrypt';
import { LoggerService } from 'src/logger/logger.service';
import { UserDbNoPassword, UserDbPayload } from 'src/types/user.type';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly log: LoggerService,
  ) {}
  //
  async create(userDto: CreateUserDto): Promise<UserDbNoPassword> {
    try {
      const user = await this.findByEmail(userDto.email);

      if (user) {
        this.log.error(`user ${user.userName} already exist`);
        throw new ConflictException(errMsg.userExist);
      }
      const hashedPass = await hash(userDto.password, 12);
      const dbUser = await this.userModel.create({
        ...userDto,
        password: hashedPass,
      });

      this.log.verbose(`user ${dbUser.userName} was created`);
      return {
        _id: dbUser._id.toString(),
        avatar: dbUser.avatar,
        email: dbUser.email,
        firstName: dbUser.firstName,
        lastName: dbUser.lastName,
        userName: dbUser.userName,
      };
    } catch (error) {
      this.log.error(`cant create user ${error}`);
    }
  }

  async findByEmail(email: string) {
    try {
      const user = await this.userModel.findOne({ email }).lean().exec();
      return user;
    } catch (error) {
      this.log.error(`cant get user by email ${error}`);
    }
  }

  async findById(id: string) {
    try {
      const user = await this.userModel.findById(id).lean().exec();
      const { password, ...res } = user;
      return res;
    } catch (error) {
      this.log.error(`cant get user by id ${error}`);
    }
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
