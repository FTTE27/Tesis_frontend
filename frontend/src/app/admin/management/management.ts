import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderAdmin } from "../header-admin/header-admin";

@Component({
  selector: 'app-management',
  imports: [HeaderAdmin],
  templateUrl: './management.html',
  styleUrl: './management.css'
})
export class Management {
  constructor(private router: Router) {}

  goToHome() {
    this.router.navigate(['/l']);
  }
}
