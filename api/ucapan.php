<?php
/*
 * API ucapan & doa tamu — PHP + SQLite (tanpa dependensi lain).
 *   GET  api/ucapan.php            → { ok, total, hadir, tidak, ragu, items: [...] }
 *   POST api/ucapan.php  (JSON)    → { nama, kehadiran, ucapan } → { ok, item }
 * Database dibuat otomatis di api/data/ucapan.sqlite.
 */
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

const DB_FILE    = __DIR__ . '/data/ucapan.sqlite';
const MAX_NAMA   = 60;
const MAX_UCAPAN = 500;
const LIMIT_LIST = 200;   // jumlah ucapan terbaru yang ditampilkan
const JEDA_DETIK = 20;    // jeda minimal antar kiriman dari perangkat/IP yang sama
const KEHADIRAN  = ['hadir', 'tidak', 'ragu'];

function reply(int $code, array $body): void {
    http_response_code($code);
    echo json_encode($body, JSON_UNESCAPED_UNICODE);
    exit;
}

function db(): PDO {
    $pdo = new PDO('sqlite:' . DB_FILE, null, null, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
    $pdo->exec('PRAGMA journal_mode = WAL; PRAGMA busy_timeout = 3000;');
    $pdo->exec('CREATE TABLE IF NOT EXISTS ucapan (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        nama       TEXT    NOT NULL,
        kehadiran  TEXT    NOT NULL CHECK (kehadiran IN (\'hadir\', \'tidak\', \'ragu\')),
        ucapan     TEXT    NOT NULL,
        ip_hash    TEXT    NOT NULL,
        dibuat     TEXT    NOT NULL DEFAULT (strftime(\'%Y-%m-%dT%H:%M:%SZ\', \'now\'))
    )');
    $pdo->exec('CREATE INDEX IF NOT EXISTS ucapan_ip ON ucapan (ip_hash, dibuat)');
    return $pdo;
}

/** Rapikan teks: buang karakter kontrol, satukan spasi, batasi panjang. */
function clean(string $s, int $max, bool $multiline = false): string {
    $s = str_replace(["\r\n", "\r"], "\n", $s);
    $s = preg_replace('/[^\P{C}\n]/u', '', $s) ?? '';
    $s = $multiline ? preg_replace("/[ \t]+/u", ' ', $s) : preg_replace('/\s+/u', ' ', $s);
    $s = preg_replace("/\n{3,}/", "\n\n", (string) $s);
    return mb_substr(trim((string) $s), 0, $max);
}

function row(array $r): array {
    return ['id' => (int) $r['id'], 'nama' => $r['nama'], 'kehadiran' => $r['kehadiran'],
            'ucapan' => $r['ucapan'], 'dibuat' => $r['dibuat']];
}

try {
    $pdo = db();
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

    if ($method === 'GET') {
        $items = $pdo->query('SELECT id, nama, kehadiran, ucapan, dibuat FROM ucapan ORDER BY id DESC LIMIT ' . LIMIT_LIST)->fetchAll();
        $count = ['hadir' => 0, 'tidak' => 0, 'ragu' => 0];
        foreach ($pdo->query('SELECT kehadiran, COUNT(*) AS n FROM ucapan GROUP BY kehadiran') as $c) {
            $count[$c['kehadiran']] = (int) $c['n'];
        }
        reply(200, ['ok' => true, 'total' => array_sum($count)] + $count + ['items' => array_map('row', $items)]);
    }

    if ($method !== 'POST') {
        header('Allow: GET, POST');
        reply(405, ['ok' => false, 'error' => 'Metode tidak didukung.']);
    }

    $in = json_decode((string) file_get_contents('php://input', false, null, 0, 8192), true);
    if (!is_array($in)) $in = $_POST;

    // Honeypot: bot biasanya mengisi semua kolom.
    if (!empty($in['website'])) reply(200, ['ok' => true, 'item' => null]);

    $nama      = clean((string) ($in['nama'] ?? ''), MAX_NAMA);
    $ucapan    = clean((string) ($in['ucapan'] ?? ''), MAX_UCAPAN, true);
    $kehadiran = (string) ($in['kehadiran'] ?? '');

    if ($nama === '')                              reply(422, ['ok' => false, 'error' => 'Nama wajib diisi.']);
    if (mb_strlen($ucapan) < 2)                    reply(422, ['ok' => false, 'error' => 'Ucapan wajib diisi.']);
    if (!in_array($kehadiran, KEHADIRAN, true))    reply(422, ['ok' => false, 'error' => 'Pilih konfirmasi kehadiran.']);

    $ipHash = hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? '') . '|' . __FILE__);
    $recent = $pdo->prepare("SELECT COUNT(*) FROM ucapan WHERE ip_hash = ? AND dibuat > strftime('%Y-%m-%dT%H:%M:%SZ', 'now', ?)");
    $recent->execute([$ipHash, '-' . JEDA_DETIK . ' seconds']);
    if ((int) $recent->fetchColumn() > 0) reply(429, ['ok' => false, 'error' => 'Mohon tunggu sebentar sebelum mengirim lagi.']);

    $ins = $pdo->prepare('INSERT INTO ucapan (nama, kehadiran, ucapan, ip_hash) VALUES (?, ?, ?, ?)');
    $ins->execute([$nama, $kehadiran, $ucapan, $ipHash]);
    $get = $pdo->prepare('SELECT id, nama, kehadiran, ucapan, dibuat FROM ucapan WHERE id = ?');
    $get->execute([$pdo->lastInsertId()]);
    reply(201, ['ok' => true, 'item' => row($get->fetch())]);
} catch (Throwable $e) {
    error_log('[ucapan] ' . $e->getMessage());
    reply(500, ['ok' => false, 'error' => 'Terjadi kesalahan di server. Coba lagi nanti.']);
}
