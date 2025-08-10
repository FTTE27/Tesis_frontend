import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Classifier } from './classifier/classifier';
import { Login } from './login/login';
import { Footer } from './footer/footer';
import { Header } from './header/header';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'classifier', component: Classifier },
    { path: 'login', component: Login },
];
