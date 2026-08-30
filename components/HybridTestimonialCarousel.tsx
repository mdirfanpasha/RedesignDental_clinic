import React, { useState, useRef, useEffect } from 'react';

export interface TestimonialItem {
  id: string;
  type: 'video' | 'text';
  author: string;
  designation: string;
  quote: string;
  video?: string;
  logo?: string;
}

interface HybridTestimonialCarouselProps {
  testimonials?: TestimonialItem[];
}

export const HybridTestimonialCarousel: React.FC<HybridTestimonialCarouselProps> = ({
  testimonials = [
    {
      id: 'testimonial-1',
      type: 'video',
      author: 'Syed Mohammed',
      designation: 'Practo Patient Story',
      quote: 'Dr Suhail is very professional and patient. He explained the root canal procedure clearly before starting and made sure I felt no pain throughout the treatment. I am extremely satisfied with the care provided.',
      video: 'assets/video/t1.mp4',
      logo: 'assets/img/redesign-dental-clinics-logo.png'
    },
    {
      id: 'testimonial-2',
      type: 'video',
      author: 'Verified Patient',
      designation: 'Practo Patient Story',
      quote: 'I had a tooth extraction done by Dr Suhail. I was very anxious before the procedure, but Dr Suhail and the staff were very reassuring and gentle. The entire extraction process was smooth and comfortable.',
      video: 'assets/video/t2.mp4',
      logo: 'assets/img/redesign-dental-clinics-logo.png'
    },
    {
      id: 'testimonial-3',
      type: 'video',
      author: 'Ali',
      designation: 'Practo Patient Story',
      quote: 'Very friendly, soft spoken and professional team at Redesign Dental Clinics. The clinic is clean and well maintained with modern equipment. Highly recommend for any dental treatment.',
      video: 'assets/video/t3.mp4',
      logo: 'assets/img/redesign-dental-clinics-logo.png'
    },
    {
      id: 'testimonial-4',
      type: 'video',
      author: 'Rahul',
      designation: 'Practo Patient Story',
      quote: 'Dr Suhail took time to explain my dental condition and treatment options clearly. He was considerate and professional during the implant procedure. Excellent doctor and clinic.',
      video: 'assets/video/t4.mp4',
      logo: 'assets/img/redesign-dental-clinics-logo.png'
    },
    {
      id: 'testimonial-5',
      type: 'text',
      author: 'Verified Patient',
      designation: 'Practo Patient Story',
      quote: 'Clean, well maintained and hygienic clinic in Banjara Hills. Dr Suhail is soft spoken and gives honest advice without unnecessary procedures. Very good dental experience.',
      logo: 'assets/img/redesign-dental-clinics-logo.png'
    },
    {
      id: 'testimonial-6',
      type: 'text',
      author: 'Umar Khan',
      designation: 'Justdial Review',
      quote: 'Brought my son for dental treatment here. Everything was done smoothly and perfectly by Dr Suhail and his team. Very caring doctors and friendly staff.',
      logo: 'assets/img/redesign-dental-clinics-logo.png'
    },
    {
      id: 'testimonial-7',
      type: 'text',
      author: 'Shy',
      designation: 'Justdial Review',
      quote: 'Reasonable treatment costs and high quality modern dental facilities. The doctors and staff are soft spoken and professional. Very happy with the service.',
      logo: 'assets/img/redesign-dental-clinics-logo.png'
    },
    {
      id: 'testimonial-8',
      type: 'text',
      author: 'Verified Patient',
      designation: 'Google Review',
      quote: 'I was nervous about my dental checkup, but the doctor made me feel completely comfortable and explained every step of the treatment clearly. Great experience at Redesign Dental Clinics.',
      logo: 'assets/img/redesign-dental-clinics-logo.png'
    },
    {
      id: 'testimonial-9',
      type: 'text',
      author: 'Verified Patient',
      designation: 'Google Review',
      quote: 'Exceptional patient care and state of the art equipment. Dr Suhail and his team provide comfortable and gentle dental care in Banjara Hills.',
      logo: 'assets/img/redesign-dental-clinics-logo.png'
    },
    {
      id: 'testimonial-10',
      type: 'text',
      author: 'Verified Patient',
      designation: 'Google Review',
      quote: 'Highly recommend Redesign Dental Clinics for professional dental care in Banjara Hills. Friendly staff, welcoming environment, and excellent doctor.',
      logo: 'assets/img/redesign-dental-clinics-logo.png'
    }
  ]
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [mutedStates, setMutedStates] = useState<Record<string, boolean>>({});
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  const handleFlip = (id: string) => {
    setFlippedCards(prev => {
      const next = { ...prev, [id]: !prev[id] };
      if (!prev[id]) {
        // Flipping to video
        const vid = videoRefs.current[id];
        if (vid) {
          vid.muted = true;
          vid.currentTime = 0;
          vid.play().catch(() => {});
        }
      } else {
        // Flipping back
        const vid = videoRefs.current[id];
        if (vid) {
          vid.pause();
          vid.currentTime = 0;
        }
      }
      return next;
    });
  };

  const handleSlideChange = (newIndex: number) => {
    // Pause all playing videos
    Object.values(videoRefs.current).forEach(v => {
      if (v) {
        v.pause();
        v.muted = true;
        v.currentTime = 0;
      }
    });
    setFlippedCards({});
    setCurrentIndex(newIndex);
  };

  return (
    <div className="hybrid-testimonial_slider">
      <div className="hybrid-testimonial_viewport">
        <div 
          className="hybrid-testimonial_track"
          style={{ transform: `translateX(-${currentIndex * 33.33}%)` }}
        >
          {testimonials.map((item, idx) => {
            const isFlipped = !!flippedCards[item.id];
            const isVideo = item.type === 'video' && item.video;

            return (
              <div 
                key={item.id} 
                className="hybrid-testimonial_slide"
                tabIndex={0}
                role="region"
                aria-label={`Testimonial ${idx + 1} of ${testimonials.length}: ${item.author}`}
              >
                <div className={`hybrid-card_inner ${isVideo ? 'is-flip-enabled' : ''} ${isFlipped ? 'is-flipped' : ''}`}>
                  {/* Front Side */}
                  <div 
                    className="hybrid-card_front"
                    onClick={() => isVideo && handleFlip(item.id)}
                    style={{ cursor: isVideo ? 'pointer' : 'default' }}
                  >
                    <div className="hybrid-card_author-wrap">
                      <div className="hybrid-card_author-info">
                        <h3 className="hybrid-card_author-name">{item.author}</h3>
                        <div className="hybrid-card_author-source">{item.designation}</div>
                      </div>
                    </div>
                    <div className="hybrid-card_stars" aria-label="5 stars rating">
                      ★★★★★
                    </div>
                    <div className="hybrid-card_quote-wrap">
                      <p className="hybrid-card_quote">“{item.quote}”</p>
                    </div>
                    <div className="hybrid-card_cue-badge">
                      {isVideo ? (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M10 8.64L15.27 12 10 15.36V8.64M8 5v14l11-7L8 5z"/>
                          </svg>
                          <span>Tap or Hover (3s) to Watch Video</span>
                          <div className="hover-timer-bar"></div>
                        </>
                      ) : (
                        <span>✦ Verified Patient Review</span>
                      )}
                    </div>
                  </div>

                  {/* Back Side (Video) */}
                  {isVideo && (
                    <div className="hybrid-card_back">
                      <div className="hybrid-card_back-topbar">
                        <span className="hybrid-card_back-badge">✦ Patient Story</span>
                        <button 
                          type="button" 
                          className="card-flip-close-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFlip(item.id);
                          }}
                        >
                          ✕ Back
                        </button>
                      </div>
                      <div className="hybrid-card_video-container">
                        <video
                          ref={el => { videoRefs.current[item.id] = el; }}
                          className="hybrid-card_video"
                          src={item.video}
                          playsInline
                          muted
                          preload="metadata"
                          loop
                        />
                      </div>
                      <div className="hybrid-card_back-controls">
                        <button 
                          type="button" 
                          className="video-ctrl-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            const v = videoRefs.current[item.id];
                            if (v) {
                              if (v.paused) v.play();
                              else v.pause();
                            }
                          }}
                        >
                          Play/Pause
                        </button>
                        <button 
                          type="button" 
                          className={`video-ctrl-btn ${!mutedStates[item.id] ? 'is-unmuted' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            const v = videoRefs.current[item.id];
                            if (v) {
                              v.muted = !v.muted;
                              setMutedStates(prev => ({ ...prev, [item.id]: v.muted }));
                            }
                          }}
                        >
                          {mutedStates[item.id] ? 'Unmute' : 'Mute'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="hybrid-testimonial_controls">
        <button 
          type="button" 
          className="hybrid-testimonial_arrow prev" 
          aria-label="Previous"
          onClick={() => handleSlideChange(Math.max(0, currentIndex - 1))}
        >
          ‹
        </button>
        <div className="hybrid-testimonial_dots">
          {testimonials.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`hybrid-testimonial_dot ${i === currentIndex ? 'active' : ''}`}
              onClick={() => handleSlideChange(i)}
            />
          ))}
        </div>
        <button 
          type="button" 
          className="hybrid-testimonial_arrow next" 
          aria-label="Next"
          onClick={() => handleSlideChange(Math.min(testimonials.length - 3, currentIndex + 1))}
        >
          ›
        </button>
      </div>
    </div>
  );
};
