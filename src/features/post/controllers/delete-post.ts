import HTTP_STATUS from 'http-status-codes';
import { Request, Response } from 'express';
import { PostCache } from '@service/redis/post.cache';
import { postQueue } from '@service/queues/post.queue';
import { socketIOPostObject } from '@socket/post';

const postCache: PostCache = new PostCache();

export class Delete {
  public async post(req: Request, res: Response): Promise<void> {

    //delete from cache
    await postCache.deletePostFromCache(req.params.postId, `${req.currentUser!.userId}`);
    //emit event
    socketIOPostObject.emit('delete post', req.params.postId);
    //add job to queue
    postQueue.addPostJob('deletePostFromDB', { keyOne: req.params.postId, keyTwo: req.currentUser!.userId });
    //update res.status
    res.status(HTTP_STATUS.OK).json({ message: 'Post deleted successfully' });
  }
}
