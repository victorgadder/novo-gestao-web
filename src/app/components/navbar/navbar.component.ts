import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TreeNode } from 'primeng/api';
import { TreeModule } from 'primeng/tree';
import { filter } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [TreeModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NavbarComponent {
  selectedFile!: TreeNode;

  files: TreeNode[] = [
    {
      key: '1',
      label: 'Sistema',
      children: [
        {
          key: '1-1',
          label: 'Usuários',
          icon: 'pi pi-id-card',
          data: { route: '/home/users/list' },
        },
      ],
    },
    {
      key: '0',
      label: 'WebSite',
      children: [
        // {
        //   key: '6-0',
        //   label: 'Contatos',
        //   icon: 'pi pi-fw pi-users',
        //   data: { route: '/home/students/list' },
        // },
        // {
        //   key: '7-0',
        //   label: 'Newsletters',
        //   icon: 'pi pi-fw pi-users',
        //   data: { route: '/home/students/list' },
        // },
        {
          key: '1-0',
          label: 'Artigos',
          icon: 'pi pi-fw pi-file',
          data: { route: '/home/articles/list' },
        },
        {
          key: '2-0',
          label: 'Alunos',
          icon: 'pi pi-fw pi-users',
          data: { route: '/home/students/list' },
        },
        // {
        //   key: '3-0',
        //   label: 'Cidades',
        //   icon: 'pi pi-fw pi-file',
        //   data: { route: '/home/students/list' },
        // },
        // {
        //   key: '4-0',
        //   label: 'Estados',
        //   icon: 'pi pi-fw pi-file',
        //   data: { route: '/home/students/list' },
        // },
        // {
        //   key: '5-0',
        //   label: 'Turmas',
        //   icon: 'pi pi-fw pi-file',
        //   data: { route: '/home/students/list' },
        // }
      ],
    },
    // {
    //   key: '2',
    //   label: 'Cadastros',
    //   children: [
    //     {
    //       key: '1-0',
    //       label: 'Empresas',
    //       icon: 'pi pi-fw pi-file',
    //       data: { route: '/home/aaaaa/list' },
    //     },
    //     {
    //       key: '1-0',
    //       label: 'Faturas',
    //       icon: 'pi pi-fw pi-file',
    //       data: { route: '/home/aaaaa/list' },
    //     }
    //   ],
    // },
    // {
    //   key: '2',
    //   label: 'Relatórios',
    //   children: [
    //     {
    //       key: '1-0',
    //       label: 'Relatório 01',
    //       icon: 'pi pi-fw pi-file',
    //       data: { route: '/home/aaaaa/list' },
    //     },
    //     {
    //       key: '1-0',
    //       label: 'Relatório 02',
    //       icon: 'pi pi-fw pi-file',
    //       data: { route: '/home/aaaaa/list' },
    //     },
    //     {
    //       key: '1-0',
    //       label: 'Relatório 03',
    //       icon: 'pi pi-fw pi-file',
    //       data: { route: '/home/aaaaa/list' },
    //     },
    //   ],
    // },
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.highlightActiveNode(this.router.url);
      });

    // Destaca o item ativo ao carregar
    this.highlightActiveNode(this.router.url);
  }

  onNodeSelect(event: any) {
    const node = event.node;
    if (node.children?.length) {
      node.expanded = !node.expanded;
    }

    if (node.data?.route) {
      this.router.navigate([node.data.route]);
    }
  }

  highlightActiveNode(currentRoute: string) {
    this.files.forEach((node) => {
      this.deselectNodes(node);
      this.selectNodeByRoute(node, currentRoute);
    });
  }

  deselectNodes(node: TreeNode) {
    if (node.children) {
      node.children.forEach((child) => {
        child.expanded = false;
        this.deselectNodes(child);
      });
    }
  }

  selectNodeByRoute(node: TreeNode, currentRoute: string): boolean {
    if (node.data?.route === currentRoute) {
      this.selectedFile = node;
      return true;
    }

    if (node.children) {
      for (let child of node.children) {
        const found = this.selectNodeByRoute(child, currentRoute);
        if (found) {
          node.expanded = true;
          return true;
        }
      }
    }

    return false;
  }
}
