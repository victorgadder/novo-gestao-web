import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { RefreshToken, Signin, UserInfo } from '../../models/auth';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  api = `${environment.apiUrl}v1/Auth`;

  constructor(
    private httpClient: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {}

  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    if (!token) {
      return false;
    }
    const date = new Date();
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const expirationDate = new Date(decodedToken.exp * 1000);
    return date < expirationDate;
  }

  postSignin(newSignin: Signin): Observable<Signin> {
    return this.httpClient.post<Signin>(this.api + '/entrar', newSignin).pipe(
      tap((response: any) => {
        if (response && isPlatformBrowser(this.platformId)) {
          const { accessToken, refreshToken } = response.data;
          const usuario: UserInfo = {
            usuarioId: response.data.usuario.usuarioId,
            email: response.data.usuario.email,
            nome: response.data.usuario.nome,
            avatar: response.data.usuario.avatar
          };
          this.saveUserInfo({ accessToken, refreshToken, usuario });
        }
      })
    );
  }

  postRefresh(token: RefreshToken): Observable<any> {
    return this.httpClient.post<RefreshToken>(this.api + '/refresh', token).pipe(
      tap((response: RefreshToken) => {
        if (response && isPlatformBrowser(this.platformId)) {
          this.updateAccessToken(response.accessToken);
        }
      })
    );
  }

  private saveUserInfo(data: { accessToken: string; refreshToken: string; usuario: UserInfo }): void {
    if (isPlatformBrowser(this.platformId)) {
      window.localStorage.setItem('userInfo', JSON.stringify(data));
    }
  }

  private updateAccessToken(accessToken: string): void {
    if (isPlatformBrowser(this.platformId)) {
      const userInfo = this.getUserInfo();
      if (userInfo) {
        userInfo.accessToken = accessToken;
        this.saveUserInfo(userInfo);
      }
    }
  }

  getAccessToken(): string | null {
    const userInfo = this.getUserInfo();
    return userInfo ? userInfo.accessToken : null;
  }

  getRefreshToken(): string | null {
    const userInfo = this.getUserInfo();
    return userInfo ? userInfo.refreshToken : null;
  }

  getUserInfo(): { accessToken: string; refreshToken: string; usuario: UserInfo } | null {
    if (isPlatformBrowser(this.platformId)) {
      const userInfo = window.localStorage.getItem('userInfo');
      return userInfo ? JSON.parse(userInfo) : null;
    }
    return null;
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.localStorage.removeItem('userInfo');
      this.router.navigate(['/auth']);
    }
  }
}
