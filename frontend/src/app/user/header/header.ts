import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  imports: [CommonModule, RouterModule]
})
export class Header {
  constructor(private router: Router) {}

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
}
