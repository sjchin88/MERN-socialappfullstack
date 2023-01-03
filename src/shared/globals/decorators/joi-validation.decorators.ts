/* eslint-disable @typescript-eslint/no-explicit-any */
/** Decorators can apply some validation to the function */

import { JoinRequestValidationError } from '@global/helpers/error-handler';
import { Request } from 'express';
import { ObjectSchema } from 'joi';

type IJoiDecorator = (target: any, key: string, descriptor: PropertyDescriptor) => void;

export function joiValidation(schema: ObjectSchema): IJoiDecorator {
  return (_tager: any, _key: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const req: Request = args[0];
      //Either use validateAsync (need call inside try catch) or validate
      const { error } = await Promise.resolve(schema.validate(req.body));
      if (error?.details) {
        throw new JoinRequestValidationError(error.details[0].message);
      }
      return originalMethod.apply(this, args);
    };
    return descriptor;
  };
}
