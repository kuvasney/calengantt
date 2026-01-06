/**
 * Utilitários para formatação de datas
 */

/**
 * Formata uma data no padrão brasileiro (dd/mm/aaaa)
 */
export function formatDate(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("pt-BR");
}

/**
 * Formata uma data com opções personalizadas
 */
export function formatDateCustom(
  date: string | Date,
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("pt-BR", options);
}

/**
 * Formata apenas o mês (abreviado)
 */
export function formatMonth(date: string | Date): string {
  return formatDateCustom(date, { month: "short" });
}

/**
 * Formata data completa (dia da semana, dia, mês e ano)
 */
export function formatDateLong(date: string | Date): string {
  return formatDateCustom(date, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Formata data e hora
 */
export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleString("pt-BR");
}
