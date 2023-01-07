import { UserCache } from '@service/redis/user.cache';
import { IFollowerData, IFollowerDocument } from '@follower/interfaces/follower.interface';
import { FollowerModel } from '@follower/models/follower.schema';
import { INotificationDocument, INotificationTemplate } from '@notification/interfaces/notification.interface';
import { NotificationModel } from '@notification/models/notification.schema';
import { IQueryComplete, IQueryDeleted } from '@post/interfaces/post.interface';
import { notificationTemplate } from '@service/emails/templates/notifications/notification-template';
import { emailQueue } from '@service/queues/email.queue';
import { socketIONotificationObject } from '@socket/notification';
import { IUserDocument } from '@user/interfaces/user.interface';
import { UserModel } from '@user/models/user.schema';
import { ObjectId, BulkWriteResult } from 'mongodb';
import mongoose, { Query } from 'mongoose';

const userCache: UserCache = new UserCache();

class FollowerService{
  public async addFollowerToDB(userId: string, followeeId: string, username: string, followerDocumentId: ObjectId): Promise<void> {
    const followeeObjectId: ObjectId = new mongoose.Types.ObjectId(followeeId);
    const followerObjectId: ObjectId = new mongoose.Types.ObjectId(userId);

    //Create document inside follower model collection
    const following = await FollowerModel.create({
      _id: followerDocumentId,
      followeeId: followeeObjectId,
      followerId: followerObjectId
    });

    // Use bulkWrite to update multiple
    const users: Promise<BulkWriteResult> = UserModel.bulkWrite([
      {
        updateOne: {
          //use filter to find id matching userId
          filter: { _id: userId },
          update: { $inc: { followingCount: 1 } }
        }
      },
      {
        updateOne: {
          //use filter to find id matching followeeId
          filter: { _id: followeeId },
          update: { $inc: { followersCount: 1 } }
        }
      },
    ]);

    const response: [BulkWriteResult, IUserDocument | null ] = await Promise.all([users, userCache.getUserFromCache(followeeId)]);

    //if IUserDocument.notification.comment setting is true
    if (response[1]?.notifications.follows && userId !== followeeId) {
      const notificationModel: INotificationDocument = new NotificationModel();
      const notifications = await notificationModel.insertNotification({
        userFrom: userId,
        userTo: followeeId,
        message: `${username} is now following you.`,
        notificationType: 'follows',
        entityId: new mongoose.Types.ObjectId(userId),
        createdItemId: new mongoose.Types.ObjectId(following._id),
        createdAt: new Date(),
        comment: '',
        post: '',
        imgId: '',
        imgVersion: '',
        gifUrl: '',
        reaction: ''
      });
      //send notification to client with socket io
      socketIONotificationObject.emit('insert notification', notifications, { userTo: followeeId });
      // send to email queue.
      const templateParams: INotificationTemplate = {
        username: response[1].username!,
        message: `${username} is now following you.`,
        header: 'Follower Notification'
      };

      const template: string = notificationTemplate.notificationMessageTemplate(templateParams);
      emailQueue.addEmailJob('followersEmail', { receiverEmail: response[1].email!, template, subject: `${username} is now following you.` });
    }
  }

  public async removeFollowerFromDB(followeeId: string, followerId: string): Promise<void> {
    const followeeObjectId: ObjectId = new mongoose.Types.ObjectId(followeeId);
    const followerObjectId: ObjectId = new mongoose.Types.ObjectId(followerId);

    const unfollow: Query<IQueryComplete & IQueryDeleted, IFollowerDocument> = FollowerModel.deleteOne({
      followeeId: followeeObjectId,
      followerId: followerObjectId
    });

    // Use bulkWrite to update multiple
    const users: Promise<BulkWriteResult> = UserModel.bulkWrite([
      {
        updateOne: {
          //use filter to find id matching userId
          filter: { _id: followerId },
          update: { $inc: { followingCount: -1 } }
        }
      },
      {
        updateOne: {
          //use filter to find id matching followeeId
          filter: { _id: followeeId },
          update: { $inc: { followersCount: -1 } }
        }
      },
    ]);

    await Promise.all([unfollow, users]);
  }

  public async getFolloweeData(userObjectId: ObjectId): Promise<IFollowerData[]> {
    const followee: IFollowerData[] = await FollowerModel.aggregate([
      { $match: { followerId: userObjectId } },
      //Lookup look for all user with the followeeId
      { $lookup: { from: 'User', localField: 'followeeId', foreignField: '_id', as: 'followeeId' } },
      { $unwind: '$followeeId' },
      { $lookup: { from: 'Auth', localField: 'followeeId.authId', foreignField: '_id', as: 'authId' } },
      { $unwind: '$authId' },
      {
        $addFields: {
          _id: '$followeeId._id',
          username: '$authId.username',
          avatarColor: '$authId.avatarColor',
          postCount: '$followeeId.postsCount',
          followersCount: '$followeeId.followersCount',
          followingCount: '$followeeId.followingCount',
          profilePicture: '$followeeId.profilePicture',
          uId: '$authId.uId',
          userProfile: '$followeeId',
        }
      },
      {
        $project: {
          authId: 0,
          followerId: 0,
          followeeId: 0,
          createdAt: 0,
          __v:0
        }
      }
    ]);
    return followee;
  }

  public async getFollowerData(userObjectId: ObjectId): Promise<IFollowerData[]> {
    const follower: IFollowerData[] = await FollowerModel.aggregate([
      { $match: { followeeId: userObjectId } },
      //Lookup look for all user with the followeeId
      { $lookup: { from: 'User', localField: 'followerId', foreignField: '_id', as: 'followerId' } },
      { $unwind: '$followerId' },
      { $lookup: { from: 'Auth', localField: 'followerId.authId', foreignField: '_id', as: 'authId' } },
      { $unwind: '$authId' },
      {
        $addFields: {
          _id: '$followerId._id',
          username: '$authId.username',
          avatarColor: '$authId.avatarColor',
          postCount: '$followerId.postsCount',
          followersCount: '$followerId.followersCount',
          followingCount: '$followerId.followingCount',
          profilePicture: '$followerId.profilePicture',
          uId: '$authId.uId',
          userProfile: '$followerId',
        }
      },
      {
        $project: {
          authId: 0,
          followerId: 0,
          followeeId: 0,
          createdAt: 0,
          __v:0
        }
      }
    ]);
    return follower;
  }
}

export const followerService: FollowerService = new FollowerService();
