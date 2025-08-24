import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    console.log(payload);

    const userExists = await this.userService.getUserById(payload.sub);

    if (userExists) {
      return {
        userId: userExists.id,
        username: userExists.user_name,
        roles: 'user',
      };
    }

    // const systemUserExists = await this.systemUserService.getUserById(payload.sub);

    // if (!systemUserExists) {
    //   throw new UnauthorizedException('Invalid Token');
    // }

    // // Define modules based on roles

    // return {
    //   userId: systemUserExists._id,
    //   username: systemUserExists.first_name,
    //   roles: systemUserExists.roles,
    //   company_id: systemUserExists?.companies ? systemUserExists?.companies[0] : null
    // };
  }
}
