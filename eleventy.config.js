// Configuración de Eleventy para Círculo Norte.
// No necesitas tocar este archivo para publicar contenido: todo se edita desde /admin.

const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

function porFecha(a, b) {
  return b.date - a.date;
}

function publicados(items) {
  const ahora = new Date();
  return items.filter((i) => !i.data.borrador && i.date <= ahora);
}

export default function (eleventyConfig) {
  // Archivos que se copian tal cual al sitio final
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/admin": "admin" });
  eleventyConfig.ignores.add("src/admin/**");

  // Colecciones: una por sección, ordenadas de la más reciente a la más antigua
  const secciones = ["opinion", "angulo", "encirculo", "territorio", "norte", "autores"];
  for (const s of secciones) {
    eleventyConfig.addCollection(s, (api) =>
      publicados(api.getFilteredByGlob(`src/${s}/*.md`)).sort(porFecha)
    );
  }

  // Todo lo publicado, para el feed RSS
  eleventyConfig.addCollection("todo", (api) =>
    publicados(
      api.getFilteredByGlob(["src/opinion/*.md", "src/angulo/*.md", "src/encirculo/*.md", "src/territorio/*.md"])
    ).sort(porFecha)
  );

  // Fecha legible en español: "30 de septiembre de 2026"
  eleventyConfig.addFilter("fecha", (d) => {
    const f = new Date(d);
    return `${f.getUTCDate()} de ${MESES[f.getUTCMonth()]} de ${f.getUTCFullYear()}`;
  });
  eleventyConfig.addFilter("fechaISO", (d) => new Date(d).toISOString());
  eleventyConfig.addFilter("fechaRSS", (d) => new Date(d).toUTCString());

  // Minutos de lectura aproximados
  eleventyConfig.addFilter("lectura", (contenido) => {
    const palabras = String(contenido || "").replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
    return `${Math.max(1, Math.round(palabras / 220))} min de lectura`;
  });

  // Buscar la ficha de un autor por su identificador
  eleventyConfig.addFilter("autor", (id, autores) => {
    if (!id || !autores) return null;
    return autores.find((a) => a.fileSlug === id) || null;
  });

  eleventyConfig.addFilter("seccionInfo", (id, secciones) => secciones.find((s) => s.id === id) || secciones[0]);

  // Iniciales para el avatar cuando no hay foto
  eleventyConfig.addFilter("iniciales", (nombre) =>
    String(nombre || "CN")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0].toUpperCase())
      .join("")
  );

  // Primeros N elementos, omitiendo uno (para no repetir el destacado)
  eleventyConfig.addFilter("primeros", (arr, n, excluir) =>
    (arr || []).filter((i) => !excluir || i.url !== excluir.url).slice(0, n)
  );

  // Filtrar por un campo del front matter
  eleventyConfig.addFilter("donde", (arr, campo, valor) =>
    (arr || []).filter((i) => i.data[campo] === valor)
  );

  // Convierte un enlace de YouTube en su versión para insertar
  eleventyConfig.addFilter("youtubeEmbed", (url) => {
    if (!url) return "";
    const m = String(url).match(/(?:youtu\.be\/|v=|embed\/|shorts\/|live\/)([A-Za-z0-9_-]{11})/);
    return m ? `https://www.youtube-nocookie.com/embed/${m[1]}` : "";
  });

  // Convierte un enlace de Spotify en su versión para insertar
  eleventyConfig.addFilter("spotifyEmbed", (url) => {
    if (!url) return "";
    const m = String(url).match(/open\.spotify\.com\/(episode|show)\/([A-Za-z0-9]+)/);
    return m ? `https://open.spotify.com/embed/${m[1]}/${m[2]}` : "";
  });

  // Texto seguro para XML (RSS)
  eleventyConfig.addFilter("xml", (s) =>
    String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  );

  eleventyConfig.addFilter("url_absoluta", (ruta, base) => new URL(ruta, base).href);

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    markdownTemplateEngine: false,
    htmlTemplateEngine: "njk",
  };
}
