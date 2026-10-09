<?php
/**
 * Formulario de contacto de la web de AGAE SOLUTIONS.
 * Recibe los datos del formulario (JSON) y los envía por correo a ventas@agaesolutions.com.
 * Se ejecuta en el hosting de DonWeb (PHP). En `next dev` no funciona porque no hay PHP.
 */
declare(strict_types=1);

const DESTINO = 'ventas@agaesolutions.com';
// El hosting exige que el remitente sea una cuenta del propio dominio.
const REMITENTE = 'ventas@agaesolutions.com';
// Máximo de envíos por IP por hora.
const LIMITE_POR_HORA = 5;

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function responder(int $codigo, array $datos): void
{
    http_response_code($codigo);
    echo json_encode($datos, JSON_UNESCAPED_UNICODE);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    responder(405, ['ok' => false, 'error' => 'Método no permitido.']);
}

// Solo aceptar envíos desde el propio sitio.
$host = strtolower(preg_replace('/:\d+$/', '', $_SERVER['HTTP_HOST'] ?? ''));
$origen = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origen !== '' && strtolower((string) parse_url($origen, PHP_URL_HOST)) !== $host) {
    responder(403, ['ok' => false, 'error' => 'Origen no permitido.']);
}

$entrada = json_decode((string) file_get_contents('php://input'), true);
if (!is_array($entrada)) {
    responder(400, ['ok' => false, 'error' => 'Solicitud inválida.']);
}

/** Texto limpio y recortado. $unaLinea elimina saltos de línea (evita inyección de cabeceras). */
function campo(array $datos, string $clave, int $max, bool $unaLinea = true): string
{
    $valor = trim(strip_tags((string) ($datos[$clave] ?? '')));
    if ($unaLinea) {
        $valor = preg_replace('/[\r\n\t]+/', ' ', $valor) ?? '';
    }
    return mb_substr($valor, 0, $max);
}

// Anti-spam: campo trampa oculto y tiempo mínimo de llenado.
$trampa = campo($entrada, 'sitio_web', 200);
$inicio = (int) ($entrada['t'] ?? 0);
$esBot = $trampa !== '' || ($inicio > 0 && (time() * 1000 - $inicio) < 3000);
if ($esBot) {
    responder(200, ['ok' => true]); // Respuesta normal para no dar pistas.
}

$nombre = campo($entrada, 'nombre', 120);
$empresa = campo($entrada, 'empresa', 160);
$correo = campo($entrada, 'correo', 160);
$telefono = campo($entrada, 'telefono', 40);
$ciudad = campo($entrada, 'ciudad', 80);
$servicio = campo($entrada, 'servicio', 80);
$mensaje = campo($entrada, 'mensaje', 4000, false);
$acepta = ($entrada['acepta'] ?? false) === true;

$errores = [];
if ($nombre === '') $errores[] = 'Escribe tu nombre.';
if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) $errores[] = 'Escribe un correo válido.';
if ($mensaje === '') $errores[] = 'Cuéntanos en qué podemos ayudarte.';
if (!$acepta) $errores[] = 'Debes autorizar el tratamiento de tus datos.';
if ($errores) {
    responder(422, ['ok' => false, 'error' => implode(' ', $errores)]);
}

// Límite de envíos por IP.
$ip = $_SERVER['REMOTE_ADDR'] ?? 'desconocida';
$registro = sys_get_temp_dir() . '/agae_contacto_' . md5($ip);
$ahora = time();
$envios = array_filter(
    array_map('intval', is_file($registro) ? (array) file($registro, FILE_IGNORE_NEW_LINES) : []),
    fn (int $t) => $t > $ahora - 3600
);
if (count($envios) >= LIMITE_POR_HORA) {
    responder(429, ['ok' => false, 'error' => 'Has enviado varios mensajes seguidos. Inténtalo de nuevo más tarde.']);
}

$asunto = 'Nuevo contacto web: ' . ($servicio !== '' ? $servicio : 'Consulta general') . ' — ' . ($empresa !== '' ? $empresa : $nombre);
$cuerpo = implode("\n", [
    'Nuevo mensaje desde el formulario de contacto de agaesolutions.com',
    str_repeat('-', 60),
    'Nombre:    ' . $nombre,
    'Empresa:   ' . ($empresa ?: '—'),
    'Correo:    ' . $correo,
    'Teléfono:  ' . ($telefono ?: '—'),
    'Ciudad:    ' . ($ciudad ?: '—'),
    'Servicio:  ' . ($servicio ?: '—'),
    str_repeat('-', 60),
    'Mensaje:',
    $mensaje,
    str_repeat('-', 60),
    'Autorizó el tratamiento de datos personales (Ley 1581 de 2012): Sí',
    'Fecha: ' . date('Y-m-d H:i:s'),
    'IP: ' . $ip,
]);

