/**
 * instagram-data.js
 * Centralized static configuration for Redesign Dental Clinics Instagram showcase.
 * 
 * Future updates:
 *   1. Drop new image into assets/img/instagram/ (e.g. post-07.jpg)
 *   2. Add/update the entry in the instagramPosts array below.
 *   The grid automatically renders all entries in this array.
 */
const instagramPosts = [
  {
    id: "instagram-01",
    image: "assets/img/instagram/post-01.jpg",
    alt: "Redesign Dental Clinics Instagram post - Patient smile transformation",
    url: "https://www.instagram.com/redesign.dental.clinics/"
  },
  {
    id: "instagram-02",
    image: "assets/img/instagram/post-02.jpg",
    alt: "Redesign Dental Clinics Instagram post - Clinical excellence & care",
    url: "https://www.instagram.com/redesign.dental.clinics/"
  },
  {
    id: "instagram-03",
    image: "assets/img/instagram/post-03.jpg",
    alt: "Redesign Dental Clinics Instagram post - Modern facility in Banjara Hills",
    url: "https://www.instagram.com/redesign.dental.clinics/"
  },
  {
    id: "instagram-04",
    image: "assets/img/instagram/post-04.jpg",
    alt: "Redesign Dental Clinics Instagram post - Precision dental treatment",
    url: "https://www.instagram.com/redesign.dental.clinics/"
  },
  {
    id: "instagram-05",
    image: "assets/img/instagram/post-05.jpg",
    alt: "Redesign Dental Clinics Instagram post - Specialist dental consultation",
    url: "https://www.instagram.com/redesign.dental.clinics/"
  },
  {
    id: "instagram-06",
    image: "assets/img/instagram/post-06.jpg",
    alt: "Redesign Dental Clinics Instagram post - Restoring healthy confident smiles",
    url: "https://www.instagram.com/redesign.dental.clinics/"
  }
];

if (typeof window !== 'undefined') {
  window.instagramPosts = instagramPosts;

  // Render or hydrate Instagram showcase grid dynamically from centralized data
  document.addEventListener('DOMContentLoaded', function () {
    var gridContainer = document.getElementById('instagram-posts-grid');
    if (!gridContainer) return;

    // Render cards from data array
    gridContainer.innerHTML = instagramPosts.map(function (post) {
      return (
        '<a href="' + post.url + '" target="_blank" rel="noopener noreferrer" class="instagram-post_card" aria-label="' + post.alt + '">' +
          '<div class="instagram-post_media">' +
            '<img src="' + post.image + '" alt="' + post.alt + '" loading="lazy" class="instagram-post_img" />' +
            '<div class="instagram-post_overlay">' +
              '<div class="instagram-post_icon-wrap">' +
                '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
                  '<rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>' +
                  '<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>' +
                  '<line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>' +
                '</svg>' +
              '</div>' +
              '<span class="instagram-post_handle">@redesign.dental.clinics</span>' +
            '</div>' +
          '</div>' +
        '</a>'
      );
    }).join('');
  });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = instagramPosts;
}
