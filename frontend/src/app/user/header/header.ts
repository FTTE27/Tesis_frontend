import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../services/login_services';
@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  imports: [CommonModule, RouterModule]
})
export class Header {
  constructor(private router: Router, private authService: LoginService,) {}

  goHome() {
    this.router.navigate(['/']);
  }
  goUpload() {
    this.router.navigate(['/upload']);
  }
  goClassify() {
    this.router.navigate(['/classifier']);
  }
  goSupport() {
    this.router.navigate(['/support']);
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err: any) => {
        console.error('Error en logout:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('rol');
        this.router.navigate(['/']);
      }
    });
  }
}
