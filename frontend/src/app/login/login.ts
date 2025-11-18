import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginService } from '../services/login_services';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  username: string = '';
  password: string = '';

  constructor(private loginService: LoginService, private router: Router) {}

  goToClassifier() {
    // Hace un POST al backend con las credenciales.
    // Como login() devuelve un Observable, toca suscribirse
    this.loginService.login(this.username, this.password).subscribe({

      next: (response) => {
        const rol = this.loginService.getRol() ?? response.rol;
        if (rol === 'admin') {
          this.router.navigate(['/records']); // pantalla de admin
        } else {
          this.router.navigate(['/upload']);  // pantalla de usuario normal
        }
      },
      error: (err) => {
        alert(err); // Muestra error al usuario
      }
    });


  }

  goToReturn() {
    window.close();
  }
}
