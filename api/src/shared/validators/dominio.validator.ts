export function isDominioValido(dominio: string): boolean {
    const regex = /^[A-Z]{3}[0-9]{3}$|^[A-Z]{2}[0-9]{3}[A-Z]{2}$/;
    return regex.test(dominio.toUpperCase());
  }