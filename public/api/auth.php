<?php
/**
 * Inicio de sesión del Portal Clientes (AGAE Integral 360+).
 *   POST ?accion=ingresar  {usuario, clave}  -> inicia sesión
 *   GET  ?accion=sesion                       -> usuario de la sesión actual
 *   POST ?accion=salir                        -> cierra sesión
 * Las cuentas están en usuarios.php y se administran con `npm run usuario`.
 */
declare(strict_types=1);

const MAX_INTENTOS = 8;        // intentos fallidos por IP...
const VENTANA_INTENTOS = 900;  // ...en 15 minutos
const DURACION_SESION = 28800; // 8 horas

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function responder(int $codigo, array $datos): void
{
    http_response_code($codigo);
    echo json_encode($datos, JSON_UNESCAPED_UNICODE);
    exit;
}

$https = ($_SERVER['HTTPS'] ?? '') === 'on' || ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https';
session_name('AGAE360');
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'secure' => $https,
    'httponly' => true,
    'samesite' => 'Lax',
]);
session_start();

// Expira sesiones inactivas.
if (isset($_SESSION['usuario']) && time() - ($_SESSION['ultimo'] ?? 0) > DURACION_SESION) {
    $_SESSION = [];
    session_destroy();
    session_start();
}

/** Cuentas: usuarios.php empieza con una línea PHP que bloquea el acceso web; el resto es JSON. */
function cargarUsuarios(): array
{
    $texto = (string) @file_get_contents(__DIR__ . '/usuarios.php');
    $json = substr($texto, (int) strpos($texto, "\n") + 1);
    $datos = json_decode($json, true);
    return is_array($datos['usuarios'] ?? null) ? $datos['usuarios'] : [];
}

/** Formato: pbkdf2_sha256$iteraciones$sal_base64$hash_base64 */
function claveValida(string $clave, string $guardada): bool
{
    $partes = explode('$', $guardada);
    if (count($partes) !== 4 || $partes[0] !== 'pbkdf2_sha256') return false;
    [, $iteraciones, $sal, $hash] = $partes;
    $esperado = base64_decode($hash, true);
    if ($esperado === false) return false;
    $calculado = hash_pbkdf2('sha256', $clave, (string) base64_decode($sal), (int) $iteraciones, strlen($esperado), true);
    return hash_equals($esperado, $calculado);
}

function publico(array $u): array
{
    return [
        'usuario' => $u['usuario'],
        'nombre' => $u['nombre'],
        'empresa' => $u['empresa'],
        'cargo' => $u['cargo'] ?? '',
        'rol' => $u['rol'],
    ];
}

$accion = $_GET['accion'] ?? '';
$metodo = $_SERVER['REQUEST_METHOD'] ?? '';

if ($accion === 'sesion') {
    if (!isset($_SESSION['usuario'])) responder(401, ['ok' => false]);
    // Si la cuenta fue desactivada, la sesión deja de valer.
    foreach (cargarUsuarios() as $u) {
        if ($u['usuario'] === $_SESSION['usuario']['usuario'] && ($u['activo'] ?? false)) {
            $_SESSION['ultimo'] = time();
            responder(200, ['ok' => true, 'usuario' => publico($u)]);
        }
    }
    $_SESSION = [];
    session_destroy();
    responder(401, ['ok' => false]);
}

if ($metodo !== 'POST') responder(405, ['ok' => false, 'error' => 'Método no permitido.']);

if ($accion === 'salir') {
    $_SESSION = [];
    session_destroy();
    responder(200, ['ok' => true]);
}

if ($accion !== 'ingresar') responder(400, ['ok' => false, 'error' => 'Acción no válida.']);

// Límite de intentos fallidos por IP.
$ip = $_SERVER['REMOTE_ADDR'] ?? 'desconocida';
$registro = sys_get_temp_dir() . '/agae360_intentos_' . md5($ip);
$ahora = time();
$fallos = array_filter(
    array_map('intval', is_file($registro) ? (array) file($registro, FILE_IGNORE_NEW_LINES) : []),
    fn (int $t) => $t > $ahora - VENTANA_INTENTOS
);
if (count($fallos) >= MAX_INTENTOS) {
    responder(429, ['ok' => false, 'error' => 'Demasiados intentos. Espera unos minutos e inténtalo de nuevo.']);
}

$entrada = json_decode((string) file_get_contents('php://input'), true);
$usuario = strtolower(trim((string) ($entrada['usuario'] ?? '')));
$clave = (string) ($entrada['clave'] ?? '');

$encontrado = null;
foreach (cargarUsuarios() as $u) {
    if (strtolower($u['usuario']) === $usuario && claveValida($clave, (string) $u['clave'])) {
        $encontrado = $u;
        break;
    }
}

if ($encontrado === null) {
    $fallos[] = $ahora;
    @file_put_contents($registro, implode("\n", $fallos));
    usleep(400000);
    responder(401, ['ok' => false, 'error' => 'Usuario o contraseña incorrectos.']);
}
if (!($encontrado['activo'] ?? false)) {
    responder(403, ['ok' => false, 'error' => 'Tu cuenta no está activa. Comunícate con AGAE SOLUTIONS para reactivarla.']);
}

session_regenerate_id(true);
$_SESSION['usuario'] = publico($encontrado);
$_SESSION['ultimo'] = $ahora;
@unlink($registro);

responder(200, ['ok' => true, 'usuario' => publico($encontrado)]);
