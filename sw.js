const CACHE='mi-trabajo-v1';

const ASSETS=[
 './index.html',
 './manifest.webmanifest',
 './icon.svg'
];

self.addEventListener('install',e=>{
 e.waitUntil(
  caches.open(CACHE)
  .then(c=>c.addAll(ASSETS))
 );
});

self.addEventListener('activate',e=>{
 e.waitUntil(self.clients.claim());
});


self.addEventListener('fetch',e=>{

 if(e.request.method!=='GET') return;

 // Ignorar extensiones de Chrome y otros protocolos
 if(!e.request.url.startsWith('http')){
  return;
 }

 e.respondWith(
  caches.match(e.request)
  .then(r=>{

   if(r){
    return r;
   }

   return fetch(e.request)
   .then(res=>{

    const clone=res.clone();

    caches.open(CACHE)
    .then(c=>{
      c.put(e.request,clone);
    });

    return res;

   })
   .catch(()=>{
    return caches.match('./index.html');
   });

  })
 );

});
