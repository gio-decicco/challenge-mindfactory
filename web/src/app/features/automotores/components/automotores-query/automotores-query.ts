import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { AutomotorQueryPageFacadeService } from '../../domain/automotor-query.page.facade.service';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-automotores-query',
  imports: [TableModule, CardModule, ButtonModule, CommonModule, ConfirmDialogModule],
  providers: [AutomotorQueryPageFacadeService, ConfirmationService],
  templateUrl: './automotores-query.html',
  styleUrl: './automotores-query.css',
})
export class AutomotoresQuery implements OnInit{

  constructor(
    protected readonly facade: AutomotorQueryPageFacadeService,
    private readonly router: Router,
    private readonly confirmationService: ConfirmationService
  ) {
    this.facade.init();
  }

  protected readonly cols = [
    { field: 'dominio', header: 'Dominio' },
    { field: 'numeroChasis', header: 'Número de chasis' },
    { field: 'numeroMotor', header: 'Número de motor' },
    { field: 'color', header: 'Color' },
    { field: 'fechaFabricacion', header: 'Fecha de fabricación' },
    { field: 'cuitDueno', header: 'CUIT del dueño' },
    { field: 'denominacionDueno', header: 'Denominación del dueño' },
    { field: 'actions', header: 'Acciones' }
  ];

  ngOnInit(): void {
    this.facade.init();
  }

  delete(dominio: string) {

    this.confirmationService.confirm({
      message: '¿Estás seguro de querer eliminar el automotor con dominio ' + dominio + '?',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptIcon: 'pi pi-trash',
      rejectIcon: 'pi pi-times',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      closable: false,
      accept: () => {
        this.facade.deleteByDominio(dominio);
      }
    });
  }

  edit(dominio: string) {
    this.router.navigate(['/automotores', dominio]);
  }

  create() {
    this.router.navigate(['/automotores', 'new']);
  }
}
