import logger from "@/services/logger";
import { ApiErrorResponse } from "@/types/response";
import { Request, Response, NextFunction } from "express";
import { ZodObject, ZodError, prettifyError } from "zod";

type ValidationErrorDetails = {
  errors: Array<{
    location: string | number | symbol | undefined;
    field: string;
    message: string;
  }>;
}

export const validate = (schema: ZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      req.body = parsed['body'] as Request['body'];
      Object.assign(req.query, parsed['query']);
      Object.assign(req.params, parsed['params']);

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        logger.info(`Validation failed for ${req.method} ${req.url}`);
        logger.debug(`Validation Errors: ${prettifyError(error)}`);
        return res.status(400).json({
          success: false,
          message: 'Validation Failed',
          data: {
            errors: error.issues.map(err => ({
              location: err.path[0],
              field: err.path.slice(1).join('.'),
              message: err.message,
            })),
          }
        } satisfies ApiErrorResponse<ValidationErrorDetails>);
      }
      res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      } satisfies ApiErrorResponse);
    }
  };

export default validate;