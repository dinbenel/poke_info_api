import { Injectable } from '@nestjs/common';
import { CreatePokemonDto, UpdatePokemonDto } from './dto/pokemon.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { Pokemon as Poke } from './types/pokemon.type';
import { Model } from 'mongoose';
import axios from 'axios';
import { Sprites } from './entities/sprite.entity';
import { Type } from './entities/type.entity';
import { Move } from './entities/nove.entity';
import { Stat } from './entities/stat.entity';

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
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    const p = await this.pokeModel.create({ name: 'p' });
    return p;
  }

  async findAll() {
    const url = 'https://pokeapi.co/api/v2/pokemon?limit=100';
    const { data } = await axios.get(url);
    const pokPrm = data.results.map((d) => axios.get(d.url));
    const res = await Promise.all(pokPrm);
    const pokeData = res.map((r) => r.data) as Poke[];
    // const idx = await this.pokeModel.listIndexes();
    // console.log(idx);
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
      // const m = await Promise.all(moves);
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
      // const types = await Promise.all(typesPrm);
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
      console.log(pDb);
      if (pDb) {
        console.log('DUP');
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
        });
        pokeDbPrm.push(prm);
      }
      const resDb = await Promise.all(pokeDbPrm);
      console.log(resDb);
    }

    return 'p';
  }

  findOne(id: number) {
    return `This action returns a #${id} pokemon`;
  }

  update(id: number, updatePokemonDto: UpdatePokemonDto) {
    return `This action updates a #${id} pokemon`;
  }

  async remove() {
    const prm = [
      this.moveModel.deleteMany(),
      this.pokeModel.deleteMany(),
      this.spriteModel.deleteMany(),
      this.typeModel.deleteMany(),
      this.statModel.deleteMany(),
    ];
    await Promise.all(prm);
    return `This action removes a  pokemon`;
  }
}
