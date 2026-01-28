import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-welcome',
  imports: [CardModule],
  templateUrl: './welcome.html',
  styleUrl: './welcome.css',
})
export class Welcome {

}
