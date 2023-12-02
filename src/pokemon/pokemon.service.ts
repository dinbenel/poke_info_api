import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { Pokemon as Poke } from './types/pokemon.type';
import { Model } from 'mongoose';
import { Sprites } from './entities/sprite.entity';
import { Type } from './entities/type.entity';
import { Move } from './entities/nove.entity';
import { Stat } from './entities/stat.entity';
import axios from 'axios';
import { LoggerService } from 'src/logger/logger.service';
import { AddFavDto, UpdatePokemonDto } from './dto/pokemon.dto';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokeModel: Model<Pokemon>,
    @InjectModel(Type.name)
    private readonly typeModel: Model<Type>,
    @InjectModel(Sprites.name)
    private readonly spriteModel: Model<Sprites>,
    @InjectModel(Stat.name)
    private readonly statModel: Model<Stat>,
    @InjectModel(Move.name)
    private readonly moveModel: Model<Move>,
    private readonly log: LoggerService,
  ) {}

  async findAll(limit: string): Promise<Pokemon[]> {
    try {
      const pokemon = await this.pokeModel
        .find({})
        .limit(parseInt(limit))
        .populate(['sprites', 'types', 'moves'])
        .lean()
        .exec();
      return pokemon;
    } catch (error) {
      this.log.error(`ERROR FIND ALL ${error}`, PokemonService.name);
    }
  }

  async findOne(id: string): Promise<Pokemon> {
    try {
      const poke = await this.pokeModel.findById(id).lean().exec();
      return poke;
    } catch (error) {
      this.log.error(`ERROR FIND BY ID ${error}`, PokemonService.name);
    }
  }

  async addToFav({ pokeId, userId }: AddFavDto): Promise<void> {
    try {
      await this.pokeModel.findByIdAndUpdate(pokeId, {
        $push: { likeBy: { userId } },
      });
    } catch (error) {
      this.log.error(`ERROR ADD TO FAV ${error}`, PokemonService.name);
    }
  }

  async update({ pokeId, name }: UpdatePokemonDto): Promise<void> {
    try {
      const poke = await (
        await this.pokeModel.findById(pokeId)
      ).populate('User');
      poke.creator._id;
      await this.pokeModel.findByIdAndUpdate(pokeId, {
        $set: {
          name,
        },
      });
    } catch (error) {
      this.log.error(`ERROR UPDATE POKEMON ${error}`, PokemonService.name);
    }
  }

  private async _seed() {
    const url = 'https://pokeapi.co/api/v2/pokemon?limit=100';
    const { data } = await axios.get(url);
    const pokPrm = data.results.map((d) => axios.get(d.url));
    const res = await Promise.all(pokPrm);
    const pokeData = res.map((r) => r.data) as Poke[];

    for (let p of pokeData) {
      const moves = [];
      for (let m of p.moves) {
        const mov = await this.moveModel.findOne({ name: m.move.name }).exec();
        if (mov) {
          moves.push({
            _id: mov._id,
          });
        } else {
          const dbMove = await this.moveModel.create({
            name: m.move.name,
            url: m.move.url,
          });
          moves.push({
            _id: dbMove._id,
          });
        }
      }
      const types = [];
      for (let t of p.types) {
        const type = await this.typeModel.findOne({ name: t.type.name }).exec();
        if (type) {
          types.push({
            _id: type._id,
          });
        } else {
          const typeC = await this.typeModel.create({
            name: t.type.name,
            url: t.type.url,
          });
          types.push({
            _id: typeC._id,
          });
        }
      }

      const stats = p.stats.reduce((acc, curr) => {
        acc[curr.stat.name] = curr.base_stat;
        acc['name'] = p.name;
        acc['effort'] = curr.effort;
        return acc;
      }, {});

      const stat = await this.statModel.findOne({ name: p.name });
      let statId;
      if (stat) {
        statId = stat._id;
      } else {
        const statDb = await this.statModel.create(stats);
        statId = statDb._id;
      }

      let spriteId;
      const sprite = await this.spriteModel
        .findOne({
          $and: [
            { back_default: p.sprites.back_default },
            { back_shiny: p.sprites.back_shiny },
            { front_default: p.sprites.front_default },
            { front_shiny: p.sprites.front_shiny },
          ],
        })
        .exec();
      if (sprite) {
        spriteId = sprite._id;
      } else {
        const sp = await this.spriteModel.create({
          back_default: p.sprites.back_default,
          back_shiny: p.sprites.back_shiny,
          front_default: p.sprites.front_default,
          front_shiny: p.sprites.front_shiny,
        });
        spriteId = sp._id;
      }
      const pokeDbPrm = [];
      const pDb = await this.pokeModel.findOne({ name: p.name });

      if (pDb) {
        continue;
      } else {
        const prm = this.pokeModel.create({
          moves,
          name: p.name,
          height: p.height,
          weight: p.weight,
          order: p.order,
          sprites: spriteId,
          types,
          stats: statId,
          likeBy: [],
        });
        pokeDbPrm.push(prm);
      }
      await Promise.all(pokeDbPrm);
    }
  }

  private async _clearDb() {
    const prm = [
      this.moveModel.deleteMany(),
      this.pokeModel.deleteMany(),
      this.spriteModel.deleteMany(),
      this.typeModel.deleteMany(),
      this.statModel.deleteMany(),
    ];
    await Promise.all(prm);
  }
}
