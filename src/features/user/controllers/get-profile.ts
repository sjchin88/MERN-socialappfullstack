import HTTP_STATUS from 'http-status-codes';
import { Request, Response } from 'express';
import { UserCache } from '@service/redis/user.cache';
import { PostCache } from '@service/redis/post.cache';
import { FollowerCache } from '@service/redis/follower.cache';
import { IAllUsers, IUserDocument } from '@user/interfaces/user.interface';
import { userService } from '@service/db/user.service';
import { IFollowerData } from '@follower/interfaces/follower.interface';
import { followerService } from '@service/db/follower.service';
import mongoose from 'mongoose';
import { Helpers } from '@global/helpers/helpers';
import { IPostDocument } from '@post/interfaces/post.interface';
import { postService } from '@service/db/post.service';

const PAGE_SIZE = 12;
interface IUserAll {
  startIdx: number;
  endIdx: number;
  skip: number;
  userId: string;
}

const userCache: UserCache = new UserCache();
const postCache: PostCache = new PostCache();
const followerCache: FollowerCache = new FollowerCache();

/**
 * Get class allows retrieve of user information
 */
export class Get {
  /**
   * Retrieve all available users other than the requester
   * @param req  HTTP request, only need is page number
   * @param res  HTTP response, contain HTTP status code and a list of user of type IUserDocument
   */
  public async all(req: Request, res: Response): Promise<void> {
    const { page } = req.params;
    //set number of item to skip , for page 1 will be first 10 (PAGE_SIZE)
    const skip: number = (parseInt(page) - 1) * PAGE_SIZE;
    //end index for redis and database
    const endIdx: number = PAGE_SIZE * parseInt(page);
    //start index for redis and database, if skip = 0 this should be 0, else should be next page after n pages
    const startIdx: number = skip === 0 ? skip : skip + 1;
    const allUsers = await Get.prototype.allUsers({
      startIdx,
      endIdx,
      skip,
      userId: `${req.currentUser!.userId}`
    });
    const followers: IFollowerData[] = await Get.prototype.followers(`${req.currentUser!.userId}`);
    res.status(HTTP_STATUS.OK).json({ message: 'Get users', users: allUsers.users, totalUsers: allUsers.totalUsers, followers });
  }

  /**
   * Retrieve current user profile
   * @param req HTTP request, no params/body required, userId will be retrieve from req.currentUser
   * @param res HTTP response, contain HTTP status code and user profile of type IUserDocument
   */
  public async profile(req: Request, res: Response): Promise<void> {
    const cachedUser: IUserDocument = (await userCache.getUserFromCache(`${req.currentUser!.userId}`)) as IUserDocument;
    const existingUser: IUserDocument = cachedUser ? cachedUser : await userService.getUserById(`${req.currentUser!.userId}`);
    res.status(HTTP_STATUS.OK).json({ message: 'Get user profile', user: existingUser });
  }

  /**
   * Retrieve user profile of particular user
   * @param req HTTP request, need to have target userId in req.params
   * @param res HTTP response, contain HTTP status code and user profile of type IUserDocument
   */
  public async profileByUserId(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;
    const cachedUser: IUserDocument = (await userCache.getUserFromCache(userId)) as IUserDocument;
    const existingUser: IUserDocument = cachedUser ? cachedUser : await userService.getUserById(userId);
    res.status(HTTP_STATUS.OK).json({ message: 'Get user profile by id', user: existingUser });
  }

  /**
   * Retrieve selected user's profile and posts
   * @param req HTTP request, need to have target userId, username and uId in req.params
   * @param res HTTP response, contain HTTP status code, user profile of type IUserDocument and user posts of type IPostDocument
   */
  public async profileAndPosts(req: Request, res: Response): Promise<void> {
    const { userId, username, uId } = req.params;
    const userName: string = Helpers.firstLetterUppercase(username);
    const cachedUser: IUserDocument = (await userCache.getUserFromCache(userId)) as IUserDocument;
    const cachedUserPosts: IPostDocument[] = await postCache.getUserPostsFromCache('post', parseInt(uId, 10));
    const existingUser: IUserDocument = cachedUser ? cachedUser : await userService.getUserById(userId);
    const userPosts: IPostDocument[] = cachedUserPosts.length
      ? cachedUserPosts
      : await postService.getPosts({ username: userName }, 0, 100, { createdAt: -1 });
    res.status(HTTP_STATUS.OK).json({ message: 'Get user profile and posts', user: existingUser, posts: userPosts });
  }

  /**
   * Get randomUserSuggestions
   * @param req HTTP request, no params/body required, userId and username will be retrieve from req.currentUser
   * @param res HTTP response, contain HTTP status code and a list of suggested user profiles of type IUserDocument
   */
  public async randomUserSuggestions(req: Request, res: Response): Promise<void> {
    let randomUsers: IUserDocument[] = [];
    const cachedUsers: IUserDocument[] = await userCache.getRandomUsersFromCache(`${req.currentUser!.userId}`, req.currentUser!.username);
    if (cachedUsers.length) {
      randomUsers = [...cachedUsers];
    } else {
      const users: IUserDocument[] = await userService.getRandomUsers(req.currentUser!.userId);
      randomUsers = [...users];
    }
    res.status(HTTP_STATUS.OK).json({ message: 'User suggestions', users: randomUsers });
  }

  /**
   * Private method to retrieve all user
   * @param Object of IUserAll which contain startIdx, endIdx, skip (for use in MongoDB) and userId, note skip will be startIdx - 1 if skip is not zero.
   * @returns list of users of type IUserDocument
   */
  private async allUsers({ startIdx, endIdx, skip, userId }: IUserAll): Promise<IAllUsers> {
    let users;
    let type = '';
    const cachedUsers: IUserDocument[] = (await userCache.getUsersFromCache(startIdx, endIdx, userId)) as IUserDocument[];
    if (cachedUsers.length) {
      type = 'redis';
      users = cachedUsers;
    } else {
      type = 'mongodb';
      users = await userService.getAllUsers(userId, skip, endIdx);
    }
    const totalUsers: number = await Get.prototype.usersCount(type);
    return { users, totalUsers };
  }

  /**
   * Private method to return the total count of all users
   * @param type specify to get the count from 'redis' or 'mongodb'
   * @returns the total user count of type number
   */
  private async usersCount(type: string): Promise<number> {
    let totalUsers = 0;
    if (type === 'redis') {
      totalUsers = await userCache.getTotalUsersInCache();
    } else {
      totalUsers = await userService.getTotalUsersInDB();
    }
    return totalUsers;
  }

  /**
   * Retrieve the list of followers
   * @param userId userId of followee (the one being followed)
   * @returns list of followers of type IFollowerData
   */
  private async followers(userId: string): Promise<IFollowerData[]> {
    const cachedFollowers: IFollowerData[] = await followerCache.getFollowersFromCache(`followers:${userId}`);
    const result = cachedFollowers.length ? cachedFollowers : await followerService.getFollowerData(new mongoose.Types.ObjectId(userId));
    return result;
  }
}
