import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderAdmin } from "../header-admin/header-admin";
import { UserService, User } from '../../services/user_services';
import { LoginService } from '../../services/login_services';

@Component({
  selector: 'app-management',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderAdmin],
  templateUrl: './management.html',
  styleUrls: ['./management.css']
})
export class Management implements OnInit {
  nombre: string = '';
  username: string = '';
  password: string = '';
  users: User[] = [];
  selectedUserId: number | null = null;

  constructor(
    private router: Router, 
    private userService: UserService,  
    private authService: LoginService
  ) {}
    

  ngOnInit(): void {
    this.loadUsers();
  }

  // Cargar usuarios
  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data.filter(u => u.rol === 'user');
      },
      error: (err) => alert('Error cargando usuarios: ' + err)
    });
  }

  // Crear o actualizar usuario
  saveUser() {
    if (this.selectedUserId) {
      // Update
      const updatedUser: User = {
        id: this.selectedUserId,
        nombre: this.nombre,
        username: this.username,
        password: this.password, // puede estar vacío
        rol: 'user',
        disabled: false
      };

      this.userService.updateUser(this.selectedUserId, updatedUser).subscribe({
        next: () => {
          alert('Usuario actualizado con éxito');
          this.clearForm();
          this.loadUsers();
        },
        error: (err) => alert('Error actualizando usuario: ' + err)
      });

    } else {
      // Create
      const newUser: User = {
        nombre: this.nombre,
        username: this.username,
        password: this.password,
        rol: 'user',
        disabled: false
      };

      this.userService.createUser(newUser).subscribe({
        next: () => {
          alert('Usuario creado con éxito');
          this.clearForm();
          this.loadUsers();
        },
        error: (err) => alert('Error creando usuario: ' + err)
      });
    }
  }

  // Editar → cargar datos al formulario
  editUser() {
    if (!this.selectedUserId) return;
    const user = this.users.find(u => u.id === this.selectedUserId);
    if (user) {
      this.nombre = user.nombre;
      this.username = user.username;
      this.password = ''; // vacío → admin debe escribir una nueva si quiere cambiarla
    }
  }

  // Eliminar
  deleteUser() {
    if (!this.selectedUserId) return;
    if (confirm('¿Seguro que deseas eliminar este usuario?')) {
      this.userService.deleteUser(this.selectedUserId).subscribe({
        next: () => {
          alert('Usuario eliminado con éxito');
          this.clearForm();
          this.loadUsers();
        },
        error: (err) => alert('Error eliminando usuario: ' + err)
      });
    }
  }

  // Limpiar formulario
  clearForm() {
    this.nombre = '';
    this.username = '';
    this.password = '';
    this.selectedUserId = null;
  }
  //Logout

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        // Después de limpiar el token, lo mandamos al login o home
        this.router.navigate(['/']);
      },
      error: (err: any) => {
        console.error('Error en logout:', err);
        // Aun si hay error en el back, limpiamos el storage para forzar logout
        localStorage.removeItem('token');
        localStorage.removeItem('rol');
        this.router.navigate(['/']);
      }
    });
  }

}
