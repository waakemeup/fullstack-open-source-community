import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import RegisterDTO from './dto/register.dto';
import { Request } from 'express';
import * as argon2 from 'argon2';
import TokenPayload from './interfaces/token-payload.interface';
import PostgresErrorCode from '../database/postgres-errors.enum';
import LoginDTO from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  public async register(registrationData: RegisterDTO, req: Request) {
    const hashedPassword = await argon2.hash(registrationData.password);

    try {
      const createdUser = await this.userService.create({
        ...registrationData,
        password: hashedPassword,
      });

      const accessToken = await this._signAccessToken(createdUser.id);
      const refreshToken = await this._signRefreshToken(createdUser.id);

      await this._setTokens(req, accessToken, refreshToken);

      return {
        user: createdUser,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        if (error.details.includes('email')) {
          throw new HttpException(
            {
              statusCode: 400,
              message: [
                {
                  target: {},
                  value: '',
                  property: 'email',
                  children: [],
                  constraints: {
                    alreadyExist: 'email already exist',
                  },
                },
              ],
              error: 'Bad Request',
            },
            HttpStatus.BAD_REQUEST,
          );
        }
        if (error.detail.includes('username')) {
          throw new HttpException(
            {
              statusCode: 400,
              message: [
                {
                  target: {},
                  value: '',
                  property: 'username',
                  children: [],
                  constraints: {
                    alreadyExist: 'username already exist',
                  },
                },
              ],
              error: 'Bad Request',
            },
            HttpStatus.BAD_REQUEST,
          );
        }
      }
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async login(credentials: LoginDTO, req?: Request) {
    const { email, password } = credentials;
    const user = await this.getAuthenticatedUser(email, password);
    const accessToken = await this._signAccessToken(user.id);
    const refreshToken = await this._signRefreshToken(user.id);

    await this._setTokens(req, accessToken, refreshToken);
    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  public async logout(req: Request) {
    const { x_auth_refresh } = req.cookies;
    const tokenFromRedis = await this.redis.get(x_auth_refresh);

    if (tokenFromRedis) {
      await this.redis.del(x_auth_refresh);
    }
    req.res.clearCookie('x_auth_access');
    req.res.clearCookie('x_auth_refresh');
  }

  public async getAuthenticatedUser(email, password) {
    try {
      const user = await this.userService.getByEmail(email);
      if (!user) {
        throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
      }

      const isMatch = await argon2.verify(user.password, password);
      console.log(isMatch);
      if (!isMatch) {
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
      }
      return user;
    } catch (error) {
      console.log(error);
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }
  }

  public async validateUser(payload: TokenPayload) {
    const user = await this.userService.getById(payload.userId);
    if (!user) {
      throw new HttpException('Invalid tokens', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  public async getUserIfRefreshTokenValid(
    refreshToken: string,
    userId: number,
  ) {
    const user = this.userService.getById(userId);

    // const tokenFromRedis = await this.redis.get(refreshToken)

    // if(!tokenFromRedis) {
    //     throw new HttpException('Invalid tokens', HttpStatus.UNAUTHORIZED)
    // }

    return user;
  }

  private async _signAccessToken(userId: number) {
    const payload: TokenPayload = { userId };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
    });

    return accessToken;
  }

  private async _signRefreshToken(userId: number) {
    const payload: TokenPayload = { userId };
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
    });

    this.redis.setex(
      refreshToken,
      userId,
      process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
    );
    return refreshToken;
  }

  private async _setTokens(
    req: Request,
    accessToken: any,
    refreshToken: string,
  ) {
    req.res.cookie('x_auth_access', accessToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
      sameSite: 'lax',
    });

    req.res.cookie('x_auth_refresh', refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
      sameSite: 'lax',
    });
  }

  public async setNewTokens(req: Request) {
    // @ts-ignore
    const userId = req.user.id;
    const { x_auth_refresh } = req.cookies;

    const accessToken = await this._signAccessToken(userId);
    const refreshToken = await this._signRefreshToken(userId);

    await this._setTokens(req, accessToken, refreshToken);
    await this.redis.del(x_auth_refresh);
    const user = this.userService.getById(userId);
    return user;
  }
}
