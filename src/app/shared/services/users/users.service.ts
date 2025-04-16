import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { User } from '../../models/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private readonly api = `${environment.apiUrl}Usuarios`;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User> {
    return this.http.get<User>(`${this.api}/`);
  }

  getUsersById(idUser: string): Observable<User> {
    return this.http.get<User>(`${this.api}/${idUser}`);
  }

  postUser(newUser: User): Observable<User> {
    return this.http.post<User>(`${this.api}/`, newUser);
  }

  putUser(idUser: string, updatedUser: User): Observable<User> {
    return this.http.put<User>(`${this.api}/${idUser}`, updatedUser);
  }

  deleteUser(idUser: string): Observable<object> {
    return this.http.delete(`${this.api}/${idUser}`);
  }
}
