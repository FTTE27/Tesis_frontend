import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header-admin',
  imports: [],
  templateUrl: './header-admin.html',
  styleUrl: './header-admin.css'
})
export class HeaderAdmin {
  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/']);
  }
  goRecords() {
    this.router.navigate(['/records']);
  }
  goManagement() {
    this.router.navigate(['/management']);
  }
}
