import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Classifier } from './user/classifier/classifier';
import { Login } from './login/login';
import{ Upload } from './user/upload/upload';
import { Support } from './user/support/support'; 
import { Management } from './admin/management/management';
import { Footer } from './user/footer/footer';
import { Header } from './user/header/header';
import { HeaderAdmin } from './admin/header-admin/header-admin';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  
import { NgModule } from '@angular/core';
import { Records } from './admin/records/records';
import { Comments } from './admin/comments/comments';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'classifier', component: Classifier },
    { path: 'login', component: Login },
    { path: 'upload', component: Upload },
    { path: 'support', component: Support },
    { path: 'management', component: Management },
    { path: 'records', component: Records},
    { path: 'comments', component: Comments}
];
