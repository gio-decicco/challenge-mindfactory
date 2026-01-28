import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Valida CUIT argentino (11 dígitos) con dígito verificador.
 * Devuelve { cuitInvalid: true } si no pasa.
 */
export function cuitValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const raw = (control.value ?? '').toString().trim();
    if (!raw) return null;

    const digits = raw.replace(/\D/g, '');
    if (digits.length !== 11) return { cuitInvalid: true };

    const nums = digits.split('').map((d: string) => Number(d));
    if (nums.some((n: number) => Number.isNaN(n))) return { cuitInvalid: true };

    const weights = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
    const sum = weights.reduce((acc, w, i) => acc + nums[i] * w, 0);
    const mod = sum % 11;
    let check = 11 - mod;
    if (check === 11) check = 0;
    if (check === 10) check = 9;

    return nums[10] === check ? null : { cuitInvalid: true };
  };
}

