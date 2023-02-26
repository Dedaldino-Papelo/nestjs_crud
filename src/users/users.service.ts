import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
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
     return "user already exists"

    } else {
      const salt = bcrypt.genSaltSync();
      createUser.password = await bcrypt.hash(createUserDto.password, salt);
      return createUser.save(); 
    }
  }

  async findAll() {
    return this.userModel.find().exec();
  }

  findOne(id: string) {
    return this.userModel.findById(id);
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
