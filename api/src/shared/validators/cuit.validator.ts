export function isCuitValido(cuit: string): boolean {
    if (!/^\d{11}$/.test(cuit)) return false;
  
    const coef = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
    let sum = 0;
  
    for (let i = 0; i < 10; i++) sum += parseInt(cuit[i]) * coef[i];
    let dig = 11 - (sum % 11);
    if (dig === 11) dig = 0;
    if (dig === 10) dig = 9;
    return dig === parseInt(cuit[10]);
  }