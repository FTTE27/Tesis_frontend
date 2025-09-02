import { Component } from '@angular/core';
import { HeaderAdmin } from '../header-admin/header-admin';
import { CommonModule } from '@angular/common';

interface CommentModel {
  titulo: string;
  nombre: string;
  mensaje: string;
  archivo: string;
  correo: string;
}

@Component({
  selector: 'app-comments',
  imports: [HeaderAdmin],
  templateUrl: './comments.html',
  styleUrl: './comments.css'
})


export class Comments {

  comments = [
    { titulo: 'Sugerencia de diseño', nombre: 'Juan Pérez', mensaje: 'Me gustaría ver más colores.', archivo: 'mockup.pdf', correo: 'hola@gmail.con' },
    { titulo: 'Reporte de bug', nombre: 'Ana Gómez', mensaje: 'El botón no funciona en móviles.', archivo: '', correo: 'xd@gmail.com' },
  ];

  selectedComment: CommentModel | null = null;

  constructor() {}

  ngOnInit(): void {}

  selectComment(item: CommentModel) {
    console.log('Seleccionaste:', item);
    // aquí disparas el evento para mostrar el detalle en el panel derecho
    this.selectedComment = item;
  }

}

