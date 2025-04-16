import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Signup } from '../../models/signup';
import { Article, ArticleItem, Autor, AutorItem } from '../../models/article';

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {
  api = `${environment.apiUrl}Artigos`;

  constructor(private clienteHttp: HttpClient) { }

  getArticles(pagina: number, quantidade:number): Observable<Article> {
    return this.clienteHttp.get<Article>(this.api + '?Pagina=' + pagina + '&Tamanho=' + quantidade);
  }

  getArticlesById(idArticle: string): Observable<ArticleItem> {
    return this.clienteHttp.get<ArticleItem>(this.api + '/id?id=' + idArticle);
  }

  postArticles(newArticle: FormData): Observable<Article>{
    return this.clienteHttp.post<Article>(this.api + '/', newArticle)
  }

  putArticles(id: string, newArticle: ArticleItem): Observable<Article>{
    return this.clienteHttp.put<Article>(this.api + '/' + id, newArticle)
  }

  deleteArticle(idArticle: string): Observable<object>{
    return this.clienteHttp.delete(this.api + '/' + idArticle)
  }

  getAutores(): Observable<Autor> {
    return this.clienteHttp.get<Autor>(`${environment.apiUrl}Autores`);
  }
}