// DonWeb tiene desactivada mail(): se envía por SMTP autenticado con la cuenta de ventas.
define('AGAE_CORREO', true);
$smtp = require __DIR__ . '/api/config-correo.php';
if (($smtp['clave'] ?? '') === '' || $smtp['clave'] === 'ESCRIBE_AQUI_LA_CLAVE') {
    error_log('contacto.php: falta la clave SMTP en api/config-correo.php');
    responder(500, ['ok' => false, 'error' => 'El formulario aún no está configurado.']);
}

try {
    enviarSmtp($smtp, REMITENTE, 'Web AGAE SOLUTIONS', DESTINO, $correo, $nombre, $asunto, $cuerpo);
} catch (Throwable $e) {
    error_log('contacto.php SMTP: ' . $e->getMessage());
    responder(500, ['ok' => false, 'error' => 'No pudimos enviar tu mensaje en este momento.']);
}

$envios[] = $ahora;
@file_put_contents($registro, implode("\n", $envios));

responder(200, ['ok' => true]);

/** Cliente SMTP mínimo (SSL + AUTH LOGIN). Lanza una excepción si el servidor rechaza algún paso. */
function enviarSmtp(array $cfg, string $de, string $deNombre, string $para, string $responderA, string $responderNombre, string $asunto, string $cuerpo): void
{
    $conexion = @stream_socket_client(
        'ssl://' . $cfg['host'] . ':' . (int) $cfg['puerto'],
        $errno,
        $errstr,
        20,
        STREAM_CLIENT_CONNECT,
        stream_context_create(['ssl' => ['verify_peer' => true, 'verify_peer_name' => true]])
    );
    if (!$conexion) throw new RuntimeException("No se pudo conectar: $errstr ($errno)");
    stream_set_timeout($conexion, 20);

    $leer = function () use ($conexion): string {
        $respuesta = '';
        while (($linea = fgets($conexion, 1024)) !== false) {
            $respuesta .= $linea;
            if (strlen($linea) < 4 || $linea[3] === ' ') break;
        }
        return $respuesta;
    };
    $comando = function (?string $linea, int $esperado) use ($conexion, $leer): void {
        if ($linea !== null) fwrite($conexion, $linea . "\r\n");
        $respuesta = $leer();
        if ((int) substr($respuesta, 0, 3) !== $esperado) {
            $mostrar = str_starts_with((string) $linea, 'AUTH') || $esperado === 235 || $esperado === 334 ? '[credenciales]' : (string) $linea;
            throw new RuntimeException("SMTP $mostrar -> " . trim($respuesta));
        }
    };

    $comando(null, 220);
    $comando('EHLO ' . ($_SERVER['HTTP_HOST'] ?? 'localhost'), 250);
    $comando('AUTH LOGIN', 334);
    $comando(base64_encode($cfg['usuario']), 334);
    $comando(base64_encode($cfg['clave']), 235);
    $comando('MAIL FROM:<' . $de . '>', 250);
    $comando('RCPT TO:<' . $para . '>', 250);
    $comando('DATA', 354);

    $dominio = substr(strrchr($de, '@'), 1);
    $mensaje = implode("\r\n", [
        'Date: ' . date('r'),
        'From: ' . mb_encode_mimeheader($deNombre, 'UTF-8') . ' <' . $de . '>',
        'To: <' . $para . '>',
        'Reply-To: ' . mb_encode_mimeheader($responderNombre, 'UTF-8') . ' <' . $responderA . '>',
        'Subject: ' . mb_encode_mimeheader($asunto, 'UTF-8'),
        'Message-ID: <' . bin2hex(random_bytes(12)) . '@' . $dominio . '>',
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: base64',
        '',
        rtrim(chunk_split(base64_encode($cuerpo), 76, "\r\n")),
        '.',
    ]);
    $comando($mensaje, 250);
    fwrite($conexion, "QUIT\r\n");
    fclose($conexion);
}

