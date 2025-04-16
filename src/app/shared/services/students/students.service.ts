import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Student, StudentItem } from '../../models/student';
import { State } from '../../models/state';
import { City } from '../../models/city';

@Injectable({
  providedIn: 'root'
})
export class StudentsService {
  api = `${environment.apiUrl}Alunos`;

  constructor(private clienteHttp: HttpClient) { }

  getStudents(): Observable<Student> {
    return this.clienteHttp.get<Student>(this.api + '/');
  }
  getStudentsById(idStudent: string): Observable<StudentItem> {
    return this.clienteHttp.get<StudentItem>(this.api + '/' + idStudent);
  }

  postStudent(newStudent: FormData): Observable<Student>{
    return this.clienteHttp.post<Student>(this.api + '/', newStudent)
  }

  putStudent(idStudent: string, newStudent: StudentItem): Observable<Student>{
    return this.clienteHttp.put<Student>(this.api + '/' + idStudent, newStudent)
  }

  deleteStudent(idStudent: string): Observable<object>{
    return this.clienteHttp.delete(this.api + '/' + idStudent)
  }

  getStudentsFilter(nome : string, cidade: string, estado: string, pagina: number, quantidade: number): Observable<Student> {
    return this.clienteHttp.get<Student>(this.api + '?Nome=' + nome + '&CidadeId=' + cidade + '&EstadoId=' + estado + '&Pagina=' + pagina + '&Tamanho=' + quantidade);
  }

  getState(): Observable<State[]> {
    return this.clienteHttp.get<State[]>(this.api+'/Estados');
  }

  getCity(): Observable<City[]> {
    return this.clienteHttp.get<City[]>(this.api+'/Cidades');
  }

  getTurmas(): Observable<City[]> {
    return this.clienteHttp.get<City[]>(`${environment.apiUrl}Turmas`);
  }
}
