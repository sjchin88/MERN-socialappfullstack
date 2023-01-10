import { followerQueue } from '@service/queues/follower.queue';
import { IFollowerData } from '@follower/interfaces/follower.interface';
import { UserCache } from '@service/redis/user.cache';
import HTTP_STATUS from 'http-status-codes';
import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { FollowerCache } from '@service/redis/follower.cache';
import { IUserDocument } from '@user/interfaces/user.interface';
import mongoose from 'mongoose';
import { socketIOFollowerObject } from '@socket/follower';

const followerCache: FollowerCache = new FollowerCache();
const userCache: UserCache = new UserCache();


export class Add {
  public async follower(req: Request, res: Response): Promise<void> {
    const { followeeId } = req.params;
    // update count in cache
    const followersCount: Promise<void> = followerCache.updateFollowersCountInCache(`${followeeId}`, 'followersCount', 1 );
    // followerId is the same as req.currentUser!.userId
    const followeeeCount: Promise<void> = followerCache.updateFollowersCountInCache(`${req.currentUser!.userId}`, 'followingCount', 1 );
    await Promise.all([followersCount, followeeeCount]);

    const cachedFollowee: Promise<IUserDocument> = userCache.getUserFromCache(followeeId) as Promise<IUserDocument>;
    const cachedFollower: Promise<IUserDocument> = userCache.getUserFromCache(`${req.currentUser!.userId}`) as Promise<IUserDocument>;
    const response: [IUserDocument, IUserDocument] = await Promise.all([cachedFollowee, cachedFollower]);

    const followerObjectId: ObjectId = new ObjectId();
    const addFollowerData: IFollowerData = Add.prototype.userData(response[1]);
    // send data to client with socketIO
    socketIOFollowerObject.emit('add follower', addFollowerData);

    const addFolloweeToCache: Promise<void> = followerCache.saveFollowerToCache(`following:${req.currentUser!.userId}`, `${followeeId}`);
    const addFollowerToCache: Promise<void> = followerCache.saveFollowerToCache(`followers:${followeeId}`, `${req.currentUser!.userId}`);
    await Promise.all([addFolloweeToCache, addFollowerToCache]);

    //Add the job to queue to be processed and added to the database
    followerQueue.addFollowerJob('addFollowerToDB', {
      keyOne: `${req.currentUser!.userId}`,
      keyTwo: `${followeeId}`,
      username: `${req.currentUser!.username}`,
      followerDocumentId: followerObjectId
    });
    res.status(HTTP_STATUS.OK).json({ message: 'Following user now' });
  }

  private userData(user: IUserDocument): IFollowerData {
    return {
      _id: new mongoose.Types.ObjectId(user._id),
      username: user.username!,
      avatarColor: user.avatarColor!,
      postCount: user.postsCount,
      followersCount: user.followersCount,
      followingCount: user.followingCount,
      profilePicture: user.profilePicture,
      uId: user.uId!,
      userProfile: user
    };
  }

}
