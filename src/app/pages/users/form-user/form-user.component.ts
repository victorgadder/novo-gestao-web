import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../../../shared/services/users/users.service';
import { AuthService } from '../../../shared/services/auth/auth.service';

// ... imports permanecem os mesmos

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-user.component.html',
  styleUrls: ['./form-user.component.scss']
})
export class FormUserComponent implements OnInit {
  userForm: FormGroup;
  userId: string | null = null;
  isEditMode = false;
  isProfileEdit = false;
  usuario: any;
  avatarBase64: string | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UsersService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      id: [null],
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      avatar: [null],
      avatarBase64: [null],
      ativo: [true]
    });
  }

  ngOnInit(): void {
    this.isProfileEdit = this.router.url === '/profile';

    if (this.isProfileEdit) {
      this.isEditMode = true;
      const loggedUser = this.authService.getUserInfo()?.usuario;
      if (loggedUser) {
        this.userForm.patchValue(loggedUser);
      }
    } else {
      this.userId = this.route.snapshot.paramMap.get('id');
      if (this.userId) {
        this.isEditMode = true;
        this.loadUser(this.userId);
      }
    }
  }

  private loadUser(userId: string): void {
    this.userService.getUsersById(userId).subscribe(user => {
      this.usuario = user;
      this.userForm.patchValue(user);
      this.avatarBase64 = user.avatar;
    });
  }

  getAvatarUrl(avatar: string | null): string {
    if (!avatar) {
      return `assets/logo_icon.svg`;
    }
  
    if (avatar.startsWith('data:image')) {
      return avatar; // imagem já está em base64
    }
  
    if (avatar.startsWith('http')) {
      return avatar; // já é uma URL completa
    }
  
    // caso venha só o nome do arquivo
    return `https://gestao-hml.azurewebsites.net/uploads/avatars/${avatar}`;
  }
  

  triggerFileInput(): void {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fileInput?.click();
  }

  onFileSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.previewImage(file);
      this.convertToBase64(file);
    }
  }

  previewImage(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      this.avatarBase64 = base64;
      this.userForm.get('avatarBase64')?.setValue(base64);
    };
    reader.readAsDataURL(file);
  }

  convertToBase64(file: File): void {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Result = reader.result as string;
      const finalBase64 = base64Result.startsWith('data:image')
        ? base64Result
        : `data:image/jpeg;base64,${base64Result}`;
      this.userForm.get('avatarBase64')?.setValue(finalBase64);
    };
    reader.readAsDataURL(file);
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.isEditMode ? this.onEdit() : this.onCreate();
    } else {
      Swal.fire('Formulário inválido!', 'Preencha todos os campos obrigatórios.', 'warning');
      this.userForm.markAllAsTouched();

      const firstInvalidControl = document.querySelector('.is-invalid') as HTMLElement;
      if (firstInvalidControl) {
        firstInvalidControl.focus();
      }
    }
  }

  private createFormData(): any {
    let avatarBase64 = this.userForm.get('avatarBase64')?.value;
    if (avatarBase64 && avatarBase64.includes('base64,')) {
      avatarBase64 = avatarBase64.split('base64,')[1];
    }

    return {
      id: this.userForm.get('id')?.value,
      nome: this.userForm.get('nome')?.value,
      email: this.userForm.get('email')?.value,
      ativo: this.userForm.get('ativo')?.value,
      avatar: this.userForm.get('avatar')?.value,
      avatarBase64: avatarBase64
    };
  }

  private onCreate(): void {
    const formData = this.userForm.value;
    this.userService.postUser(formData).subscribe({
      next: () => {
        Swal.fire('Sucesso', 'Usuário cadastrado com sucesso!', 'success');
        this.router.navigate(this.isProfileEdit ? ['/home'] : ['/home/users']);
      },
      error: () => {
        Swal.fire('Erro', 'Erro ao cadastrar usuário!', 'error');
      }
    });
  }

  private onEdit(): void {
    const formData = this.createFormData();
    this.userService.putUser(formData.id, formData).subscribe({
      next: () => {
        Swal.fire('Sucesso', 'Usuário editado com sucesso!', 'success');
        const redirectPath = this.isProfileEdit ? '/home/profile' : '/home/users';
        this.router.navigate(this.isProfileEdit ? ['/home'] : ['/home/users']);
      },
      error: () => {
        Swal.fire('Erro', 'Erro ao editar usuário!', 'error');
      }
    });
  }
  

  onCancel(): void {
    const targetRoute = this.isProfileEdit ? ['/home'] : ['/home/users'];
  
    if (this.userForm.dirty) {
      Swal.fire({
        title: 'Alterações não salvas',
        text: 'Você tem certeza que deseja sair? As alterações feitas serão perdidas.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sair assim mesmo',
        cancelButtonText: 'Continuar'
      }).then(result => {
        if (result.isConfirmed) {
          this.router.navigate(targetRoute);
        }
      });
    } else {
      this.router.navigate(targetRoute);
    }
  }
  
  
}
