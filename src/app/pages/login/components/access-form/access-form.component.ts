import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../shared/services/auth/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-access-form',
  standalone: true,
  imports: [MatFormFieldModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './access-form.component.html',
  styleUrl: './access-form.component.scss'
})
export class AccessFormComponent {
  formGroup: FormGroup;
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {

    if (environment.production) {
      this.formGroup = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        senha: new FormControl('', Validators.required),
      });
    }
    else {
      this.formGroup = new FormGroup({
        email: new FormControl('marcio@almob.com.br', [Validators.required, Validators.email]),
        senha: new FormControl('Teste@123', Validators.required),
      });
    }
  }


  cadastrar() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      this.isLoading = true;
      this.authService.postSignin(this.formGroup.value).subscribe({
        next: () => {
          this.router.navigate(['/home']);
        },
        error: (e) => {

          console.log(e);
          this.isLoading = false;

          Swal.fire({
            icon: "error",
            title: "Erro",
            text: "Usuário ou senha inválidos!",
            showConfirmButton: false,
            timer: 3000
          });
        }
      });
    } else {
      Swal.fire({
        icon: "warning",
        title: "Atenção",
        text: "Preencha todos os campos corretamente!",
        showConfirmButton: false,
        timer: 3000
      });
    }
  }
}
