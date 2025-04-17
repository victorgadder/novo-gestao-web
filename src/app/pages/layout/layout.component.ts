import {
  Component,
  OnInit,
  ViewChild,
  HostBinding,
  HostListener
} from '@angular/core';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav'; // necessário para o ViewChild funcionar corretamente
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

  // ✅ Pega a referência do sidenav com ViewChild corretamente
  @ViewChild('sidenav') sidenav!: MatSidenav;

  @HostBinding('class') componentCssClass: string = 'light-theme';

  constructor(
    private authService: AuthService,
    private userService: UsersService,
    private router: Router
  ) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        if (window.innerWidth <= 768) {
          this.opened = false;
        }
      });
  }

  ngOnInit(): void {
    const theme = localStorage.getItem('theme');
    this.isDarkTheme = theme === 'dark';
    document.body.classList.add(this.isDarkTheme ? 'dark-theme' : 'light-theme');
    this.opened = window.innerWidth > 768;

    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      try {
        const userInfo = JSON.parse(storedUser);
        console.log('userInfo do localStorage:', userInfo);
        this.userName = userInfo.usuario.nome || 'Usuário';
        this.userId = userInfo.usuario?.usuarioId || null;
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

    const body = document.body;
    if (this.isDarkTheme) {
      body.classList.add('dark-theme');
      body.classList.remove('light-theme');
    } else {
      body.classList.remove('dark-theme');
      body.classList.add('light-theme');
    }
  }

  logout(): void {
    (document.activeElement as HTMLElement)?.blur();
    this.authService.logout();
    localStorage.removeItem('userInfo');
    // this.router.navigate(['/login']);
  }

  navigateToProfile(): void {
    if (this.userId) {
      this.router.navigate(['/home/profile', this.userId]);
    } else {
      console.warn('ID do usuário não encontrado. Redirecionando para /home/profile');
      this.router.navigate(['/home/profile']);
    }
  }

  toggleUserMenu(event: Event): void {
    this.contextMenu.toggle(event);
  }

  // ✅ Adiciona o método de toggle para ser chamado no HTML
  toggleSidenav(): void {
    this.sidenav.toggle();
  }

  get sidenavMode(): 'side' | 'over' {
    return window.innerWidth > 768 ? 'side' : 'over';
  }

  updateSidenavMode(): void {
    this.opened = window.innerWidth > 768;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: UIEvent) {
    this.updateSidenavMode();
  }
}
