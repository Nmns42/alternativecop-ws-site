/* COP Alternativa : configuration du site.
   Seul fichier à modifier pour changer le contact, l'hébergeur ou l'éditeur.
   Les valeurs sont injectées dans les pages (attribut data-config="clé"). */
window.SITE_CONFIG = {
  email: "copwesternsahara@gmail.com",
  phone: "+33 6 51 48 18 65",
  instagram: "cop_ws",
  instagramUrl: "https://www.instagram.com/cop_ws/",

  /* Date de l'événement (heure d'Algérie, UTC+1) */
  eventStart: "2027-02-01T00:00:00+01:00",
  eventEnd: "2027-02-06T00:00:00+01:00",

  /* Hébergeur affiché dans les mentions légales.
     Profils prêts à l'emploi : "github", "cloudflare", "codeberg". */
  host: "github",
  hosts: {
    github: {
      name: "GitHub Pages (GitHub, Inc.)",
      address: "88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, USA",
      url: "https://pages.github.com/"
    },
    cloudflare: {
      name: "Cloudflare Pages (Cloudflare, Inc.)",
      address: "101 Townsend Street, San Francisco, CA 94107, USA",
      url: "https://pages.cloudflare.com/"
    },
    codeberg: {
      name: "Codeberg Pages (Codeberg e.V.)",
      address: "Arminiusstraße 2-4, 10551 Berlin, Deutschland",
      url: "https://codeberg.page/"
    }
  },

  /* Date de dernière mise à jour des mentions légales (AAAA-MM-JJ) */
  legalUpdated: "2026-11-26"
};
