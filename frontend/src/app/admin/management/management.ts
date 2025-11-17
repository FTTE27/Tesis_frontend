import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderAdmin } from "../header-admin/header-admin";
import { UserService, User } from '../../services/user_services';
import { LoginService } from '../../services/login_services';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-management',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderAdmin,],
  templateUrl: './management.html',
  styleUrls: ['./management.css']
})
export class Management implements OnInit {
  // Variables para el formulario
  nombre: string = '';
  username: string = '';
  password: string = '';
  users: User[] = [];
  selectedUserId: number | null = null;
  models : string[] = [];
  selectedModel: string | null = null;

  //Inyectamos los servicios necesarios:
  constructor(
    private router: Router,
    private userService: UserService,
    private authService: LoginService,
    private http: HttpClient,
    private login: LoginService
  ) {}

  loading = true;
  isAdmin = false;
  ngOnInit(): void {
    const rol = this.login.getRol();

    if (rol !== 'admin') {
      this.router.navigate(['/upload']);
      return;  // para no ejecutar el resto de la pantalla
    }

  // si llegó aquí, significa que es admin
  this.isAdmin = true;
  this.loading = false;



  this.loadUsers();
  this.loadModels();
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
      // Validación para contraseña al crear
  if (!this.selectedUserId) {
    if (this.password.length < 5) {
      alert('La contraseña debe tener al menos 5 caracteres.');
      return;
    }
  }

  // ✨ Validación para contraseña al editar (solo si quiere cambiar la contraseña)
  if (this.selectedUserId) {
    if (this.password !== '' && this.password.length < 5) {
      alert('La nueva contraseña debe tener al menos 5 caracteres.');
      return;
    }
  }
    if (this.selectedUserId) {
      // Update
      const updatedUser: User = {
        id: this.selectedUserId,
        nombre: this.nombre,
        username: this.username,
        password: this.password, // puede estar vacío para la actualización
        rol: 'user',
        disabled: false
      };
      // le pasamos el usuario actualizado al servicio para que lo actualice en el backend
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
      // Creamos un nuevo usuario con los datos del formulario
      const newUser: User = {
        nombre: this.nombre,
        username: this.username,
        password: this.password,
        rol: 'user',
        disabled: false
      };
      // lo pasamos al backend para que lo cree
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
    // busca el usuario seleccionado y carga sus datos
    if (!this.selectedUserId) return;
    const user = this.users.find(u => u.id === this.selectedUserId);
    if (user) {
      this.nombre = user.nombre;
      this.username = user.username;
      this.password = ''; // no se cambia a menos de que se escriba una nueva
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

 // Cargar lista de modelos
 loadModels(): void {
  this.http.get<{ models: string[] }>('http://localhost:8000/models/get_models')
    .subscribe({
      next: (response) => {
        this.models = response.models;
      },
      error: (err) => {
        console.error('Error al cargar modelos', err);
        alert('Error al cargar modelos disponibles.');
      }
    });
}

// Cambiar modelo seleccionado
changeModel(): void {
  if (!this.selectedModel) {
    alert('Por favor selecciona un modelo primero.');
    return;
  }

  const formData = new FormData();
  formData.append('model_name', this.selectedModel);

  this.http.post('http://localhost:8000/models/change_model', formData)
    .subscribe({
      next: (res: any) => {
        alert(res.message || 'Modelo cambiado correctamente.');
      },
      error: (err) => {
        console.error('Error al cambiar modelo', err);
        alert('No se pudo cambiar el modelo.');
      }
    });
}

openManual(){
  const link = document.createElement('a');
    link.href = '/assets/Admin_Manual.pdf';
    link.download = 'Admin_Manual.pdf';
    link.click();
}
}
