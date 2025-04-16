import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputSwitchModule } from 'primeng/inputswitch';
import Swal from 'sweetalert2';
import { StudentItem } from '../../../shared/models/student';
import { StudentsService } from '../../../shared/services/students/students.service';
import { Router, RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-list-student',
  standalone: true,
  imports: [FormsModule, TableModule, InputSwitchModule, CommonModule, ButtonModule, MatIcon, RouterLink],
  templateUrl: './list-student.component.html',
  styleUrl: './list-student.component.scss'
})
export class ListStudentComponent implements OnInit {
  studentslist: StudentItem[] = [];
  first = 0;
  rows = 5;
  total = 0;
  page = 1;
  // Filtros
  nome: string = '';
  cidade: string = '';
  estado: string = '';
  constructor(private studentsService: StudentsService, private router: Router) {}

  ngOnInit() {
    this.loadStudents(this.page, this.rows);
  }

  // Carrega os estudantes com os filtros e paginação
  loadStudents(pagina: number, quantidade: number) {
    this.studentsService.getStudentsFilter(this.nome, this.cidade, this.estado, pagina, quantidade).subscribe({
      next: (response: any) => {
        this.total = response.totalRegistros;
        this.studentslist = response.itens;
      },
    });
  }

  next() {
    this.page = this.page + 1;
    this.loadStudents(this.page, this.rows);
  }

  prev() {
    this.page = this.page - 1;
    this.loadStudents(this.page, this.rows);
  }

  reset() {
    this.first = 0;
    this.page = 1;
    this.loadStudents(this.page, this.rows);
  }

  pageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.page = Math.floor(this.first / this.rows) + 1;
    this.loadStudents(this.page, this.rows);
  }

  isLastPage(): boolean {
    return this.studentslist ? this.first === this.total - this.rows : true;
  }

  isFirstPage(): boolean {
    return this.studentslist ? this.first === 0 : true;
  }

  deleteStudent(id: string) {
    Swal.fire({
      icon: 'warning',
      title: 'Deseja realmente excluir?',
      text: 'Não é possível reverter essa ação',
      showCancelButton: true,
      confirmButtonText: `Deletar`,
      confirmButtonColor: '#dc3545',
    }).then((result) => {
      if (result.isConfirmed) {
        this.studentsService.deleteStudent(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Sucesso',
              text: 'Aluno excluído com sucesso!',
              showConfirmButton: false,
              timer: 3000
            })
            this.loadStudents(this.page, this.rows);
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Erro',
              text: 'Erro ao excluir aluno!',
              showConfirmButton: false,
              timer: 3000
            })
        }})
      }
    });
  }
  
  editStudent(id: string) {
    this.router.navigate(['/home/students/edit/' + id]);
  }

  formatarData(data: string): string {  
    return new Date(data).toLocaleDateString();
  }

  // Alterna o status e atualiza no backend
  toggleStatus(student: StudentItem) {
    // Faz uma cópia do usuário para evitar modificar diretamente o objeto original
    const updatedstudent = { ...student, ativo: student.ativo };
    // Envia a atualização para o backend
    this.studentsService.putStudent(student.id, updatedstudent).subscribe({
      next: (response: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Sucesso',
          text: 'Status atualizado com sucesso!',
          showConfirmButton: false,
          timer: 2000
        });
        // Atualiza o status localmente após sucesso
        student.ativo = updatedstudent.ativo;
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Erro ao atualizar status do aluno!',
          showConfirmButton: false,
          timer: 3000
        });
      }
    });
  }
}
