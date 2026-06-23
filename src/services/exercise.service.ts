import Exercise, { ExerciseAttributes } from "@/models/exercise.model";
import { GetExercisesQuery } from "@/types/exercise.dto";
import { Op, WhereOptions } from "sequelize";
import { decodeShareCodeToUuid } from "@/services/shareCode.service";
import Force from "@/models/force.model";
import Level from "@/models/level.model";
import Mechanic from "@/models/mechanic.model";
import Equipment from "@/models/equipment.model";
import Category from "@/models/category.model";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { transformModelArr } from "./util";
import logger from "./logger";

interface ParsedGetExercisesQuery {
  page: number;
  limit: number;
  offset: number;
  name?: string;
  forceId?: string;
  levelId?: string;
  mechanicId?: string;
  equipmentId?: string;
  categoryId?: string;
}

export class ExerciseService {
  private async parseGetExercisesQuery(query: GetExercisesQuery) {
    const { page, limit, name, forceId: forceId, levelId: levelId, mechanicId: mechanicId, equipmentId: equipmentId, categoryId: categoryId } = query;

    const parsedPage = Math.max(1, parseInt(page || '1', 10));
    const parsedLimit = Math.max(1, Math.min(100, parseInt(limit || '10', 10)));
    const offset = (parsedPage - 1) * parsedLimit;

    const parsedGetExercisesQuery: ParsedGetExercisesQuery = {
      page: parsedPage,
      limit: parsedLimit,
      offset,
    };
    if (name) parsedGetExercisesQuery.name = name;
    const foreignKeys = [
      { model: Force, shareCode: forceId, property: 'forceId' as const },
      { model: Level, shareCode: levelId, property: 'levelId' as const },
      { model: Mechanic, shareCode: mechanicId, property: 'mechanicId' as const },
      { model: Equipment, shareCode: equipmentId, property: 'equipmentId' as const },
      { model: Category, shareCode: categoryId, property: 'categoryId' as const },
    ]
    for (const { model, shareCode, property } of foreignKeys) {
      if (shareCode) {
        const uuid = decodeShareCodeToUuid(shareCode, model.prefix);
        if (!uuid) {
          return errAsync({
            reason: 'BAD_REQUEST',
            details: `Invalid id for ${property}`
          } as const)
        }
        parsedGetExercisesQuery[property] = uuid;
      }
    }
    return okAsync(parsedGetExercisesQuery);
  }

  private buildWhereForGetExercises(query: ParsedGetExercisesQuery): WhereOptions<ExerciseAttributes> {
    const {
      categoryId,
      equipmentId,
      forceId,
      levelId,
      mechanicId,
      name,
    } = query;

    const exerciseWhere: WhereOptions<ExerciseAttributes> = {};

    if (name) {
      exerciseWhere.name = { [Op.iLike]: `%${name}%` };
    }

    if (forceId) exerciseWhere.forceId = forceId;
    if (levelId) exerciseWhere.levelId = levelId;
    if (mechanicId) exerciseWhere.mechanicId = mechanicId;
    if (equipmentId) exerciseWhere.equipmentId = equipmentId;
    if (categoryId) exerciseWhere.categoryId = categoryId;

    return exerciseWhere;
  }

  async getExercises(query: GetExercisesQuery) {
    const parsedQueryResult = await this.parseGetExercisesQuery(query)
    return await parsedQueryResult.asyncAndThen((parsedQuery: ParsedGetExercisesQuery) => {
      const exerciseWhere = this.buildWhereForGetExercises(parsedQuery);

      return ResultAsync.fromPromise(
        (async () => {
          const { count, rows } = await Exercise.findAndCountAll({
            where: exerciseWhere,
            limit: parsedQuery.limit,
            offset: parsedQuery.offset,
            order: [['name', 'ASC']],
            include: [
              { model: Force, attributes: ['id', 'name'] },
              { model: Level, attributes: ['id', 'name'] },
              { model: Mechanic, attributes: ['id', 'name'] },
              { model: Equipment, attributes: ['id', 'name'] },
              { model: Category, attributes: ['id', 'name'] },
            ],
          });

          const data = await transformModelArr(rows);

          return {
            data,
            meta: {
              totalItems: count,
              totalPages: Math.ceil(count / parsedQuery.limit),
              currentPage: parsedQuery.page,
              itemsPerPage: parsedQuery.limit,
            },
          };
        })(),
        (error) => {
          logger.error(`ExerciseService.getExercises: Error fetching ExerciseService`);
          logger.debug(error);
          return {
            reason: 'INTERNAL_SERVER_ERROR' as const,
            details: error,
          };
        }
      );
    });
  }
}