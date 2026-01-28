import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SujetosService } from '../../sujetos.service';
import { SujetoDto } from '../../models/sujeto.dto';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sujeto-create-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    MessageModule,
  ],
  providers: [SujetosService],
  templateUrl: './sujeto-create-dialog.html',
  styleUrl: './sujeto-create-dialog.css',
})
export class SujetoCreateDialog {
  private readonly subscriptions = new Subscription();
  private readonly fb = inject(FormBuilder);
  private readonly sujetosService = inject(SujetosService);

  @Input({ required: true }) cuit!: string;

  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Output() sujetoCreado = new EventEmitter<SujetoDto>();

  loading = false;
  error: string | null = null;

  readonly form = this.fb.group({
    denominacion: ['', [Validators.required, Validators.maxLength(160)]],
  });

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onHide(): void {
    this.close();
  }

  close(): void {
    this.visible = false;
    this.visibleChange.emit(false);
    this.error = null;
    this.loading = false;
    this.form.reset();
  }

  submit(): void {
    const cuitDigits = (this.cuit ?? '').toString().replace(/\D/g, '');
    if (!cuitDigits) return;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const denominacion = (this.form.value.denominacion ?? '').toString().trim();
    if (!denominacion) return;

    this.loading = true;
    this.error = null;

    this.subscriptions.add(this.sujetosService.create({ cuit: cuitDigits, denominacion }).subscribe({
      next: (sujeto) => {
        this.loading = false;
        this.sujetoCreado.emit(sujeto);
        this.close();
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || err?.message || 'Error al crear sujeto';
      },
    }));
  }
}

