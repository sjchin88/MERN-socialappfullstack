import { notificationService } from '@service/db/notification.service';
import { DoneCallback, Job } from 'bull';
import Logger from 'bunyan';
import { config } from '@root/config';


const log: Logger = config.createLogger('notificationWorker');

class NotificationWorker {
  async updateNotification(job: Job, done: DoneCallback): Promise<void> {
    try {
      const { key } = job.data;
      //send email
      await notificationService.updateNotification( key);
      job.progress(100);
      done(null, job.data);
    } catch (error) {
      log.error(error);
    }
  }

  async deleteNotification(job: Job, done: DoneCallback): Promise<void> {
    try {
      const { key } = job.data;
      //send email
      await notificationService.deleteNotification( key);
      job.progress(100);
      done(null, job.data);
    } catch (error) {
      log.error(error);
    }
  }
}

export const notificationWorker: NotificationWorker = new NotificationWorker();
