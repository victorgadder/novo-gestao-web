import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MatIconModule } from '@angular/material/icon';
import Swal from 'sweetalert2';
import { Router, RouterLink } from '@angular/router';
import { ArticleItem } from '../../../shared/models/article';
import { ArticlesService } from '../../../shared/services/articles/articles.service';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-articles',
  standalone: true,
  imports: [FormsModule, InputSwitchModule, TableModule, CommonModule, ButtonModule, MatIconModule, RouterLink],
  templateUrl: './list-article.component.html',
  styleUrl: './list-article.component.scss'
})
export class ListArticleComponent implements OnInit {
  articleslist: ArticleItem[] = [];
  first = 0;
  rows = 5;
  total = 0;
  page = 1;

  constructor(private articleService: ArticlesService, private router: Router) {}

  ngOnInit() {
    this.loadArticles(this.page, this.rows);
  }

  // Carrega os estudantes com os filtros e paginação
  loadArticles(pagina: number, quantidade: number) {
    this.articleService.getArticles(pagina, quantidade).subscribe({
      next: (response: any) => {
        this.total = response.totalRegistros;
        this.articleslist = response.itens;
      },
    });
  }

  next() {
    this.page = this.page + 1;
    this.loadArticles(this.page, this.rows);
  }

  prev() {
    this.page = this.page - 1;
    this.loadArticles(this.page, this.rows);
  }

  reset() {
    this.first = 0;
    this.page = 1;
    this.loadArticles(this.page, this.rows);
  }

  pageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.page = Math.floor(this.first / this.rows) + 1;
    this.loadArticles(this.page, this.rows);
  }

  isLastPage(): boolean {
    return this.articleslist ? this.first === this.total - this.rows : true;
  }

  isFirstPage(): boolean {
    return this.articleslist ? this.first === 0 : true;
  }

  deleteArticle(id: string) {
    Swal.fire({
      icon: 'warning',
      title: 'Deseja realmente excluir?',
      text: 'Não é possível reverter essa ação',
      showCancelButton: true,
      confirmButtonText: `Deletar`,
      confirmButtonColor: '#dc3545',
    }).then((result) => {
      if (result.isConfirmed) {
        this.articleService.deleteArticle(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Sucesso',
              text: 'Artigo excluído com sucesso!',
              showConfirmButton: false,
              timer: 3000
            })
            this.loadArticles(this.page, this.rows);
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Erro',
              text: 'Erro ao excluir artigo!',
              showConfirmButton: false,
              timer: 3000
            })
        }})
      }
    });
  }
  editArticle(id: string) {
    this.router.navigate(['/home/articles/edit/' + id]);
  }

  formatarData(data: string): string {  
    return new Date(data).toLocaleDateString();
  }

  // Alterna o status e atualiza no backend
  toggleStatus(article: ArticleItem) {
    // Faz uma cópia do usuário para evitar modificar diretamente o objeto original
    const updatedarticle = { ...article, ativo: article.ativo, itens: [] };
    // Envia a atualização para o backend
    this.articleService.putArticles(article.id, updatedarticle).subscribe({
      next: (response: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Sucesso',
          text: 'Status atualizado com sucesso!',
          showConfirmButton: false,
          timer: 2000
        });
        // Atualiza o status localmente após sucesso
        article.ativo = updatedarticle.ativo;
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Erro ao atualizar status do artigo!',
          showConfirmButton: false,
          timer: 3000
        });
      }
    });
  }
}
