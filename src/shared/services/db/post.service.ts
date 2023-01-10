import { IGetPostsQuery, IPostDocument, IQueryComplete, IQueryDeleted } from '@post/interfaces/post.interface';
import { PostModel } from '@post/models/post.schema';
import { IUserDocument } from '@user/interfaces/user.interface';
import { UserModel } from '@user/models/user.schema';
import { Query, UpdateQuery } from 'mongoose';

class PostService {
  public async addPostToDB(userId: string, createdPost: IPostDocument): Promise<void> {
    const post: Promise<IPostDocument> = PostModel.create(createdPost);
    //increment in mongo db , syntax {key}, {$inc: {field to increment: value to increment}} Note -1 for decrement
    const user: UpdateQuery<IUserDocument> = UserModel.updateOne( { _id: userId }, { $inc: {postsCount: 1 } });
    await Promise.all([post, user]);
  }

  /**
   * Get posts from mongo db
   * @param query
   * @param skip
   * @param limit
   * @param sort
   * @returns
   */
  public async getPosts(query: IGetPostsQuery, skip = 0, limit = 0, sort: Record<string, 1 | -1>): Promise<IPostDocument[]> {
    let postQuery = {};
    if (query?.imgId && query?.gifUrl) {
      //Get all document where imgId is not empty or gifUrl is not empty
      postQuery = { $or: [{imgId: { $ne: ' '} }, { gifUrl: { $ne: '' } }] };
    } else if (query?.videoId) {
      //Get all document where videoId is not empty
      postQuery = { $or: [{videoId: { $ne: ' '} }] };
    } else {
      postQuery = query;
    }
    const post: IPostDocument[] = await PostModel.aggregate([
      { $match: postQuery },
      { $sort: sort },
      { $skip: skip },
      { $limit: limit },
    ]);
    return post;
  }

  /**
   * Get the post count for particular user
   */
  public async postsCount(): Promise<number> {
    const count: number = await PostModel.find({}).countDocuments();
    return count;
  }

  /**
   * Delete selected post from db
   */
  public async deletePost(postId: string, userId: string): Promise<void> {
    const deletePost: Query<IQueryComplete & IQueryDeleted, IPostDocument> = PostModel.deleteOne({ _id: postId});
    //TODO - delete reactions
    const decrementPostCount: UpdateQuery<IUserDocument> = UserModel.updateOne({ _id: userId }, { $inc: { postsCount: -1 }});
    await Promise.all([deletePost, decrementPostCount]);
  }

    /**
   * update selected post from db
   */
    public async editPost(postId: string, updatedPost: IPostDocument): Promise<void> {
      const updatePost: UpdateQuery<IUserDocument> = PostModel.updateOne({ _id: postId }, { $set: updatedPost});
      await Promise.all([updatePost]);
    }
}

export const postService: PostService = new PostService();
