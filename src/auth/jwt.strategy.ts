import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { User } from './schemas/user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  /**
   * Asynchronously validates a payload by finding a user in the user model
   * based on the provided id. If the user is not found, throws an
   * UnauthorizedException. Otherwise, returns the user.
   *
   * @param {object} payload - The payload containing an id.
   * @param {string} payload.id - The id of the user to validate.
   * @return {Promise<User>} The user found in the user model.
   * @throws {UnauthorizedException} If the user is not found.
   */
  async validate(payload) {
    const { id } = payload;

    const user = await this.userModel.findById(id);

    if (!user) {
      throw new UnauthorizedException('Login first to access this endpoint.');
    }

    return user;
  }
}
