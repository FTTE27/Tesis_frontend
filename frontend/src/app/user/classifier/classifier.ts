import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-classifier',
  templateUrl: './classifier.html',
  imports: [CommonModule, FormsModule, Footer, Header]
})
export class Classifier {
  probabilities = [
    { value: 92, text: 'This Radiography has a probability of 92% to be Viral Pneumonia' },
    { value: 6,  text: 'This Radiography has a probability of 6% to be Bacterial Pneumonia' },
    { value: 2,  text: 'This Radiography has a probability of 2% to not have pneumonia' }
  ];
}
