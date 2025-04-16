import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { StudentsService } from '../../../shared/services/students/students.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-form-student',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './form-student.component.html',
  styleUrls: ['./form-student.component.scss']
})
export class FormStudentComponent implements OnInit {
  studentForm: FormGroup;
  studentId: string | null = null;
  isEditMode: boolean = false;
  cidades: any[] = []; // Para armazenar cidades
  turmas: any[] = []; 
  estudante: any;
  avatarBase64: string | null = null;
  
  constructor(
    private fb: FormBuilder,
    private studentService: StudentsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.studentForm = this.fb.group({
      id: [null],
      nome: ['', Validators.required],
      cpf: ['', Validators.required],
      dataNascimento: [null, Validators.required],
      avatar: [null], // Alteração para armazenar a string Base64
      avatarBase64: [null],
      linkedIn: [''],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      ativo: [true],
      turmaId: ['', Validators.required],
      cidadeId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadCidades();
    this.loadTurmas();
    this.studentId = this.route.snapshot.paramMap.get('id');
    if (this.studentId) {
      this.isEditMode = true;
      this.loadStudent(this.studentId);
    }
  }

  

  private loadStudent(studentId: string): void {
    this.studentService.getStudentsById(studentId).subscribe(aluno => {
      
      this.estudante = aluno;
  
      if (aluno.avatar && !aluno.avatar.startsWith('data:image')) {
        aluno.avatar = `data:image/png;base64,${aluno.avatar}`;
      }
  
      this.studentForm.patchValue(aluno);
      this.avatarBase64 = aluno.avatar;
    });
  }

   // Função para abrir o input de arquivo
   triggerFileInput(): void {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fileInput?.click();
  }


   // Método chamado ao selecionar um arquivo
   onFileSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.previewImage(file);  // Chama a função para exibir a imagem antes de enviar
      this.convertToBase64(file);  // Converte o arquivo para Base64
    }
  }

  // Função para exibir a imagem antes de enviar ao backend
  previewImage(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      this.avatarBase64 = reader.result as string;  // Armazena o Base64 para exibir
    };
    reader.readAsDataURL(file);
  }

  // Função para converter o arquivo para Base64
  convertToBase64(file: File): void {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Result = reader.result as string;
      // Verifica se a string já contém o prefixo 'data:image', caso contrário, adiciona-o
      if (!base64Result.startsWith('data:image')) {
        this.studentForm.get('avatarBase64')?.setValue(`data:image/jpeg;base64,${base64Result}`);
      } else {
        this.studentForm.get('avatarBase64')?.setValue(base64Result);
      }
    };
    reader.readAsDataURL(file);
  }

  

  onSubmit(): void {
    if (this.studentForm.valid) {
      if (this.isEditMode) {
        this.onEdit();
      } else {
        this.onCreate();
      }
    } else {
      Swal.fire('Formulário inválido!', 'Preencha todos os campos obrigatórios.', 'warning');
  
      // Marca todos os campos como tocados para exibir os erros
      this.studentForm.markAllAsTouched();
  
      // Dá foco no primeiro campo inválido
      const firstInvalidControl: HTMLElement = document.querySelector('.is-invalid') as HTMLElement;
      if (firstInvalidControl) {
        firstInvalidControl.focus();
      }
    }
  }
  
  

  private createFormData(): any {
    return {
      id: this.studentForm.get('id')?.value,
      nome: this.studentForm.get('nome')?.value,
      cpf: this.studentForm.get('cpf')?.value,
      dataNascimento: this.studentForm.get('dataNascimento')?.value,
      linkedIn: this.studentForm.get('linkedIn')?.value,
      telefone: this.studentForm.get('telefone')?.value,
      email: this.studentForm.get('email')?.value,
      ativo: this.studentForm.get('ativo')?.value,
      turmaId: this.studentForm.get('turmaId')?.value,
      cidadeId: this.studentForm.get('cidadeId')?.value,
      avatar: this.studentForm.get('avatar')?.value,  // Avatar como base64
      avatarBase64: this.studentForm.get('avatarBase64')?.value
    };
  }

  private onCreate(): void {
    console.log(this.studentForm.value);
    const formData = this.studentForm.value;  // Aqui a imagem já está em base64
    this.studentService.postStudent(formData).subscribe({
      next: () => {
        Swal.fire('Sucesso', 'Estudante cadastrado com sucesso!', 'success');
        this.router.navigate(['/home/students']);
      },
      error: () => {
        Swal.fire('Erro', 'Erro ao cadastrar estudante!', 'error');
      }
    });
  }

  private onEdit(): void {
    const formData = this.createFormData();
    this.studentService.putStudent(formData.id, formData).subscribe({
      next: () => {
        Swal.fire('Sucesso', 'Estudante atualizado com sucesso!', 'success');
        this.router.navigate(['/home/students']);
      },
      error: () => {
        Swal.fire('Erro', 'Erro ao atualizar estudante!', 'error');
      }
    });
  }

  private loadCidades(): void {
    this.studentService.getCity().subscribe(cidades => {
      this.cidades = cidades;
      if (this.cidades.length > 0 && !this.isEditMode) {
        this.studentForm.patchValue({ cidadeId: this.cidades[0].id });
      }
    });
  }

  onCancel(): void {
    if (this.studentForm.dirty) {
      Swal.fire({
        title: 'Alterações não salvas',
        text: 'Você tem certeza que deseja sair? As alterações feitas serão perdidas.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sair assim mesmo',
        cancelButtonText: 'Continuar'
      }).then(result => {
        if (result.isConfirmed) {
          this.router.navigate(['/home/students']);
        }
      });
    } else {
      this.router.navigate(['/home/students']);
    }
  }
  

  private loadTurmas(): void {
    this.studentService.getTurmas().subscribe(turmas => {
      this.turmas = turmas;
      if (this.turmas.length > 0 && !this.isEditMode) {
        this.studentForm.patchValue({ turmaId: this.turmas[0].id });
      }
    });
  }
}
