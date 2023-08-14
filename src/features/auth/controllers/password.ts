import { forgotPasswordTemplate } from '@service/emails/templates/forgot-password/forgot-password-template';
import { Request, Response } from 'express';
import { config } from '@root/config';
import HTTP_STATUS from 'http-status-codes';
import { authService } from '@service/db/auth.service';
import { BadRequestError } from '@global/helpers/error-handler';
import { IAuthDocument } from '@auth/interfaces/auth.interface';
import { joiValidation } from '@global/decorators/joi-validation.decorators';
import { emailSchema, passwordSchema } from '@auth/schemes/password';
import crypto from 'crypto';
import { emailQueue } from '@service/queues/email.queue';
import { IResetPasswordParams } from '@user/interfaces/user.interface';
import moment from 'moment';
import publicIP from 'ip';
import { resetPasswordTemplate } from '@service/emails/templates/reset-password/reset-password-template';

/**
 * Controller class for password reset service
 */
export class Password {
  /**
   * Create method provide the password reset link to the user via email service
   * @param req HTTP request contain useremail in req.body
   * @param res HTTP response contain HTTP status code only
   */
  @joiValidation(emailSchema)
  public async create(req: Request, res: Response): Promise<void> {
    const { email } = req.body;
    //Get user from authService, if no user, throw error
    const existingUser: IAuthDocument = await authService.getAuthUserByEmail(email);
    if (!existingUser) {
      throw new BadRequestError('Invalid credentials');
    }

    //generate random character as new password
    const randomBytes: Buffer = await Promise.resolve(crypto.randomBytes(20));
    const randomCharacters: string = randomBytes.toString('hex');
    //call the authService updatePasswordToken method, set expiring time of the password
    await authService.updatePasswordToken(`${existingUser._id!}`, randomCharacters, Date.now() * 60 * 60 * 1000);

    //Add reset link, email template, and put these into the emailQueue job
    const resetLink = `${config.CLIENT_URL}/reset-password?token=${randomCharacters}`;
    const template: string = forgotPasswordTemplate.passwordResetTemplate(existingUser.username, resetLink);
    emailQueue.addEmailJob('forgotPasswordEmail', { template, receiverEmail: email, subject: 'Reset your password' });
    //Response to the user
    res.status(HTTP_STATUS.OK).json({ message: 'Password reset email sent.' });
  }

  /**
   * Method to reset (update) the existing password
   * @param req HTTP request contain password and confirmpassword inside req.body, and reset token in req.params
   * @param res HTTP response contain HTTP status code only
   */
  @joiValidation(passwordSchema)
  public async update(req: Request, res: Response): Promise<void> {
    const { password, confirmPassword } = req.body;
    const { token } = req.params;
    if (password !== confirmPassword) {
      throw new BadRequestError('Passwords do not match');
    }
    //Get user from authService, if no user, throw error
    const existingUser: IAuthDocument = await authService.getAuthUserByPasswordToken(token);
    if (!existingUser) {
      throw new BadRequestError('Reset token has expired.');
    }

    existingUser.password = password;
    existingUser.passwordResetExpires = undefined;
    existingUser.passwordResetToken = undefined;
    await existingUser.save();
    //Add reset link, email template, and put these into the emailQueue job
    const templateParams: IResetPasswordParams = {
      username: existingUser.username!,
      email: existingUser.email,
      ipaddress: publicIP.address(),
      date: moment().format('DD//MM//YYYY HH:mm')
    };

    const template: string = resetPasswordTemplate.passwordResetConfirmationTemplate(templateParams);
    emailQueue.addEmailJob('forgotPasswordEmail', { template, receiverEmail: existingUser.email!, subject: 'Password Reset Confirmation' });
    //Response to the user
    res.status(HTTP_STATUS.OK).json({ message: 'Password successfully updated.' });
  }
}
