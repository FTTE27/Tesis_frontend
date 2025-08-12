import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,
     CommonModule
    ], 
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  username: string = '';
  password: string = '';

  constructor(private router: Router) {}

  goToClassifier() {
    if (this.username === 'admin' && this.password === '1234') {
      this.router.navigate(['/management']);
    } else {
      this.router.navigate(['/classifier']);
    }
  }

  goToReturn() {
    this.router.navigate(['/']);
  }
}
