import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "./entities/user.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>
  ) {}

  findByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email: email.toLowerCase() } });
  }

  findById(id: number) {
    return this.usersRepository.findOne({ where: { id } });
  }

  create(data: { name: string; email: string; passwordHash: string; role: UserEntity["role"] }) {
    const user = this.usersRepository.create({
      ...data,
      email: data.email.toLowerCase(),
    });
    return this.usersRepository.save(user);
  }
}
