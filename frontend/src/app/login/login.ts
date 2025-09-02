import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginService } from '../services/login_Services';

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
    // hace un POST al backend con las credenciales.
    // Como login() devuelve un Observable, te suscribes con
    this.loginService.login(this.username, this.password).subscribe({

      next: (response) => {
        console.log('Login correcto:', response);
        localStorage.setItem('token', response.access_token); // Guarda el token en localStorage
        localStorage.setItem('rol', response.rol); // Guarda el rol en localStorage
        if (response.rol === 'admin') {
          this.router.navigate(['/records']); // pantalla de admin
        } else {
          this.router.navigate(['/upload']);  // pantalla de usuario normal
        }
      },
      error: (err) => {
        alert(err); // Muestra error al usuario (ej: "Usuario incorrecto")
      }
    });


  }

  goToReturn() {
    this.router.navigate(['/']); // boton para salir de la aplicacion - aun no se sale
  } 
}
