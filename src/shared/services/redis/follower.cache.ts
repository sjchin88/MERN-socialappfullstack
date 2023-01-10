import { UserCache } from '@service/redis/user.cache';
import { ServerError } from '@global/helpers/error-handler';
import { BaseCache } from '@service/redis/base.cache';
import { config } from '@root/config';
import Logger from 'bunyan';
import { IFollowerData } from '@follower/interfaces/follower.interface';
import { IUserDocument } from '@user/interfaces/user.interface';
import mongoose from 'mongoose';
import { remove } from 'lodash';
import { Helpers } from '@global/helpers/helpers';

const log: Logger = config.createLogger('followersCache');
const userCache: UserCache = new UserCache();

export class FollowerCache extends BaseCache {
  constructor() {
    super('followersCache');
  }

  /**
   * Save follower information to cache
   * @param key redis key, option of followers:followeeId (case1) or following:followerId (case2)
   * @param value id of particular user , option of followerId(case1) or followeeId(case2)
   */
  public async saveFollowerToCache(key: string, value: string) : Promise<void> {
    try {
      //Check if the client is open
      if (!this.client.isOpen) {
        await this.client.connect();
      }

      await this.client.LPUSH(key, value);

    } catch (error) {
      log.error(error);
      throw new ServerError('Server error. Try again.');
    }
  }

  /**
   *
   * @param key
   * @param value id of particular user (follower)
   */
  public async removeFollowerFromCache(key: string, value: string) : Promise<void> {
    try {
      //Check if the client is open
      if (!this.client.isOpen) {
        await this.client.connect();
      }

      await this.client.LREM(key, 1, value);

    } catch (error) {
      log.error(error);
      throw new ServerError('Server error. Try again.');
    }
  }

  /**
  * Update followers count property
  * @param userId
  * @param prop Either put followers or following
  * @param value Either put +1 (for adding) or -1 (for removing)
  */
  public async updateFollowersCountInCache(userId: string, prop: string, value: number) : Promise<void> {
    try {
      //Check if the client is open
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      //increment the prop field value associated with the userId by the value amount ,
      await this.client.HINCRBY(`users:${userId}`, prop, value);


    } catch (error) {
      log.error(error);
      throw new ServerError('Server error. Try again.');
    }
  }

  public async getFollowersFromCache(key: string) : Promise<IFollowerData[]> {
    try {
      //Check if the client is open
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      const response: string[] = await this.client.LRANGE(key, 0, -1);
      const list: IFollowerData[] = [];
      for(const item of response) {
        const user: IUserDocument = await userCache.getUserFromCache(item) as IUserDocument;
        const data: IFollowerData = {
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
        list.push(data);
      }

      return list;
    } catch (error) {
      log.error(error);
      throw new ServerError('Server error. Try again.');
    }
  }

  public async updateBlockedUserPropInCache(key: string, prop: string, value: string, type: 'block' | 'unblock') : Promise<void> {
    try {
      //Check if the client is open
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      const response: string = await this.client.HGET(`users:${key}`,prop) as string;
      const multi: ReturnType<typeof this.client.multi> = this.client.multi();
      let blocked: string[] = Helpers.parseJson(response) as string[];
      if (type === 'block') {
        blocked = [...blocked, value];
      } else {
        remove(blocked, (id: string) => id === value);
        blocked = [...blocked];
      }
      const dataToSave: string[] = [`${prop}`, JSON.stringify(blocked)];
      multi.HSET(`users:${key}`, dataToSave);
      await multi.exec();

    } catch (error) {
      log.error(error);
      throw new ServerError('Server error. Try again.');
    }
  }
}
