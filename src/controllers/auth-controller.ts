import { Request, Response } from 'express';
import UserService from '@services/auth-service';
import { LoginInput, RegistrationInput } from '@interfaces/auth-interface';

class UserController {
  static async createUser(req: Request<any, any, RegistrationInput>, res: Response) {
    try {
      const userData = req.body;
      const user = await UserService.createUser(userData);
      res.status(201).json({ success: true, user });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error registering user' });
    }
  }

  static async login(req: Request<any, any, LoginInput>, res: Response) {
    try {
      const userData = req.body;
      const token = await UserService.login(userData);
      if (!token) {
        res.status(401).json({ success: false, message: 'Invalid email or password' });
        return;
      }
      const { accessToken, refreshToken } = token;
      res.status(200).json({ success: true, accessToken, refreshToken });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error logging in user' });
    }
  }

  static async getMe(req: Request, res: Response) {
    try {
      const userId = req.body;
      if (!userId) {
        res.status(401).json({ success: false, message: 'User not authenticated' });
        return;
      }
      const user = await UserService.getMe(userId);
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }
      res.status(200).json({ success: true, user });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error fetching user' });
    }
  }

  static async me(req: Request, res: Response){
    try {
      const token =  req.headers.authorization.split(' ')[1];
  
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const user = await UserService.me(token);

      res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}

export default UserController;
