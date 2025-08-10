import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  constructor(private router: Router) {}

  goToClassifier() {
    this.router.navigate(['/classifier']);
  }

  goToReturn() {
    this.router.navigate(['/']);
  }
}
