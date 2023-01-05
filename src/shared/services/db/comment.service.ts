import { IPostDocument } from '@post/interfaces/post.interface';
import { omit } from 'lodash';
import { Query } from 'mongoose';
import { CommentCache } from '@service/redis/comment.cache';
import { ICommentDocument, ICommentJob, ICommentNameList, IQueryComment } from '@comment/interfaces/comment.interface';
import { CommentsModel } from '@comment/models/comment.schema';
import { PostModel } from '@post/models/post.schema';
import { IUserDocument } from '@user/interfaces/user.interface';
import { UserCache } from '@service/redis/user.cache';

//const commentCache: CommentCache = new CommentCache();
const userCache: UserCache = new UserCache();

class CommentService {
  public async addCommentToDB(commentData: ICommentJob): Promise<void> {
    const { postId, userTo, userFrom, comment, username } = commentData;
    const comments: Promise<ICommentDocument> = CommentsModel.create(comment);
    const post: Query<IPostDocument, IPostDocument> = PostModel.findOneAndUpdate(
      { _id: postId },
      { $inc: { commentsCount: 1 }},
      { new: true }
      ) as Query<IPostDocument, IPostDocument>;

    const user: Promise<IUserDocument> = userCache.getUserFromCache(userTo) as Promise<IUserDocument>;
    const response: [ICommentDocument, IPostDocument, IUserDocument] = await Promise.all([comments, post, user]);
  }

  public async getPostComments(query: IQueryComment, sort: Record<string, 1 | -1>): Promise<ICommentDocument[]> {
    const comments: ICommentDocument[] = await CommentsModel.aggregate([
      { $match: query },
      { $sort: sort }
    ]);
    return comments;
  }

  public async getPostCommentNames(query: IQueryComment, sort: Record<string, 1 | -1>): Promise<ICommentNameList[]> {
    const commentsNamesList: ICommentNameList[] = await CommentsModel.aggregate([
      { $match: query },
      { $sort: sort },
      //Set id equal to null
      //count: set initial value to 1 and continue increment if new value is added
      //$addToSet add to the names
      { $group: { _id: null, names: { $addToSet: '$username' }, count: { $sum: 1 } }},
      //remove the unwanted _id field by setting it to 0 using $project
      { $project: { _id: 0 }}
    ]);
    return commentsNamesList;
  }
}

export const commentService: CommentService = new CommentService();
