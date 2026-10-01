# Círculo Norte — guía para poner el sitio en línea

Esta carpeta contiene el sitio completo de **Círculo Norte**: la portada, las cinco secciones (Opinión, Ángulo, En Círculo, Territorio y Norte), las páginas de cada columna, las fichas de columnistas y un editor en `/admin` para publicar sin tocar código.

Todo es gratuito, salvo el dominio `.cl`.

---

## Cómo funciona (en una frase)

Escribes en el editor → el texto se guarda en GitHub → Cloudflare reconstruye el sitio solo → en uno o dos minutos está publicado en circulonorte.cl.

---

## Paso 1 · Crear la organización en GitHub

1. Entra a github.com con tu cuenta.
2. Arriba a la derecha: **+ → New organization → Free**.
3. Nombre sugerido: `circulonorte`.

## Paso 2 · Subir el sitio a GitHub

1. Dentro de la organización: **New repository**.
   - Nombre: `circulonorte`
   - Visibilidad: **Public** o **Private**; ambos funcionan.
   - No marques "Add a README".
2. En el repositorio vacío, haz clic en **"uploading an existing file"**.
3. Descomprime el .zip en tu computador. Luego arrastra **todo el contenido de la carpeta**, no la carpeta misma, a la ventana de GitHub: `src`, `package.json`, `eleventy.config.js`, `LEEME.md`, etc.
4. Abajo, **Commit changes**.

> Si tu computador oculta los archivos que empiezan con punto (`.gitignore`, `.nvmrc`), no importa. El sitio funciona igual.

## Paso 3 · Publicar con Cloudflare Pages

1. En dash.cloudflare.com: **Workers & Pages → Create**.
2. Elige la opción de **Pages**. Si la pantalla te ofrece crear un "Worker", busca el enlace para desplegar con Pages.
3. **Connect to Git** → autoriza GitHub → elige el repositorio `circulonorte/circulonorte`.
4. Configuración de compilación:
   | Campo | Valor |
   |---|---|
   | Framework preset | None |
   | Build command | `npm run build` |
   | Build output directory | `_site` |
5. **Save and Deploy**.

En uno o dos minutos tendrás el sitio funcionando en una dirección provisoria del tipo `circulonorte.pages.dev`.

## Paso 4 · Activar el inicio de sesión del editor

El editor necesita un pequeño programa (un *Worker*) que permite entrar con la cuenta de GitHub. Es gratuito y se instala una sola vez.

**4a. Instalar el Worker**
1. Abre github.com/sveltia/sveltia-cms-auth.
2. Presiona el botón **Deploy to Cloudflare Workers** y sigue los pasos con tu cuenta de Cloudflare.
3. Al terminar, anota la dirección del Worker. Tiene esta forma: `https://sveltia-cms-auth.TU-SUBDOMINIO.workers.dev`.

**4b. Registrar la aplicación en GitHub**
1. En GitHub, entra a la organización: **Settings → Developer settings → OAuth Apps → New OAuth App**.
2. Completa:
   - Application name: `Editor Círculo Norte`
   - Homepage URL: `https://circulonorte.cl`
   - Authorization callback URL: la dirección de tu Worker + `/callback`. Ejemplo: `https://sveltia-cms-auth.TU-SUBDOMINIO.workers.dev/callback`
3. Crea la app y luego **Generate a new client secret**. Copia el **Client ID** y el **Client secret**.

**4c. Conectar el Worker con GitHub**
1. En Cloudflare: **Workers & Pages → sveltia-cms-auth → Settings → Variables and Secrets**.
2. Agrega estas variables:
   - `GITHUB_CLIENT_ID` → el Client ID.
   - `GITHUB_CLIENT_SECRET` → el Client secret. Márcalo como *Secret/Encrypt*.
   - `ALLOWED_DOMAINS` → `circulonorte.cl, circulonorte.pages.dev` (usa la dirección `.pages.dev` que te dio el paso 3).
3. Guarda y despliega.

## Paso 5 · Decirle al editor dónde está todo

