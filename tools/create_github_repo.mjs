import https from 'https';

const token = process.env.GITHUB_TOKEN || '';
const repoName = 'Idiomas';

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
  console.log(`Verificando se o repositório ${repoName} já existe no usuário pedrohagahss...`);
  const check = await apiRequest('GET', `/repos/pedrohagahss/${repoName}`);
  
  if (check.status === 200) {
    console.log(`✅ Repositório ${repoName} já existe: ${check.data.html_url}`);
  } else if (check.status === 404) {
    console.log(`Criando repositório ${repoName} no GitHub...`);
    const create = await apiRequest('POST', '/user/repos', {
      name: repoName,
      description: 'HQ Gamificada de Francês — Pedro Hagah (Aprendizado Imersivo de Francês Oral e Escrito)',
      homepage: `https://pedrohagahss.github.io/${repoName}/`,
      private: false,
      has_issues: true,
      has_projects: true,
      has_wiki: false,
      auto_init: false
    });
    
    if (create.status === 201) {
      console.log(`🎉 Repositório criado com sucesso: ${create.data.html_url}`);
    } else {
      console.error('Erro ao criar repositório:', create.status, create.data);
      process.exit(1);
    }
  } else {
    console.error('Resposta inesperada da API:', check.status, check.data);
    process.exit(1);
  }
}

main();
