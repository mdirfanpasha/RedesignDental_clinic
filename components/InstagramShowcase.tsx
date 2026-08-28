import React from 'react';

export interface InstagramPost {
  id: string;
  image: string;
  alt: string;
  url: string;
}

export const instagramPosts: InstagramPost[] = [
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

export const InstagramShowcase: React.FC = () => {
  return (
    <section className="section_instagram" id="instagram-showcase">
      <div className="section-padding padding-100x100">
        <div className="container">
          {/* Section Header */}
          <div className="instagram_header">
            <div className="section_tag">
              <div className="icon_wrap is-small">
                <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 12 12" fill="none" vectorEffect="non-scaling-stroke">
                  <path d="M6 0C6.4 3.2 8.8 5.6 12 6C8.8 6.4 6.4 8.8 6 12C5.6 8.8 3.2 6.4 0 6C3.2 5.6 5.6 3.2 6 0Z" fill="currentColor" />
                </svg>
              </div>
              <div data-i18n="instagram.badge">✦ INSTAGRAM</div>
            </div>
            <h2 className="heading-style-h2" data-i18n="instagram.heading">
              Follow Redesign Dental Clinics
            </h2>
            <p className="instagram_description" data-i18n="instagram.description">
              Stay connected with Redesign Dental Clinics for our latest smiles, clinic moments, dental care updates and more.
            </p>
            <div className="instagram_cta-wrap">
              <a
                href="https://www.instagram.com/redesign.dental.clinics/"
                target="_blank"
                rel="noopener noreferrer"
                className="instagram_follow-btn"
                aria-label="Follow Redesign Dental Clinics on Instagram"
              >
                <span className="instagram_btn-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </span>
                <span className="instagram_btn-handle">@redesign.dental.clinics</span>
                <span className="instagram_btn-sep">•</span>
                <span data-i18n="instagram.followBtn">Follow Us on Instagram</span>
              </a>
            </div>
          </div>

          {/* 3x2 Desktop / 2x3 Mobile Instagram Grid */}
          <div className="instagram-posts_grid" id="instagram-posts-grid">
            {instagramPosts.map((post) => (
              <a
                key={post.id}
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="instagram-post_card"
                aria-label={post.alt}
              >
                <div className="instagram-post_media">
                  <img src={post.image} alt={post.alt} loading="lazy" className="instagram-post_img" />
                  <div className="instagram-post_overlay">
                    <div className="instagram-post_icon-wrap">
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                      </svg>
                    </div>
                    <span className="instagram-post_handle">@redesign.dental.clinics</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default InstagramShowcase;
