import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsString,
  ArrayMinSize,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ async: false })
class UniqueEmailsConstraint implements ValidatorConstraintInterface {
  validate(emails: string[]): boolean {
    const uniqueEmails = new Set(emails);
    return uniqueEmails.size === emails.length;
  }

  defaultMessage(): string {
    return 'The emails array contains duplicate email addresses';
  }
}

@ValidatorConstraint({ async: false })
class CreatorNotInEmailsConstraint implements ValidatorConstraintInterface {
  validate(emails: string[], args: ValidationArguments): boolean {
    const { object } = args;
    const creatorEmail = object['creatorEmail'];
    return !emails.includes(creatorEmail);
  }

  defaultMessage(): string {
    return 'The creator email should not be included in the emails array';
  }
}

export class CreateGroupDto {
  @IsString()
  @IsNotEmpty()
  groupName: string;

  @IsString()
  description?: string;

  @IsEmail()
  @IsNotEmpty()
  creatorEmail: string;

  @IsArray()
  @IsEmail({}, { each: true })
  @ArrayMinSize(1, {
    message: 'The emails array must contain at least 1 members',
  })
  @Validate(UniqueEmailsConstraint, {
    message: 'The emails array contains duplicate email addresses',
  })
  @Validate(CreatorNotInEmailsConstraint, {
    message: 'The creator email should not be included in the emails array',
  })
  emails: string[];

  @IsString()
  @IsNotEmpty()
  welcomeMessage: string;
}
