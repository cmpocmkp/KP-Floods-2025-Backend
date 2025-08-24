import {
  Controller,
  Get,
  Body,
  UseGuards,
  Req,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserOnboardingDto } from './dtos/user-onboarding.dto';
import { ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthorizationHeader } from '../app/swagger.constant';
import { JWTAuthGuard } from '../auth/guards/jwt-auth-guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }


  @ApiBearerAuth(AuthorizationHeader)
  @UseGuards(JWTAuthGuard)
  @Get()
  findAll(@Req() req: Request) {
    return this.usersService.findUser(req['user']);
  }


  @ApiBearerAuth(AuthorizationHeader)
  @UseGuards(JWTAuthGuard)
  @Put('onboard')
  @ApiBody({ type: UserOnboardingDto })
  async onboardUser(
    @Body() userOnboardingDto: UserOnboardingDto,
    @Req() req: Request,
  ): Promise<any> {
    return await this.usersService.onboardUser(req['user'], userOnboardingDto);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //     return this.usersService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //     return this.usersService.remove(+id);
  // }
}
