import { BaseQueue } from '@service/queues/base.queue';
import { blockUserWorker } from '@worker/blocked.worker';
import { IBlockedUserJobData } from '@follower/interfaces/follower.interface';

class BlockedUserQueue extends BaseQueue {
  constructor() {
    super('blockedUser');
    this.processJob('addBlockedUserToDB', 5, blockUserWorker.addBlockedUserToDB);
    this.processJob('removeBlockedUserFromDB', 5, blockUserWorker.addBlockedUserToDB);
  }

  public addBlockedUserJob(name: string, data: IBlockedUserJobData): void {
    this.addJob(name, data);
  }
}

export const blockedUserQueue: BlockedUserQueue = new BlockedUserQueue();
