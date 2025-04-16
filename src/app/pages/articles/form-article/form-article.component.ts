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
  imagemCapa: string | null = null; // Para armazenar imagem de capa em base64
  imagemPrincipal: string | null = null; // Para armazenar imagem principal em base64
  paragrafoFiles: { [key: number]: string | null } = {}; // Armazena arquivos de imagem para parágrafos
  articleId: string | null = null; // ID do artigo a ser editado
  isEditMode: boolean = false; // Controle do modo de edição
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
      imagemCapa: [''], // Armazenar imagem de capa em base64
      imagem: [''], // Armazenar imagem principal em base64
      data: ['', Validators.required],
      ativo: [true],
      autorId: ['', Validators.required],
      itens: this.fb.array([]) // Inicia com o FormArray vazio
    });
  }

  ngOnInit(): void {
    this.loadAutores();
    this.articleId = this.route.snapshot.paramMap.get('id'); // Obtem o ID da URL
    if (this.articleId) {
      this.isEditMode = true;
      this.loadArticle(this.articleId); // Carrega os dados do artigo para edição
    }
  }

  // Carrega os dados do artigo
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
      tipo: [item?.tipo || 0], // 0 = Texto, 1 = Imagem
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
        if (field === 'imagemCapa') {
          this.imagemCapa = base64String.split(',')[1]; // Armazena apenas a parte base64
        } else if (field === 'imagemPrincipal') {
          this.imagemPrincipal = base64String.split(',')[1]; // Armazena apenas a parte base64
        } else if (index !== undefined) {
          this.paragrafoFiles[index] = base64String.split(',')[1]; // Armazena imagem do parágrafo
        }
      };
      reader.readAsDataURL(file); // Lê o arquivo como uma URL de dados
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
    const formData = this.articleForm.value;
    await this.articleService.postArticles(formData).toPromise();
    Swal.fire('Sucesso!', 'Artigo cadastrado com sucesso.', 'success');
    this.router.navigate(['/home/artigos']);
  }

  private async onEdit(): Promise<void> {
    this.createFormData();
    const formData = this.articleForm.value;
    await this.articleService.putArticles(formData.id, formData).toPromise();
    Swal.fire('Sucesso!', 'Artigo editado com sucesso.', 'success');
    this.router.navigate(['/home/artigos']);
  }

  private createFormData() {
    this.articleForm.value.imagem = this.imagemPrincipal || '';
    this.articleForm.value.imagemCapa = this.imagemCapa || '';
    // Itera sobre os parágrafos para incluir as imagens
    const itens = this.articleForm.value.itens.map((item: any) => ({
      ...item,
      imagem: this.paragrafoFiles[item.index] || null
    }));

    itens.forEach((item:any) => {
      if (item.tipo === 1 && item.imagem) {
        this.articleForm.value.itens[`${item.index}`].imagem = item.imagem; // Adiciona a imagem ao FormData
      }
      this.articleForm.value.itens[`${item.index}`].tipo = item.tipo;
      this.articleForm.value.itens[`${item.index}`].texto = item.texto;
    });
  }

  private loadAutores(): void {
    this.articleService.getAutores().subscribe(authors => {
      this.autores = authors.data;
    });
  }

  onTipoChange(event: Event, item: AbstractControl): void {
    const tipo = Number((event.target as HTMLSelectElement).value); // Converte o valor para número
    item.get('tipo')?.setValue(tipo); // Atualiza o valor do tipo corretamente
  
    if (tipo === 0) {
      // Limpa o campo de imagem ao mudar para texto
      item.get('imagem')?.setValue(null);
    } else {
      // Limpa o campo de texto ao mudar para imagem
      item.get('texto')?.setValue('');
    }
  }

  onCancel(): void {
    this.router.navigate(['/home/articles']);
  }
  
}


