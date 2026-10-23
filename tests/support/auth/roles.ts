export const ROLES = ['caja'] as const;
export type Role = typeof ROLES[number];

export const authFile = (role: Role) => `playwright/.auth/${role}.json`;

export function credentials(role: Role) {
  const prefix = role.toUpperCase();
  const email = process.env[`${prefix}_EMAIL`];
  const password = process.env[`${prefix}_PASSWORD`];
  if (!email || !password) throw new Error(`Faltan ${prefix}_EMAIL / ${prefix}_PASSWORD en el entorno`);
  return { email, password };
}
