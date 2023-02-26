import { Model } from 'mongoose';
import { Injectable,NotFoundException,BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User,UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto) {
    const createUser = new this.userModel(createUserDto)
    const { email } = createUser
    // Check if user exists
    const user = await this.userModel.findOne({email})

    if(user){
     throw new BadRequestException("user already exists")

    } else {
      const salt = bcrypt.genSaltSync();
      createUser.password = await bcrypt.hash(createUserDto.password, salt);
      return createUser.save(); 
    }
  }

  async findAll() {
    return this.userModel.find().exec();
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id);

    if(!user){
      throw new NotFoundException("user not found")
    }
    return user
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate({
      _id:id
    }, {
      $set: updateUserDto
    }, {
      new: true
    });
  }

  remove(id: string) {
    return this.userModel.deleteOne({
      _id:id
    });
  }
}
