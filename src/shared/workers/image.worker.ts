import { notificationService } from '@service/db/notification.service';
import { DoneCallback, Job } from 'bull';
import Logger from 'bunyan';
import { config } from '@root/config';
import { imageService } from '@service/db/image.service';


const log: Logger = config.createLogger('imageWorker');

class ImageWorker {
  async addUserProfileImageToDB(job: Job, done: DoneCallback): Promise<void> {
    try {
      const { key, value, imgId, imgVersion } = job.data;
      //send email
      await imageService.addUserProfileImageToDB(key, value, imgId, imgVersion);
      job.progress(100);
      done(null, job.data);
    } catch (error) {
      log.error(error);
    }
  }

  async updateBGImageInDB(job: Job, done: DoneCallback): Promise<void> {
    try {
      const { key, imgId, imgVersion } = job.data;
      //send email
      await imageService.addBackgroundImageToDB(key, imgId, imgVersion);
      job.progress(100);
      done(null, job.data);
    } catch (error) {
      log.error(error);
    }
  }

  async addImageToDB(job: Job, done: DoneCallback): Promise<void> {
    try {
      const { key, imgId, imgVersion } = job.data;
      //send email
      await imageService.addImage(key, imgId, imgVersion, '');
      job.progress(100);
      done(null, job.data);
    } catch (error) {
      log.error(error);
    }
  }

  async removeImageFromDB(job: Job, done: DoneCallback): Promise<void> {
    try {
      const { imageId } = job.data;
      //send email
      await imageService.removeImageFromDB(imageId);
      job.progress(100);
      done(null, job.data);
    } catch (error) {
      log.error(error);
    }
  }
}

export const imageWorker: ImageWorker = new ImageWorker();
