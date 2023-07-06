import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class GlobalState {
  articles: Article[] = [];
}


export class Article {
  articleImgUrl?: string;
  headline?: string;
  articleId?: number;
  author?: string;
  body?: string;
}
