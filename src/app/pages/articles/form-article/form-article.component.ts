import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ArticlesService } from '../../../shared/services/articles/articles.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-form-article',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './form-article.component.html',
  styleUrls: ['./form-article.component.scss']
})
export class FormArticleComponent {
  articleForm: FormGroup;
  imagemCapa: string | null = null;
  imagemPrincipal: string | null = null;
  paragrafoFiles: { [key: number]: string | null } = {};
  articleId: string | null = null;
  isEditMode: boolean = false;
  autores: any[] = [];
  artigo: any;

  constructor(
    private fb: FormBuilder,
    private articleService: ArticlesService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.articleForm = this.fb.group({
      id: [null],
      titulo: ['', Validators.required],
      resumo: ['', Validators.required],
      imagemCapa: [''],
      imagem: [''],
      data: ['', Validators.required],
      ativo: [true],
      autorId: ['', Validators.required],
      itens: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadAutores();
    this.articleId = this.route.snapshot.paramMap.get('id');
    if (this.articleId) {
      this.isEditMode = true;
      this.loadArticle(this.articleId);
    }
  }

  private loadArticle(articleId: string): void {
    this.articleService.getArticlesById(articleId).subscribe(article => {
      this.artigo = article;
      const formattedDate = this.formatDate(article.data);
      this.articleForm.patchValue({
        ...article,
        data: formattedDate
      });

      this.articleForm.setControl('itens', this.fb.array(article.itens.map(item => this.createItem(item))));
    });
  }

  private formatDate(date: string): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  private createItem(item?: any): FormGroup {
    return this.fb.group({
      tipo: [item?.tipo || 0],
      texto: [item?.texto || ''],
      imagem: [item?.imagem || '']
    });
  }

  addItem(): void {
    (this.articleForm.get('itens') as FormArray).push(this.createItem());
  }

  removeItem(index: number): void {
    (this.articleForm.get('itens') as FormArray).removeAt(index);
    delete this.paragrafoFiles[index];
  }

  get itemControls() {
    return (this.articleForm.get('itens') as FormArray);
  }

  onFileSelect(event: any, field: string, index?: number) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1];

        if (field === 'imagemCapa') {
          this.imagemCapa = base64Data;
        } else if (field === 'imagemPrincipal') {
          this.imagemPrincipal = base64Data;
        } else if (index !== undefined) {
          this.paragrafoFiles[index] = base64Data;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  async onSubmit(): Promise<void> {
    if (this.articleForm.valid) {
      if (this.isEditMode) {
        await this.onEdit();
      } else {
        await this.onCreate();
      }
    }
  }

  private async onCreate(): Promise<void> {
    this.createFormData();
    const formData = this.articleForm.getRawValue();
    await this.articleService.postArticles(formData).toPromise();
    Swal.fire('Sucesso!', 'Artigo cadastrado com sucesso.', 'success');
    this.articleForm.reset();
    this.articleForm.setControl('itens', this.fb.array([]));
    this.router.navigate(['/home/artigos']);
  }

  private async onEdit(): Promise<void> {
    this.createFormData();
    const formData = this.articleForm.getRawValue();
    await this.articleService.putArticles(formData.id, formData).toPromise();
    Swal.fire('Sucesso!', 'Artigo editado com sucesso.', 'success');
    this.router.navigate(['/home/artigos']);
  }

  private createFormData() {
    const formValue = this.articleForm.getRawValue();

    formValue.imagem = this.imagemPrincipal || '';
    formValue.imagemCapa = this.imagemCapa || '';

    formValue.itens = formValue.itens.map((item: any, index: number) => ({
      ...item,
      imagem: item.tipo === 1 ? this.paragrafoFiles[index] || '' : ''
    }));

    this.articleForm.patchValue(formValue);
  }

  private loadAutores(): void {
    this.articleService.getAutores().subscribe(authors => {
      this.autores = authors.data;
    });
  }

  onTipoChange(event: Event, item: AbstractControl): void {
    const tipo = Number((event.target as HTMLSelectElement).value);
    item.get('tipo')?.setValue(tipo);

    if (tipo === 0) {
      item.get('imagem')?.setValue(null);
    } else {
      item.get('texto')?.setValue('');
    }
  }

  onCancel(): void {
      if (this.articleForm.dirty) {
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
}
