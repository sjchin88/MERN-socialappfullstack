import { Password } from '@auth/controllers/password';
import { SignIn } from '@auth/controllers/signin';
import { SignOut } from '@auth/controllers/signout';
import { SignUp } from '@auth/controllers/signup';
import express, { Router } from 'express';

/**
 * Class AuthRoutes contains the mapping of API path to respective controllers
 */
class AuthRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  /**
   * Create router for signup, signin, forgot-password(request reset link), and reset password service
   * @returns router
   */
  public routes(): Router {
    this.router.post('/signup', SignUp.prototype.create);
    this.router.post('/signin', SignIn.prototype.read);
    this.router.post('/forgot-password', Password.prototype.create);
    this.router.post('/reset-password/:token', Password.prototype.update);
    return this.router;
  }

  /**
   * Create Router for signout service
   * @returns signout route
   */
  public signoutRoute(): Router {
    this.router.get('/signout', SignOut.prototype.update);
    return this.router;
  }
}

export const authRoutes: AuthRoutes = new AuthRoutes();
