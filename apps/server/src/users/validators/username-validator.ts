import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
@Injectable()
export class IsValidUsernameConstraint implements ValidatorConstraintInterface {
  validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> | boolean {
    if (!value) return false;

    const username = value as string;

    let errorMessage: string | undefined;

    if (username.length < 4) {
      errorMessage = 'Username must be at least 4 characters long.';
    }

    const usernameRegex = /^[a-zA-Z0-9]*$/;
    if (!usernameRegex.test(username)) {
      errorMessage = 'Username must contain only alphanumeric characters.';
    }

    if (errorMessage) {
      if (validationArguments) validationArguments.constraints[0] = errorMessage;
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments): string {
    return (args.constraints[0] as string | undefined) ?? 'Invalid username.';
  }
}

export function IsValidUsername(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [], // Constraints will be dynamically populated
      validator: IsValidUsernameConstraint,
    });
  };
}
