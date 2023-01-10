import { socketIONotificationObject } from '@socket/notification';
import HTTP_STATUS from 'http-status-codes';
import { Request, Response } from 'express';
import { notificationQueue } from '@service/queues/notification.queue';



export class Update {
  public async notification(req: Request, res: Response): Promise<void> {
    const { notificationId } = req.params;
    //Send the new event back to the client
    socketIONotificationObject.emit('update notification', notificationId);
    notificationQueue.addNotificationJob('updateNotification', { key: notificationId });

    res.status(HTTP_STATUS.OK).json({ message: 'Notification marked as read' });
  }
}
