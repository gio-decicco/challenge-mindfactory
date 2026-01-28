import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { PanelMenuModule } from 'primeng/panelmenu';

@Component({
  selector: 'app-menu',
  imports: [CardModule, PanelMenuModule],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {

  protected readonly items : MenuItem[] = [
    {
      label: 'Inicio',
      icon: 'pi pi-home',
      routerLink: '/'
    },
    {
      label: 'Automotores',
      icon: 'pi pi-car',
      routerLink: '/automotores'
    }
  ];

}