En GitHub, abre el archivo `src/admin/config.yml` y presiona el lápiz para editarlo. Cambia las dos líneas marcadas con ⚠️:

```yaml
  repo: circulonorte/circulonorte                                  # tu organización/repositorio
  base_url: https://sveltia-cms-auth.TU-SUBDOMINIO.workers.dev     # la dirección del Worker
```

Guarda con **Commit changes**. Cloudflare volverá a publicar solo.

Prueba entrando a `https://circulonorte.pages.dev/admin` → **Sign in with GitHub**.

## Paso 6 · Conectar el dominio circulonorte.cl

Cuando tengas el dominio comprado en NIC Chile:

1. En Cloudflare: **Add a domain** → escribe `circulonorte.cl` → plan **Free**.
2. Cloudflare te mostrará **dos servidores DNS**, algo como `ana.ns.cloudflare.com` y `bob.ns.cloudflare.com`.
3. En nic.cl, entra a tu dominio y reemplaza los servidores DNS por esos dos. El cambio puede tardar desde minutos hasta algunas horas.
4. En Cloudflare: **Workers & Pages → circulonorte → Custom domains → Set up a custom domain** → agrega `circulonorte.cl` y luego `www.circulonorte.cl`.

**Opcional: correo del medio.** En Cloudflare → tu dominio → **Email → Email Routing**, crea `contacto@circulonorte.cl` para que reenvíe a tu correo personal.

---

## Publicar día a día

Entra a **circulonorte.cl/admin** y elige la sección:

| Sección del editor | Qué es | Dónde aparece |
|---|---|---|
| **Opinión** | Columnas escritas | Columna lateral de la portada y /opinion |
| **Ángulo** | Editoriales en video: pega el enlace de YouTube | Bloque verde de la portada |
| **En Círculo** | Episodios del podcast: pega el enlace de Spotify o YouTube | Lista de episodios |
| **Territorio** | Notas y reportajes, con provincia | Portada y /territorio; los marcados como "Destacar" van arriba en grande |
| **Norte** | Breves de actualidad (titular + comuna) | Franja verde bajo la portada |
| **Columnistas** | Ficha de cada autor/a: nombre, foto, bio | Firma de cada columna |
| **Configuración** | Redes sociales, correo, enlace del boletín | Todo el sitio |

Algunas cosas útiles:
- **Borrador:** marca esa casilla si quieres guardar algo sin publicarlo todavía.
- **Fecha futura:** una entrada con fecha futura no se muestra hasta esa fecha, pero solo aparece cuando el sitio se vuelve a publicar ese día o después.
- **Imágenes:** súbelas desde el mismo editor. Lo ideal es un ancho de 1.600 px como máximo.
- **Sin imagen:** si una nota no tiene imagen, el sitio muestra los cerros del semiárido.

## Sumar columnistas o editores

1. Cada persona crea su cuenta gratuita en github.com.
2. Tú la invitas: **organización → People → Invite member**.
3. Le das permiso de escritura en el repositorio: **repositorio → Settings → Collaborators and teams → Add people → Write**.
4. Desde ese momento puede entrar a /admin con su cuenta.

## Antes del lanzamiento

- Borra las entradas de ejemplo. Son las que dicen "Texto de ejemplo" y las breves de Norte entre [corchetes].
- Revisa **Configuración** y completa redes sociales, correo y boletín.
- Crea la ficha de cada columnista en **Columnistas**.

## Límites del plan gratuito

Cloudflare Pages permite hasta **500 publicaciones al mes** en el plan gratuito, sin límite de visitas. Cada vez que guardas algo en el editor cuenta como una publicación. Es suficiente para un medio con varias publicaciones diarias.

---

## Para quien quiera tocar el diseño (opcional)

- Colores y tipografías: `src/assets/css/estilos.css`. Los colores de marca están al inicio del archivo.
- Portada: `src/index.njk`.
- Cerros y logotipo: `src/_includes/partes/macros.njk`.
- Para ver el sitio en tu computador: instala Node.js y luego ejecuta `npm install` y `npm run dev`.
