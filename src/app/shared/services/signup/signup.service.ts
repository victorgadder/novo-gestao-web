import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Signup } from '../../models/signup';

@Injectable({
  providedIn: 'root'
})
export class SignupService {
  api = `${environment.apiUrl}Usuarios`;

  constructor(private clienteHttp: HttpClient) { }

  getSignups(): Observable<Signup> {
    return this.clienteHttp.get<Signup>(this.api + '/');
  }

  getSignupsById(idSignup: string): Observable<Signup> {
    return this.clienteHttp.get<Signup>(this.api + '/' + idSignup);
  }

  postSignup(newSignup: Signup): Observable<Signup>{
    return this.clienteHttp.post<Signup>(this.api + '/', {newSignup})
  }

  putSignup(newSignup: Signup): Observable<Signup>{
    return this.clienteHttp.put<Signup>(this.api + '/', {newSignup})
  }

  deleteSignup(idSignup: string): Observable<object>{
    return this.clienteHttp.delete(this.api + '/' + idSignup)
  }
}
