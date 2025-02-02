import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export function IsNotSameProperty(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'isNotSameProperty',
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return value !== relatedValue;
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          return `${args.property} should not be the same as ${relatedPropertyName}`;
        },
      },
    });
  };
}

export class RevokeAdminDto {
  @IsString()
  @IsNotEmpty()
  groupID: string;

  @IsString()
  @IsNotEmpty()
  @IsNotSameProperty('memberID', {
    message: 'adminID should not be the same as memberID',
  })
  adminID: string;

  @IsString()
  @IsNotEmpty()
  memberID: string;
}
