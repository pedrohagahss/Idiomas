import https from 'https';

const token = process.env.GITHUB_TOKEN || '';
const owner = 'pedrohagahss';
const repo = 'Idiomas';

function apiRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const payload = data ? JSON.stringify(data) : null;
    const req = https.request({
      hostname: 'api.github.com',
      path,
      method,
      headers: {
        'User-Agent': 'NodeJS',
        'Authorization': 'Bearer ' + token,
        'Accept': 'application/vnd.github+json',
        ...(payload ? {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        } : {})
      }
    }, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = body ? JSON.parse(body) : {};
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, body });
        }
      });
    });
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function main() {
  console.log(`Verificando status do GitHub Pages para ${owner}/${repo}...`);
  const check = await apiRequest('GET', `/repos/${owner}/${repo}/pages`);
  
  if (check.status === 200) {
    console.log(`✅ GitHub Pages já está ativo: ${check.data.html_url}`);
  } else {
    console.log(`Ativando GitHub Pages no branch main (root /)...`);
    const enable = await apiRequest('POST', `/repos/${owner}/${repo}/pages`, {
      source: {
        branch: 'main',
        path: '/'
      }
    });

    if (enable.status === 201 || enable.status === 200) {
      console.log(`🎉 GitHub Pages ativado com sucesso! URL: ${enable.data.html_url}`);
    } else {
      console.error('Retorno ao ativar Pages:', enable.status, enable.data);
      // Tentar atualizar caso já exista configuração
      const update = await apiRequest('PUT', `/repos/${owner}/${repo}/pages`, {
        source: {
          branch: 'main',
          path: '/'
        }
      });
      console.log('Tentativa de PUT:', update.status, update.data);
    }
  }
}

main();
