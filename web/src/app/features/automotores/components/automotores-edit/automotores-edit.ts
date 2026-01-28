import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { AutomotorEditPageFacadeService } from '../../domain/automotor-edit.page.facade.service';
import { AutomotorUpdateDto } from '../../models/automotor.update.dto';
import { SujetosService } from '../../../sujetos/sujetos.service';
import { cuitValidator } from '../../../../shared/validators/cuit.validator';
import { sujetoExistsAsyncValidator } from '../../../../shared/validators/sujeto-exists.async-validator';
import { SujetoCreateDialog } from '../../../sujetos/components/sujeto-create-dialog/sujeto-create-dialog';

@Component({
  selector: 'app-automotores-edit',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    MessageModule,
    ConfirmDialogModule,
    SujetoCreateDialog
  ],
  providers: [AutomotorEditPageFacadeService, ConfirmationService, SujetosService],
  templateUrl: './automotores-edit.html',
  styleUrl: './automotores-edit.css',
})
export class AutomotoresEdit implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly sujetosService = inject(SujetosService);
  protected readonly facade = inject(AutomotorEditPageFacadeService);

  form!: FormGroup;
  createSujetoDialogVisible = false;
  createSujetoDialogCuit = '';
  private lastPromptedCuit: string | null = null;
  dominio!: string;
  private subs = new Subscription();

  ngOnInit(): void {
    this.facade.init();
    this.dominio = this.route.snapshot.params['dominio'];
    this.initForm();
    this.setupCuitNotFoundDialog();
    
    this.subs.add(this.facade.saved$.subscribe(saved => {
      if (saved) {
        this.router.navigate(['/automotores']);
      }
    }));

    this.subs.add(this.facade.automotor$.subscribe(automotor => {
      if (automotor) {
        this.loadForm(automotor);
      }
    }));

    this.facade.load(this.dominio);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  private initForm(): void {
    this.form = this.fb.group({
      dominio: [
        '',
        [
          Validators.required,
          Validators.pattern(/^([A-Za-z]{3}\d{3}|[A-Za-z]{2}\d{3}[A-Za-z]{2})$/),
        ],
      ],
      numeroChasis: ['', Validators.maxLength(50)],
      numeroMotor: ['', Validators.maxLength(50)],
      color: ['', Validators.maxLength(50)],
      fechaFabricacion: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
      cuitDuenio: this.fb.control(
        '',
        {
          validators: [Validators.required, Validators.pattern(/^\d{11}$/), cuitValidator()],
          asyncValidators: [sujetoExistsAsyncValidator(this.sujetosService)],
          updateOn: 'blur',
        }
      )
    });
  }

  private setupCuitNotFoundDialog(): void {
    const cuitCtrl = this.form.get('cuitDuenio');
    if (!cuitCtrl) return;

    this.subs.add(
      cuitCtrl.statusChanges.subscribe(() => {
        const raw = (cuitCtrl.value ?? '').toString();
        const digits = raw.replace(/\D/g, '');

        if (!cuitCtrl.touched) return;
        if (!cuitCtrl.hasError('sujetoNotFound')) return;
        if (cuitCtrl.hasError('cuitInvalid') || cuitCtrl.hasError('pattern')) return;

        if (digits && this.lastPromptedCuit === digits) return;
        if (!digits) return;

        this.lastPromptedCuit = digits;
        this.createSujetoDialogCuit = digits;
        this.openCreateSujetoDialog();
      })
    );
  }

  protected openCreateSujetoDialog(): void {
    this.createSujetoDialogVisible = true;
  }

  protected closeCreateSujetoDialog(): void {
    this.createSujetoDialogVisible = false;
  }

  protected onSujetoDialogVisibleChange(visible: boolean): void {
    this.createSujetoDialogVisible = visible;
    if (!visible) {
      const cuitCtrl = this.form.get('cuitDuenio');
      cuitCtrl?.updateValueAndValidity();
    }
  }

  protected onSujetoCreated(): void {
    const cuitCtrl = this.form.get('cuitDuenio');
    if (!cuitCtrl) return;
    cuitCtrl.updateValueAndValidity();
  }

  private loadForm(automotor: any): void {
    this.form.patchValue({
      dominio: automotor.dominio,
      numeroChasis: automotor.numeroChasis || '',
      numeroMotor: automotor.numeroMotor || '',
      color: automotor.color || '',
      fechaFabricacion: automotor.fechaFabricacion?.toString() || '',
      cuitDuenio: automotor.cuitDueno || ''
    });
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.getRawValue();
    
    this.confirmationService.confirm({
      message: '¿Estás seguro de querer actualizar el automotor con dominio ' + this.dominio + '?',
      acceptLabel: 'Actualizar',
      rejectLabel: 'Cancelar',
      acceptIcon: 'pi pi-check',
      rejectIcon: 'pi pi-times',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-secondary',
      closable: false,
      accept: () => {
        const dto: AutomotorUpdateDto = {
          dominio: formValue.dominio,
          numeroChasis: formValue.numeroChasis || undefined,
          numeroMotor: formValue.numeroMotor || undefined,
          color: formValue.color || undefined,
          fechaFabricacion: parseInt(formValue.fechaFabricacion),
          cuitDuenio: formValue.cuitDuenio
        };
        this.facade.update(this.dominio, dto);
      }
    });
  }

  protected getFieldError(fieldName: string): string | null {
    const field = this.form.get(fieldName);
    if (!field || !field.errors || !field.touched) return null;

    if (field.errors['required']) {
      return `${this.getFieldLabel(fieldName)} es requerido`;
    }
    if (field.errors['cuitInvalid']) {
      return 'CUIT inválido (dígito verificador incorrecto)';
    }
    if (field.errors['pattern']) {
      if (fieldName === 'dominio') {
        return 'Formato inválido. Debe ser AAA999 (ej: ABC123) o AA999AA (ej: AB123CD)';
      }
      if (fieldName === 'cuitDuenio') {
        return 'CUIT debe tener 11 dígitos';
      }
      if (fieldName === 'fechaFabricacion') {
        return 'Formato inválido. Debe ser YYYYMM (ej: 202303)';
      }
    }
    if (field.errors['sujetoNotFound']) {
      return 'No existe sujeto con ese CUIT (se abrirá un diálogo para crearlo)';
    }
    if (field.errors['sujetoLookupFailed']) {
      return 'No se pudo validar el CUIT contra el backend';
    }
    if (field.errors['maxlength']) {
      return `${this.getFieldLabel(fieldName)} debe tener menos de 50 caracteres`;
    }
    return null;
  }

  private getFieldLabel(fieldName: string): string {
    const labels: Record<string, string> = {
      dominio: 'Dominio',
      numeroChasis: 'Número de chasis',
      numeroMotor: 'Número de motor',
      color: 'Color',
      fechaFabricacion: 'Fecha de fabricación',
      cuitDuenio: 'CUIT del dueño'
    };
    return labels[fieldName] || fieldName;
  }

  protected cancel(): void {
    this.router.navigate(['/automotores']);
  }
}
