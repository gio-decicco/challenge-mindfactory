import { UnprocessableEntityException } from '@nestjs/common';

export function isFechaValido(value: string | number) : boolean{
  const str = String(value);

  if (!/^\d{6}$/.test(str)) {
    throw new UnprocessableEntityException(
      'Fecha de fabricación inválida (formato YYYYMM)',
    );
  }

  const year = Number(str.substring(0, 4));
  const month = Number(str.substring(4, 6));

  const now = new Date();
  const currentDate =
    now.getFullYear() * 100 + (now.getMonth() + 1);

  if (year < 1900 || month < 1 || month > 12) {
    throw new UnprocessableEntityException(
      'Fecha de fabricación inválida',
    );
  }

  if (Number(str) > currentDate) {
    throw new UnprocessableEntityException(
      'La fecha de fabricación no puede ser futura',
    );
  }

  return true;
}