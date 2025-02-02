import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { MemberService } from './member.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { GetMemberQueryDto } from './dto/get-member.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { ValidatePasswordDto } from './dto/validate-password.dto';

@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  async addMember(@Body() createMemberDto: CreateMemberDto) {
    const member = await this.memberService.addMember(createMemberDto);
    return {
      message: 'Member added successfully',
      data: member,
    };
  }

  @Get('/')
  @HttpCode(HttpStatus.OK)
  async getMember(@Query() query: GetMemberQueryDto) {
    const { email, memberID } = query;

    if (email) {
      return this.memberService.getMember(email);
    }
    if (memberID) {
      const member = await this.memberService.getMemberByID(memberID);
      if (!member) {
        throw new HttpException('Member not found', HttpStatus.NOT_FOUND);
      }
      return member;
    }

    throw new HttpException(
      'Either email or memberID must be provided',
      HttpStatus.BAD_REQUEST,
    );
  }

  @Get('/search/:query')
  async searchMembers(@Param('query') query: string) {
    return this.memberService.searchMembers(query);
  }

  @Patch('/:memberID/edit/:name')
  @HttpCode(HttpStatus.ACCEPTED)
  async editName(
    @Param('memberID') memberID: string,
    @Param('name') name: string,
  ) {
    return this.memberService.editName(memberID, name);
  }

  @Post('/:memberID/verify-password')
  async verifyPassword(
    @Param('memberID') memberID: string,
    @Body() validatePasswordDto: ValidatePasswordDto,
  ) {
    const { oldPassword } = validatePasswordDto;

    const isPasswordValid = await this.memberService.verifyPassword(
      memberID,
      oldPassword,
    );
    if (!isPasswordValid) {
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
    }

    return { isValid: true, message: 'Password is correct' };
  }

  @Put(':memberID/password')
  async updatePassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
    @Param('memberID') memberID: string,
  ) {
    const { oldPassword, newPassword } = updatePasswordDto;

    const isPasswordValid = await this.memberService.verifyPassword(
      memberID,
      oldPassword,
    );
    if (!isPasswordValid) {
      throw new HttpException('Invalid old password', HttpStatus.UNAUTHORIZED);
    }

    await this.memberService.updatePassword(memberID, newPassword);

    return { message: 'Password updated successfully' };
  }
}
