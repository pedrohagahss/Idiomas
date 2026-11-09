/**
 * Servidor HTTP local ultraleve em Node.js com Endpoint de Voz Neural Francesa
 * Síntese direta via MsEdgeTTS toStream com cache em MP3 e proteção contra EBUSY.
 * Suporta TikTok Side-Dock e Leitura Contínua de Dossiers / Notícias por IA.
 * Uso: node tools/serve.mjs [porta]
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const req = createRequire('C:\\Users\\seuca\\.gemini\\config\\scripts\\piper\\package.json');
const { MsEdgeTTS, OUTPUT_FORMAT } = req('msedge-tts');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const PORT = parseInt(process.argv[2] || '5173', 10);
const CACHE_DIR = path.join(ROOT, 'assets', 'audio', 'cache');

if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

const pendingGenerations = new Map();

process.on('uncaughtException', (err) => {
  console.error('Servidor HTTP capturou exceção não tratada:', err.message);
});
process.on('unhandledRejection', (reason) => {
  console.error('Servidor HTTP capturou rejeição não tratada:', reason);
});

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.ico': 'image/x-icon'
};

function sendAudioBuffer(filePath, req, res, retries = 5) {
  fs.stat(filePath, (err, stats) => {
    if (err) {
      if (retries > 0 && (err.code === 'EBUSY' || err.code === 'EACCES' || err.code === 'ENOENT')) {
        return setTimeout(() => sendAudioBuffer(filePath, req, res, retries - 1), 120);
      }
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Erro ao inspecionar áudio', details: err.message }));
      }
      return;
    }

    const total = stats.size;
    const range = req ? req.headers.range : null;

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : total - 1;

      if (start >= total || end >= total) {
        res.writeHead(416, { 'Content-Range': `bytes */${total}` });
        res.end();
        return;
      }

      const chunkSize = (end - start) + 1;
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${total}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-cache'
      });
      const stream = fs.createReadStream(filePath, { start, end });
      stream.pipe(res);
      return;
    }

    fs.readFile(filePath, (errRead, buffer) => {
      if (errRead) {
        if (!res.headersSent) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Erro ao ler arquivo de áudio', details: errRead.message }));
        }
        return;
      }
      if (!res.headersSent) {
        res.writeHead(200, {
          'Content-Type': 'audio/mpeg',
          'Content-Length': buffer.length,
          'Accept-Ranges': 'bytes',
          'Cache-Control': 'public, max-age=31536000'
        });
        res.end(buffer);
      }
    });
  });
}

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  let reqPath = decodeURIComponent(req.url.split('?')[0]);

  // ====================================================================
  // ENDPOINT DE VOZ NEURAL ULTRA-REALISTA (FRANCÊS STUDIO QUALIDADE)
  // ====================================================================
  if (reqPath === '/api/tts') {
    const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const text = (urlObj.searchParams.get('text') || '').trim();
    const speaker = (urlObj.searchParams.get('speaker') || 'PEDRO').toUpperCase();

    if (!text) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Parâmetro text é obrigatório' }));
      return;
    }

    // Seleção rigorosa de vozes neurais existentes no catálogo oficial Edge TTS
    let voice = 'fr-FR-HenriNeural'; // Padrão / Pedro Hagah
    if (speaker.includes('ELENA')) voice = 'fr-FR-DeniseNeural'; // Elena Rostand
    else if (speaker.includes('AMINA')) voice = 'fr-FR-VivienneMultilingualNeural'; // Amina Diop
    else if (speaker.includes('MARIE')) voice = 'fr-CH-ArianeNeural'; // Marie (Diplomate Romande)
    else if (speaker.includes('CHARLINE') || speaker.includes('BELGE_FEMME')) voice = 'fr-BE-CharlineNeural';
    else if (speaker.includes('SYLVIE') || speaker.includes('QUEBEC_FEMME')) voice = 'fr-CA-SylvieNeural';
    else if (speaker.includes('MATHIEU') || speaker.includes('MARIN') || speaker.includes('JEAN-BAPTISTE')) voice = 'fr-CA-JeanNeural';
    else if (speaker.includes('YANN')) voice = 'fr-BE-GerardNeural';
    else if (speaker.includes('LUCAS')) voice = 'fr-CH-FabriceNeural';
    else if (speaker.includes('GRIOT') || speaker.includes('NARRATEUR') || speaker.includes('PROF') || speaker.includes('GUIDE')) voice = 'fr-FR-RemyMultilingualNeural';
    else if (speaker.includes('FEMME') || speaker.includes('DAME') || speaker.includes('FILLE') || speaker.includes('WOMAN')) voice = 'fr-FR-DeniseNeural';
    else if (speaker.includes('DOUANIER')) voice = 'fr-FR-HenriNeural';

    const hash = crypto.createHash('md5').update(`${voice}_${text}`).digest('hex');
    const cachedFile = path.join(CACHE_DIR, `${hash}.mp3`);

    if (fs.existsSync(cachedFile)) {
      return sendAudioBuffer(cachedFile, req, res);
    }

    if (pendingGenerations.has(hash)) {
      pendingGenerations.get(hash)
        .then(() => sendAudioBuffer(cachedFile, req, res))
        .catch(() => {
          if (!res.headersSent) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Falha na geração concorrente do áudio' }));
          }
        });
      return;
    }

    const genPromise = (async () => {
      const tts = new MsEdgeTTS();
      await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3);
      const { audioStream } = tts.toStream(text);
      const writer = fs.createWriteStream(cachedFile);
      audioStream.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        audioStream.on('error', reject);
        writer.on('error', reject);
      });
    })();

    pendingGenerations.set(hash, genPromise);

    genPromise
      .then(() => {
        pendingGenerations.delete(hash);
        sendAudioBuffer(cachedFile, req, res);
      })
      .catch((err) => {
        pendingGenerations.delete(hash);
        console.error('Falha na síntese Edge TTS:', err.message);
        if (!res.headersSent) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Falha na síntese de voz neural', details: err.message }));
        }
      });

    return;
  }

  // ====================================================================
  // SERVIDOR ESTÁTICO DE ARQUIVOS
  // ====================================================================
  if (reqPath === '/' || reqPath === '') reqPath = '/app/index.html';
  if (reqPath === '/app' || reqPath === '/app/') reqPath = '/app/index.html';

  const filePath = path.join(ROOT, reqPath);

  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end('Acesso negado');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(`404 Não Encontrado: ${reqPath}`);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const total = stats.size;
    const range = req.headers.range;

    // Suporte obrigatório a HTTP 206 Partial Content para iOS Safari / WebKit em áudio e vídeo
    if (range && (contentType.startsWith('audio/') || contentType.startsWith('video/'))) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : total - 1;

      if (start >= total || end >= total) {
        res.writeHead(416, { 'Content-Range': `bytes */${total}` });
        res.end();
        return;
      }

      const chunkSize = (end - start) + 1;
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${total}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': contentType,
        'Cache-Control': 'no-cache'
      });

      const stream = fs.createReadStream(filePath, { start, end });
      stream.on('error', (err) => {
        console.warn('Erro no stream parcial de áudio:', err.message);
        if (!res.headersSent) res.writeHead(500);
        res.end();
      });
      stream.pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Length': total,
        'Accept-Ranges': 'bytes',
        'Content-Type': contentType,
        'Cache-Control': 'no-cache'
      });

      const stream = fs.createReadStream(filePath);
      stream.on('error', (streamErr) => {
        console.warn('Erro na transmissão do arquivo estático:', streamErr.message);
        if (!res.headersSent) {
          res.writeHead(500);
          res.end();
        }
      });
      stream.pipe(res);
    }
  });
});

server.listen(PORT, () => {
  console.log(`\n🚀 HQ Gamifiée de Français servida com sucesso!`);
  console.log(`👉 Acesse no navegador: http://localhost:${PORT}/app/`);
  console.log(`🎤 Endpoint de Áudio Neural ativo em: http://localhost:${PORT}/api/tts\n`);
});
