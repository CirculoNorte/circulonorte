export default {
  layout: "layouts/articulo.njk",
  seccion: "opinion",
  permalink: (data) => `/opinion/${data.page.fileSlug}/`,
};
