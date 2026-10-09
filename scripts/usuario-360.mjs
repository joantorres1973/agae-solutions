#!/usr/bin/env node
/**
 * Administra las cuentas del Portal Clientes (public/api/usuarios.php).
 *
 *   npm run usuario -- listar
 *   npm run usuario -- crear <usuario> <clave> "<Nombre>" "<Empresa>" ["<Cargo>"]
 *   npm run usuario -- clave <usuario> <nueva-clave>
 *   npm run usuario -- desactivar <usuario>
 *   npm run usuario -- activar <usuario>
 *   npm run usuario -- eliminar <usuario>
 *
 * Después de cualquier cambio, sube public/api/usuarios.php a DonWeb (o vuelve a generar el ZIP).
 */
import { pbkdf2Sync, randomBytes } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const FILE = fileURLToPath(new URL('../public/api/usuarios.php', import.meta.url));
const GUARD = '<?php http_response_code(404); exit; ?>';
const ITERATIONS = 120000;

const load = () => {
  const text = readFileSync(FILE, 'utf8');
  return JSON.parse(text.slice(text.indexOf('\n') + 1));
};
const save = data => writeFileSync(FILE, `${GUARD}\n${JSON.stringify(data, null, 2)}\n`);

export const hashPassword = password => {
  const salt = randomBytes(16);
  const hash = pbkdf2Sync(password, salt, ITERATIONS, 32, 'sha256');
  return `pbkdf2_sha256$${ITERATIONS}$${salt.toString('base64')}$${hash.toString('base64')}`;
};

const fail = msg => {
  console.error(`✗ ${msg}`);
  process.exit(1);
};

const [cmd, user, ...rest] = process.argv.slice(2);
const data = load();
const find = u => data.usuarios.find(x => x.usuario === String(u ?? '').toLowerCase());

switch (cmd) {
  case 'listar':
    console.table(data.usuarios.map(({ clave, ...u }) => u));
    break;
  case 'crear': {
    const [password, nombre, empresa, cargo = ''] = rest;
    if (!user || !password || !nombre || !empresa) fail('Uso: crear <usuario> <clave> "<Nombre>" "<Empresa>" ["<Cargo>"]');
    if (find(user)) fail(`El usuario "${user}" ya existe.`);
    if (password.length < 8) fail('La clave debe tener al menos 8 caracteres.');
    data.usuarios.push({ usuario: user.toLowerCase(), clave: hashPassword(password), nombre, empresa, cargo, rol: 'cliente', activo: true });
    save(data);
    console.log(`✓ Usuario "${user}" creado para ${empresa}.`);
    break;
  }
  case 'clave': {
    const u = find(user);
    if (!u || !rest[0]) fail('Uso: clave <usuario> <nueva-clave>');
    if (u.rol !== 'demo' && rest[0].length < 8) fail('La clave debe tener al menos 8 caracteres.');
    u.clave = hashPassword(rest[0]);
    save(data);
    console.log(`✓ Clave de "${user}" actualizada.`);
    break;
  }
  case 'activar':
  case 'desactivar': {
    const u = find(user);
    if (!u) fail(`No existe el usuario "${user}".`);
    u.activo = cmd === 'activar';
    save(data);
    console.log(`✓ Usuario "${user}" ${u.activo ? 'activado' : 'desactivado'}.`);
    break;
  }
  case 'eliminar': {
    if (!find(user)) fail(`No existe el usuario "${user}".`);
    data.usuarios = data.usuarios.filter(x => x.usuario !== user.toLowerCase());
    save(data);
    console.log(`✓ Usuario "${user}" eliminado.`);
    break;
  }
  default:
    console.log(readFileSync(fileURLToPath(import.meta.url), 'utf8').split('*/')[0]);
}
