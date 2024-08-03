import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signIn.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  /**
   * Sign up a new user.
   *
   * @param {SignUpDto} signUpDto - The DTO containing the user's sign up information.
   * @return {Promise<{ access_token: string }>} - A promise that resolves to an object containing the access token.
   * @throws {ConflictException} - If the email entered is already in use.
   */
  async signUp(signUpDto: SignUpDto): Promise<{ access_token: string }> {
    const { name, email, password, role } = signUpDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await this.userModel.create({
        name,
        email,
        password: hashedPassword,
        role,
      });

      const access_token = this.jwtService.sign({ id: user._id });

      return { access_token };
    } catch (error) {
      if (error?.code === 11000) {
        throw new ConflictException('Duplicate Email Entered');
      }
    }
  }

  /**
   * Sign in a user with the provided email and password.
   *
   * @param {SignInDto} signInDto - The DTO containing the user's email and password.
   * @return {Promise<{ access_token: string }>} - A promise that resolves to an object containing the access token.
   * @throws {UnauthorizedException} - If the email or password is invalid.
   */
  async signIn(signInDto: SignInDto): Promise<{ access_token: string }> {
    const { email, password } = signInDto;

    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const access_token = this.jwtService.sign({ id: user._id });

    return { access_token };
  }
}
