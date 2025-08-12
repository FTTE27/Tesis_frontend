import { Component } from '@angular/core';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';

@Component({
  selector: 'app-support',
  imports: [Header, Footer],
  templateUrl: './support.html',
  styleUrl: './support.css'
})
export class Support {

  constructor() { }

  ngOnInit(): void {
  }

}