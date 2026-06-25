import Exercise, { ExerciseAttributes } from "@/models/exercise.model";
import { GetExercisesQuery } from "@/types/exercise.dto";
import { FindAndCountOptions, IncludeOptions, Model, ModelStatic, Op, WhereOptions } from "sequelize";
import { decodeShareCodeToUuid } from "@/services/shareCode.service";
import Force from "@/models/force.model";
import Level from "@/models/level.model";
import Mechanic from "@/models/mechanic.model";
import Equipment from "@/models/equipment.model";
import Category from "@/models/category.model";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { transformModelArr } from "./util";
import logger from "./logger";
import { IModelWithShareCode } from "@/types/base.models";

interface AssociationFilter {
  model: ModelStatic<Model> & IModelWithShareCode;
  uuid?: string;
  name?: string;
}

interface ParsedGetExercisesQuery {
  page: number;
  limit: number;
  offset: number;
  name?: string;
  associationFilters: AssociationFilter[];
}

export class ExerciseService {
  private async parseGetExercisesQuery(query: GetExercisesQuery) {
    const { category, equipment, force, level, limit, mechanic, name, page, } = query;

    const parsedPage = Math.max(1, parseInt(page || '1', 10));
    const parsedLimit = Math.max(1, Math.min(100, parseInt(limit || '10', 10)));
    const offset = (parsedPage - 1) * parsedLimit;

    const associationFilters: AssociationFilter[] = [];

    const parsedGetExercisesQuery: ParsedGetExercisesQuery = {
      page: parsedPage,
      limit: parsedLimit,
      offset,
      associationFilters,
    };
    if (name) parsedGetExercisesQuery.name = name;
    const queryAssociationFilters = [
      { model: Force, value: force, property: 'force' },
      { model: Level, value: level, property: 'level' },
      { model: Mechanic, value: mechanic, property: 'mechanic' },
      { model: Equipment, value: equipment, property: 'equipment' },
      { model: Category, value: category, property: 'category' },
    ]
    for (const { model, value, property } of queryAssociationFilters) {
      const associationFilter: AssociationFilter = {
        model: model,
      };
      if (value) {
        if (value.startsWith(`${model.prefix}-`)) {
          const uuid = decodeShareCodeToUuid(value, model.prefix);
          if (!uuid) {
            return errAsync({
              reason: 'BAD_REQUEST',
              details: `Invalid id for ${property}`
            } as const)
          }
          associationFilter.uuid = uuid;
        } else {
          associationFilter.name = value;
        }
      }
      associationFilters.push(associationFilter);
    }
    return okAsync(parsedGetExercisesQuery);
  }

  private buildIncludeForWhere(associationConfig: AssociationFilter) {
    const { model, uuid, name } = associationConfig;
    const include: IncludeOptions = {
      model,
    };
    const includeWhere: WhereOptions = {};
    if (uuid) {
      includeWhere['id'] = uuid;
    } else if (name) {
      includeWhere['name'] = name;
    }

    if (Object.keys(includeWhere).length > 0) {
      include.where = includeWhere;
      include.required = true;
    }
    return include;
  }

  private buildOptionsForGetExercises(query: ParsedGetExercisesQuery): FindAndCountOptions<ExerciseAttributes> {
    const {
      name,
      associationFilters,
      limit,
      offset,
    } = query;

    const exerciseWhere: WhereOptions<ExerciseAttributes> = {};
    const includeOptions = associationFilters.map(associationFilter => {
      return this.buildIncludeForWhere(associationFilter);
    });
    const findAndCountOptions: FindAndCountOptions<ExerciseAttributes> = {
      limit: limit,
      offset: offset,
      order: [['name', 'ASC']],
      where: exerciseWhere,
      include: includeOptions,
    };

    if (name) {
      exerciseWhere.name = { [Op.iLike]: `%${name}%` };
    }

    return findAndCountOptions;
  }

  async getExercises(query: GetExercisesQuery) {
    const parsedQueryResult = await this.parseGetExercisesQuery(query)
    return await parsedQueryResult.asyncAndThen((parsedQuery: ParsedGetExercisesQuery) => {
      const findAndCountAllOptions = this.buildOptionsForGetExercises(parsedQuery);

      return ResultAsync.fromPromise(
        (async () => {
          const { count, rows } = await Exercise.findAndCountAll(findAndCountAllOptions);

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