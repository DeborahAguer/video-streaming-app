import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User, { UserDocument } from '@models/user';
import appEnv from '@utils/appEnv';
import {authService} from '@middlewares/user-authentication';
import { RegistrationInput, LoginInput, FetchMeInput } from '@interfaces/auth-interface'

class UserService {
  static async createUser(input: RegistrationInput): Promise<UserDocument> {
    const { password } = input;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        ...input,
        password: hashedPassword
      });
      await user.save();
      return user;
    } catch (error) {
      throw new Error(`Error registering user: ${error}`);
    }
  }

  static async generateTokens(user: any) {
    try {
      const accessToken = authService.generateToken(user._id);
      const refreshToken = authService.generateRefreshToken(user._id);
      return { accessToken, refreshToken };
    } catch (error) {
      throw new Error(error);
    }
  }

  static async login(input: LoginInput): Promise<{ accessToken: string | null, refreshToken: string | null}> {
    const { email, password } = input;
    try {
      const user = await User.findOne({ email });
      if (!user) return null;

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) return null;
      const { accessToken, refreshToken } = await this.generateTokens(user);
      return { accessToken, refreshToken };
    } catch (error) {
      throw new Error(`Error authenticating user: ${error}`);
    }
  }

  static async getMe(me: FetchMeInput): Promise<UserDocument | null> {
    const { userId } = me;
    try {
      return await User.findById(userId);
    } catch (error) {
      throw new Error('Error fetching user');
    }
  }

  static async me(token: string) {
    try {
      const decoded = jwt.verify(token, appEnv('JWT_SECRET'));
      const { userId } = decoded as FetchMeInput;
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      console.error('Error fetching authenticated user:', error);
      throw new Error(`Authentication failed: ${error}`);
    }
  };
}

export default UserService;
