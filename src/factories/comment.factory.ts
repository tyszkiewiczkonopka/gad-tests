import { AddCommentModel } from '../models/comment.model';
import { faker } from '@faker-js/faker/locale/en';

export function prepareRandomNewComment(bodySentences = 5): AddCommentModel {
  const body = faker.lorem.sentences(bodySentences);
  const newComment: AddCommentModel = { body: body }; //jawna deklaracja typu

  return newComment;
}
