import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { User } from '../../models/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  api = `${environment.apiUrl}Usuarios`;

  constructor(private clienteHttp: HttpClient) { }

  getUsers(): Observable<User> {
    return this.clienteHttp.get<User>(this.api + '/');
  }
  getUsersById(idUser: string): Observable<User> {
    return this.clienteHttp.get<User>(this.api + '/' + idUser);
  }

  postUser(newUser: FormData): Observable<User>{
    return this.clienteHttp.post<User>(this.api + '/', newUser)
  }

  putUser(idUser: string, newUser: User): Observable<User>{
    return this.clienteHttp.put<User>(this.api + '/' + idUser, newUser)
  }

  deleteUser(idUser: string): Observable<object>{
    return this.clienteHttp.delete(this.api + '/' + idUser)
  }
}
