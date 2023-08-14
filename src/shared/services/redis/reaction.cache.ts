import { ServerError } from '@global/helpers/error-handler';
import { BaseCache } from '@service/redis/base.cache';
import { config } from '@root/config';
import Logger from 'bunyan';
import { find } from 'lodash';
import { IReactions, IReactionDocument } from '@reaction/interfaces/reaction.interface';
import { Helpers } from '@global/helpers/helpers';

const log: Logger = config.createLogger('reactionsCache');

//export type PostCacheMultiType = string | number | Buffer | RedisCommandRawReply[] | IPostDocument | IPostDocument[];

/**
 * Export the class and create instance inside controller
 * due to potential connection issue
 */
export class ReactionCache extends BaseCache {
  constructor() {
    super('reactionsCache');
  }

  /**
   * save reaction to the cache
   * @param key
   * @param reaction
   * @param postReactions
   * @param type
   * @param previousReaction
   */
  public async savePostReactionToCache(
    key: string,
    reaction: IReactionDocument,
    postReactions: IReactions,
    type: string,
    previousReaction: string
  ): Promise<void> {
    try {
      //Check if the client is open
      if (!this.client.isOpen) {
        await this.client.connect();
      }

      if (previousReaction) {
        //remove previous reaction
        this.removePostReactionFromCache(key, reaction.username, postReactions);
      }

      if (type) {
        await this.client.LPUSH(`reactions:${key}`, JSON.stringify(reaction));
        const dataToSave: string[] = ['reactions', JSON.stringify(postReactions)];
        await this.client.HSET(`posts:${key}`, dataToSave);
      }
    } catch (error) {
      log.error(error);
      throw new ServerError('Server error. Try again.');
    }
  }

  /**
   *
   * @param key
   * @param reaction
   * @param postReactions
   * @param type
   * @param previousReaction
   */
  public async removePostReactionFromCache(key: string, username: string, postReactions: IReactions): Promise<void> {
    try {
      //Check if the client is open
      if (!this.client.isOpen) {
        await this.client.connect();
      }

      const response: string[] = await this.client.LRANGE(`reactions:${key}`, 0, -1);
      //Use multi() to create multiple redis command and execute all the methods
      const multi: ReturnType<typeof this.client.multi> = this.client.multi();
      const userPreviousReaction: IReactionDocument = this.getPreviousReaction(response, username) as IReactionDocument;
      multi.LREM(`reactions:${key}`, 1, JSON.stringify(userPreviousReaction));
      await multi.exec();

      const dataToSave: string[] = ['reactions', JSON.stringify(postReactions)];
      await this.client.HSET(`posts:${key}`, dataToSave);
    } catch (error) {
      log.error(error);
      throw new ServerError('Server error. Try again.');
    }
  }

  public async getReactionsFromCache(postId: string): Promise<[IReactionDocument[], number]> {
    try {
      //Check if the client is open
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      const reactionsCount: number = await this.client.LLEN(`Reactions:${postId}`);
      const response: string[] = await this.client.LRANGE(`reactions:${postId}`, 0, -1);
      const list: IReactionDocument[] = [];
      for (const item of response) {
        list.push(Helpers.parseJson(item));
      }
      return response.length ? [list, reactionsCount] : [[], 0];
    } catch (error) {
      log.error(error);
      throw new ServerError('Server error. Try again.');
    }
  }

  public async getSingleReactionByUsernameFromCache(postId: string, username: string): Promise<[IReactionDocument, number] | []> {
    try {
      //Check if the client is open
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      const response: string[] = await this.client.LRANGE(`reactions:${postId}`, 0, -1);
      const list: IReactionDocument[] = [];
      for (const item of response) {
        list.push(Helpers.parseJson(item));
      }
      const result: IReactionDocument = find(list, (listItem: IReactionDocument) => {
        return listItem?.postId === postId && listItem?.username === username;
      }) as IReactionDocument;
      return result ? [result, 1] : [];
    } catch (error) {
      log.error(error);
      throw new ServerError('Server error. Try again.');
    }
  }

  /**
   * Helper method to get the reaction for the username
   * @param response
   * @param username
   */
  private getPreviousReaction(response: string[], username: string): IReactionDocument | undefined {
    const list: IReactionDocument[] = [];
    for (const item of response) {
      list.push(Helpers.parseJson(item) as IReactionDocument);
    }

    return find(list, (listItem: IReactionDocument) => {
      return listItem.username === username;
    });
  }
}
