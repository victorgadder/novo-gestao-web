import { Component, AfterViewInit, OnDestroy, Renderer2 } from '@angular/core';
import { AccessFormComponent } from "./components/access-form/access-form.component";
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [AccessFormComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements AfterViewInit, OnDestroy {

  production = environment.production;
  nome = environment.nome;

  private currentImageIndex = 1;
  private totalImages = 5;
  private intervalId: any;
  private backgroundContainer!: HTMLElement;

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit() {

    const loginDiv = document.getElementById("loginBackground");

    if (!loginDiv) {
      console.error("Elemento #loginBackground não encontrado!");
      return;
    }

    // Criando o elemento para o background
    this.backgroundContainer = this.renderer.createElement('div');
    this.renderer.addClass(this.backgroundContainer, 'background-container');

    // Adiciona antes do primeiro filho para garantir que fique no fundo
    this.renderer.insertBefore(loginDiv, this.backgroundContainer, loginDiv.firstChild);

    const changeBackground = () => {
      const imageUrl = `assets/smartScreen/image${this.currentImageIndex}.jpg`;
      console.log("Mudando para imagem:", imageUrl);

      // Adiciona classe de fade
      this.renderer.addClass(this.backgroundContainer, 'fade');

      // Aguarda a transição para mudar a imagem
      setTimeout(() => {
        this.renderer.setStyle(this.backgroundContainer, 'backgroundImage', `url('${imageUrl}')`);
        this.renderer.removeClass(this.backgroundContainer, 'fade'); // Remove o fade após a troca
      }, 1500); // Tempo da animação
     
      this.currentImageIndex = (this.currentImageIndex % this.totalImages) + 1;
    };

    changeBackground();
    this.intervalId = setInterval(changeBackground, 10000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
