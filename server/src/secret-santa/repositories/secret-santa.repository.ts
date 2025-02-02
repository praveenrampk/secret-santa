import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import {
  SecretSanta,
  SecretSantaDocument,
} from '../schemas/secret-santa.schema';

@Injectable()
export class SecretSantaRepository {
  constructor(
    @InjectModel(SecretSanta.name)
    private readonly secretSantaModel: Model<SecretSantaDocument>,
  ) {}

  async create(secretSanta: SecretSanta): Promise<SecretSanta> {
    const createdSecretSanta = new this.secretSantaModel(secretSanta);
    return createdSecretSanta.save();
  }

  public async bulkCreate(allocations: SecretSanta[]): Promise<void> {
    await this.secretSantaModel.insertMany(allocations);
  }

  async findAll(): Promise<SecretSanta[]> {
    return this.secretSantaModel.find().exec();
  }

  async findBySecretSantaID(secretSantaID: string): Promise<SecretSanta> {
    return this.secretSantaModel.findById(secretSantaID).exec();
  }

  async update(id: string, secretSanta: SecretSanta): Promise<SecretSanta> {
    return this.secretSantaModel.findByIdAndUpdate(id, secretSanta, {
      new: true,
    });
  }

  async delete(id: string): Promise<SecretSanta> {
    return this.secretSantaModel.findOneAndDelete({ _id: id });
  }
}
