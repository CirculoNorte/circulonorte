export default {
  layout: "layouts/articulo.njk",
  seccion: "territorio",
  permalink: (data) => `/territorio/${data.page.fileSlug}/`,
};
