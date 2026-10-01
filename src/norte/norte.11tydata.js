export default {
  layout: "layouts/articulo.njk",
  seccion: "norte",
  permalink: (data) => `/norte/${data.page.fileSlug}/`,
};
