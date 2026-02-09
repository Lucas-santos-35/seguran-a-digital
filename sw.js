/**
 * Service Worker para o Portal de Segurança Digital
 * Responsável por permitir o funcionamento offline e cache de recursos.
 */

const CACHE_NAME = 'cidadao-digital-v1';

// Recursos que serão armazenados em cache para acesso offline
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css'
];

// Evento de Instalação: Cria o cache e adiciona os ficheiros
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Cache aberto: a armazenar recursos...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Evento de Ativação: Limpa caches antigos, se existirem
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('A remover cache antigo:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Evento de Fetch: Tenta a rede primeiro, se falhar (offline), usa o cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
