import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { UsersService } from '../../../shared/services/users/users.service';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { User } from '../../../shared/models/user';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-list-user',
  standalone: true,
  imports: [FormsModule, InputSwitchModule , TableModule, CommonModule, ButtonModule, MatIcon, RouterLink],
  templateUrl: './list-user.component.html',
  styleUrl: './list-user.component.scss'
})
export class ListUserComponent implements OnInit {
  Userslist: User[] = [];

  constructor(private usersService: UsersService, private router: Router) {}

  ngOnInit() {
    this.loadUsers();
  }

  // Carrega os usuários
  loadUsers() {
    this.usersService.getUsers().subscribe({
      next: (response: any) => {
        this.Userslist = response;
      },
    });
  }

  // Alterna o status e atualiza no backend
  toggleStatus(user: User) {
    // Faz uma cópia do usuário para evitar modificar diretamente o objeto original
    const updatedUser = { ...user, ativo: user.ativo };
    // Envia a atualização para o backend
    this.usersService.putUser(user.id, updatedUser).subscribe({
      next: (response: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Sucesso',
          text: 'Status atualizado com sucesso!',
          showConfirmButton: false,
          timer: 2000
        });
        // Atualiza o status localmente após sucesso
        user.ativo = updatedUser.ativo;
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Erro ao atualizar status do usuário!',
          showConfirmButton: false,
          timer: 3000
        });
      }
    });
  }

  deleteUsers(id: string) {
    Swal.fire({
      icon: 'warning',
      title: 'Deseja realmente excluir?',
      text: 'Não é possível reverter essa ação',
      showCancelButton: true,
      confirmButtonText: `Deletar`,
      confirmButtonColor: '#dc3545',
    }).then((result) => {
      if (result.isConfirmed) {
        this.usersService.deleteUser(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Sucesso',
              text: 'Usuário excluído com sucesso!',
              showConfirmButton: false,
              timer: 3000
            });
            this.loadUsers();
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Erro',
              text: 'Erro ao excluir usuário!',
              showConfirmButton: false,
              timer: 3000
            });
          }
        });
      }
    });
  }

  editUsers(id: string) {
    this.router.navigate(['/home/users/edit/' + id]);
  }

  formatarData(data: string): string {
    return new Date(data).toLocaleDateString();
  }
}