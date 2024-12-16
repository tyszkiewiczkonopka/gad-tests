import { AddArticleModel } from '../models/article.model';
import { faker } from '@faker-js/faker';

export function randomNewArticle(): AddArticleModel {
  const title = faker.lorem.sentence();
  const body = faker.lorem.paragraphs(3);

  const newArticle: AddArticleModel = { title: title, body: body }; //jawna deklaracja typu

  return newArticle;
}
