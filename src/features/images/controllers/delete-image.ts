import { imageService } from '@service/db/image.service';
import HTTP_STATUS from 'http-status-codes';
import { Request, Response } from 'express';
import { UserCache } from '@service/redis/user.cache';
import { socketIOImageObject } from '@socket/image';
import { IUserDocument } from '@user/interfaces/user.interface';
import { imageQueue } from '@service/queues/image.queue';
import { IFileImageDocument } from '@image/interfaces/image.interface';

const userCache: UserCache = new UserCache();

export class Delete {
  public async image(req: Request, res: Response): Promise<void> {
    const { imageId } = req.params;
    socketIOImageObject.emit('delete image', imageId);
    imageQueue.addImageJob('removeImageFromDB', {
      imageId
    });
    res.status(HTTP_STATUS.OK).json({ message: 'Image deleted successfully' });
  }

  public async backgroundImage(req: Request, res: Response): Promise<void> {
    const image: IFileImageDocument = await imageService.getImageByBackgroundId(req.params.bgImageId);
    socketIOImageObject.emit('delete image', image?._id);

    const bgImageId: Promise<IUserDocument> = userCache.updateSingleUserItemInCache(
      `${req.currentUser!.userId}`,
      'bgImageId',
      ''
    ) as Promise<IUserDocument>;

    const bgImageVersion: Promise<IUserDocument> = userCache.updateSingleUserItemInCache(
      `${req.currentUser!.userId}`,
      'bgImageVersion',
      ''
    ) as Promise<IUserDocument>;

    await Promise.all([bgImageId, bgImageVersion]);


    imageQueue.addImageJob('removeImageFromDB', {
      imageId: image?._id
    });
    res.status(HTTP_STATUS.OK).json({ message: 'Image deleted successfully' });
  }

}
