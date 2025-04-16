import { Component, OnInit, ViewChild, HostBinding, HostListener } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Router, NavigationEnd, RouterLink, RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../shared/services/auth/auth.service';
import { UsersService } from '../../shared/services/users/users.service';
import { MatMenuModule } from '@angular/material/menu';
import { MenubarModule } from 'primeng/menubar';
import { TieredMenu, TieredMenuModule } from 'primeng/tieredmenu';
import { MenuItem } from 'primeng/api';
import { ContextMenuModule } from 'primeng/contextmenu';
import { ButtonModule } from 'primeng/button';
import { filter } from 'rxjs';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    MenubarModule,
    ButtonModule,
    ContextMenuModule,
    TieredMenuModule,
    RouterLink,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    RouterOutlet,
    MatSidenavModule,
    NavbarComponent,
    CommonModule
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  opened!: boolean;
  userName: string = 'Usuário';
  userAvatar: string = '';
  userId: string | null = null;
  itemsDesktop: MenuItem[] = [];
  itemsMobile: MenuItem[] = [];
  isDarkTheme = false;

  @ViewChild('contextMenu') contextMenu!: TieredMenu;
  showUserMenu(event: MouseEvent): void {
    event.preventDefault(); // evita comportamento inesperado
    this.contextMenu.show(event);
  }
  @HostBinding('class') componentCssClass: string = 'light-theme';
window: any;
sidenav: any;

  constructor(
    private authService: AuthService,
    private userService: UsersService,
    private router: Router
  ) {
    // Fecha o menu automaticamente em telas menores ao navegar
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        if (window.innerWidth <= 768) {
          this.opened = false;
        }
      });
  }

  ngOnInit(): void {
    this.opened = window.innerWidth > 768;

    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      try {
        const userInfo = JSON.parse(storedUser);
        this.userName = userInfo.usuario.nome || 'Usuário';
        this.userId = userInfo.usuarioId || null;
        this.userAvatar = userInfo.avatar || '';
      } catch (error) {
        console.error('Erro ao processar os dados do usuário no localStorage:', error);
      }
    }

    this.itemsDesktop = [
      {
        label: this.userName,
        items: [
          { label: 'Editar Perfil', icon: 'pi pi-pencil', command: () => this.navigateToProfile() },
          { label: 'Sair', icon: 'pi pi-sign-out', command: () => this.logout() }
        ]
      }
    ];

    this.itemsMobile = [
      { label: 'Editar Perfil', icon: 'pi pi-pencil', command: () => this.navigateToProfile() },
      { label: 'Sair', icon: 'pi pi-sign-out', command: () => this.logout() }
    ];
  }

  toggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
    this.componentCssClass = this.isDarkTheme ? 'dark-theme' : 'light-theme';
  }

  logout(): void {
    (document.activeElement as HTMLElement)?.blur();
    this.authService.logout();
    localStorage.removeItem('userInfo');
    // this.router.navigate(['/login']);
  }

  navigateToProfile(): void {
    this.router.navigate(['/home/profile']);
  }

  toggleUserMenu(event: Event): void {
    this.contextMenu.toggle(event);
  }

  // Getter que calcula dinamicamente o modo do sidenav com base na largura da tela
  get sidenavMode(): 'side' | 'over' {
    return window.innerWidth > 768 ? 'side' : 'over';
  }

  // Atualiza o estado inicial do sidenav com base na largura da tela
  updateSidenavMode(): void {
    this.opened = window.innerWidth > 768;
  }

  // Detecta redimensionamento da janela para atualizar a abertura do sidenav se necessário
  @HostListener('window:resize', ['$event'])
  onResize(event: UIEvent) {
    this.updateSidenavMode();
  }
}
