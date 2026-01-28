import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Welcome } from './shared/components/welcome/welcome';
import { Header } from './shared/components/header/header';
import { Menu } from './shared/components/menu/menu';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    CommonModule,
    Header,
    Menu
  ],
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {}
