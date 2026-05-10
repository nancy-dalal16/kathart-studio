"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register plugins once
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ============================================
// FADE ANIMATIONS
// ============================================

/**
 * Fade in element from below
 * @param {HTMLElement|string} target - Element or selector
 * @param {Object} options - Animation options
 */
export const fadeInUp = (target, options = {}) => {
  const defaults = {
    y: 50,
    opacity: 0,
    duration: 1,
    ease: "power2.out",
    delay: 0,
  };
  const config = { ...defaults, ...options };

  return gsap.from(target, {
    y: config.y,
    opacity: config.opacity,
    duration: config.duration,
    ease: config.ease,
    delay: config.delay,
  });
};

/**
 * Fade in element from above
 * @param {HTMLElement|string} target - Element or selector
 * @param {Object} options - Animation options
 */
export const fadeInDown = (target, options = {}) => {
  const defaults = {
    y: -50,
    opacity: 0,
    duration: 1,
    ease: "power2.out",
    delay: 0,
  };
  const config = { ...defaults, ...options };

  return gsap.from(target, {
    y: config.y,
    opacity: config.opacity,
    duration: config.duration,
    ease: config.ease,
    delay: config.delay,
  });
};

/**
 * Fade in element from left
 * @param {HTMLElement|string} target - Element or selector
 * @param {Object} options - Animation options
 */
export const fadeInLeft = (target, options = {}) => {
  const defaults = {
    x: -50,
    opacity: 0,
    duration: 1,
    ease: "power2.out",
    delay: 0,
  };
  const config = { ...defaults, ...options };

  return gsap.from(target, {
    x: config.x,
    opacity: config.opacity,
    duration: config.duration,
    ease: config.ease,
    delay: config.delay,
  });
};

/**
 * Fade in element from right
 * @param {HTMLElement|string} target - Element or selector
 * @param {Object} options - Animation options
 */
export const fadeInRight = (target, options = {}) => {
  const defaults = {
    x: 50,
    opacity: 0,
    duration: 1,
    ease: "power2.out",
    delay: 0,
  };
  const config = { ...defaults, ...options };

  return gsap.from(target, {
    x: config.x,
    opacity: config.opacity,
    duration: config.duration,
    ease: config.ease,
    delay: config.delay,
  });
};

// ============================================
// SCROLL-TRIGGERED ANIMATIONS
// ============================================

/**
 * Animate element on scroll with fade in from below
 * @param {HTMLElement|string} target - Element or selector
 * @param {HTMLElement|string} trigger - Trigger element or selector
 * @param {Object} options - Animation options
 */
export const scrollFadeInUp = (target, trigger, options = {}) => {
  const defaults = {
    y: 40,
    opacity: 0,
    duration: 1,
    ease: "power2.out",
    start: "top 80%",
    once: true,
    stagger: 0,
  };
  const config = { ...defaults, ...options };

  return gsap.from(target, {
    y: config.y,
    opacity: config.opacity,
    duration: config.duration,
    ease: config.ease,
    stagger: config.stagger,
    scrollTrigger: {
      trigger: trigger,
      start: config.start,
      once: config.once,
    },
  });
};

/**
 * Stagger animate multiple elements on scroll
 * @param {HTMLElement[]|string} targets - Elements or selector
 * @param {HTMLElement|string} trigger - Trigger element
 * @param {Object} options - Animation options
 */
export const scrollStagger = (targets, trigger, options = {}) => {
  const defaults = {
    y: 40,
    opacity: 0,
    duration: 1,
    ease: "power2.out",
    stagger: 0.1,
    start: "top 80%",
    once: true,
  };
  const config = { ...defaults, ...options };

  return gsap.from(targets, {
    y: config.y,
    opacity: config.opacity,
    duration: config.duration,
    ease: config.ease,
    stagger: config.stagger,
    scrollTrigger: {
      trigger: trigger,
      start: config.start,
      once: config.once,
    },
  });
};

// ============================================
// PARALLAX EFFECTS
// ============================================

/**
 * Create parallax scrolling effect
 * @param {HTMLElement|string} target - Element to parallax
 * @param {HTMLElement|string} trigger - Trigger element
 * @param {Object} options - Animation options
 */
export const parallax = (target, trigger, options = {}) => {
  const defaults = {
    yPercent: -20,
    ease: "none",
    scrub: 1,
    start: "top top",
    end: "bottom top",
  };
  const config = { ...defaults, ...options };

  return gsap.to(target, {
    yPercent: config.yPercent,
    ease: config.ease,
    scrollTrigger: {
      trigger: trigger,
      start: config.start,
      end: config.end,
      scrub: config.scrub,
    },
  });
};

/**
 * Create horizontal parallax effect
 * @param {HTMLElement|string} target - Element to parallax
 * @param {HTMLElement|string} trigger - Trigger element
 * @param {Object} options - Animation options
 */
export const parallaxX = (target, trigger, options = {}) => {
  const defaults = {
    xPercent: -10,
    ease: "none",
    scrub: 1,
    start: "top bottom",
    end: "bottom top",
  };
  const config = { ...defaults, ...options };

  return gsap.to(target, {
    xPercent: config.xPercent,
    ease: config.ease,
    scrollTrigger: {
      trigger: trigger,
      start: config.start,
      end: config.end,
      scrub: config.scrub,
    },
  });
};

// ============================================
// ENTRANCE ANIMATIONS
// ============================================

/**
 * Create staggered entrance animation for hero sections
 * @param {HTMLElement[]} elements - Array of elements to animate
 * @param {Object} options - Animation options
 */
export const heroEntrance = (elements, options = {}) => {
  const defaults = {
    y: 100,
    opacity: 0,
    duration: 1.2,
    ease: "power3.out",
    stagger: 0.15,
    delay: 0.5,
  };
  const config = { ...defaults, ...options };

  const tl = gsap.timeline({ delay: config.delay });

  tl.fromTo(
    elements,
    { y: config.y, opacity: config.opacity },
    {
      y: 0,
      opacity: 1,
      duration: config.duration,
      ease: config.ease,
      stagger: config.stagger,
    }
  );

  return tl;
};

/**
 * Scale and fade in animation
 * @param {HTMLElement|string} target - Element or selector
 * @param {Object} options - Animation options
 */
export const scaleIn = (target, options = {}) => {
  const defaults = {
    scale: 0.8,
    opacity: 0,
    duration: 0.8,
    ease: "back.out(1.7)",
    delay: 0,
  };
  const config = { ...defaults, ...options };

  return gsap.from(target, {
    scale: config.scale,
    opacity: config.opacity,
    duration: config.duration,
    ease: config.ease,
    delay: config.delay,
  });
};

// ============================================
// HOVER EFFECTS
// ============================================

/**
 * Apply 3D tilt effect to element on mouse move
 * @param {HTMLElement} element - Element to apply tilt to
 * @param {Object} options - Tilt options
 */
export const applyTilt = (element, options = {}) => {
  const defaults = {
    maxTilt: 15,
    perspective: 1000,
    duration: 0.3,
    ease: "power2.out",
  };
  const config = { ...defaults, ...options };

  const handleMouseMove = (e) => {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    const rotateY = (mouseX / (rect.width / 2)) * config.maxTilt;
    const rotateX = -(mouseY / (rect.height / 2)) * config.maxTilt;

    gsap.to(element, {
      rotateX,
      rotateY,
      transformPerspective: config.perspective,
      duration: config.duration,
      ease: config.ease,
    });
  };

  const handleMouseLeave = () => {
    gsap.to(element, {
      rotateX: 0,
      rotateY: 0,
      duration: config.duration,
      ease: config.ease,
    });
  };

  element.addEventListener("mousemove", handleMouseMove);
  element.addEventListener("mouseleave", handleMouseLeave);

  // Return cleanup function
  return () => {
    element.removeEventListener("mousemove", handleMouseMove);
    element.removeEventListener("mouseleave", handleMouseLeave);
  };
};

/**
 * Magnetic hover effect - element follows cursor
 * @param {HTMLElement} element - Element to apply effect to
 * @param {Object} options - Effect options
 */
export const magneticHover = (element, options = {}) => {
  const defaults = {
    strength: 0.3,
    duration: 0.3,
    ease: "power2.out",
  };
  const config = { ...defaults, ...options };

  const handleMouseMove = (e) => {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) * config.strength;
    const deltaY = (e.clientY - centerY) * config.strength;

    gsap.to(element, {
      x: deltaX,
      y: deltaY,
      duration: config.duration,
      ease: config.ease,
    });
  };

  const handleMouseLeave = () => {
    gsap.to(element, {
      x: 0,
      y: 0,
      duration: config.duration,
      ease: config.ease,
    });
  };

  element.addEventListener("mousemove", handleMouseMove);
  element.addEventListener("mouseleave", handleMouseLeave);

  // Return cleanup function
  return () => {
    element.removeEventListener("mousemove", handleMouseMove);
    element.removeEventListener("mouseleave", handleMouseLeave);
  };
};

// ============================================
// TEXT ANIMATIONS
// ============================================

/**
 * Split text into characters and animate
 * @param {HTMLElement} element - Text element
 * @param {Object} options - Animation options
 */
export const textReveal = (element, options = {}) => {
  const defaults = {
    y: 100,
    opacity: 0,
    duration: 0.8,
    ease: "power3.out",
    stagger: 0.02,
    delay: 0,
  };
  const config = { ...defaults, ...options };

  // Store original text
  const text = element.textContent;
  element.innerHTML = "";

  // Create span for each character
  const chars = text.split("").map((char) => {
    const span = document.createElement("span");
    span.textContent = char === " " ? "\u00A0" : char;
    span.style.display = "inline-block";
    element.appendChild(span);
    return span;
  });

  return gsap.from(chars, {
    y: config.y,
    opacity: config.opacity,
    duration: config.duration,
    ease: config.ease,
    stagger: config.stagger,
    delay: config.delay,
  });
};

/**
 * Typewriter effect
 * @param {HTMLElement} element - Text element
 * @param {string} text - Text to type
 * @param {Object} options - Animation options
 */
export const typewriter = (element, text, options = {}) => {
  const defaults = {
    duration: 2,
    ease: "none",
    delay: 0,
  };
  const config = { ...defaults, ...options };

  element.textContent = "";

  return gsap.to(element, {
    duration: config.duration,
    delay: config.delay,
    ease: config.ease,
    onUpdate: function () {
      const progress = this.progress();
      const charCount = Math.floor(text.length * progress);
      element.textContent = text.slice(0, charCount);
    },
  });
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Kill all ScrollTriggers attached to a specific element
 * @param {HTMLElement} element - Element whose triggers to kill
 */
export const killScrollTriggers = (element) => {
  ScrollTrigger.getAll().forEach((trigger) => {
    if (trigger.trigger === element) {
      trigger.kill();
    }
  });
};

/**
 * Kill all ScrollTriggers
 */
export const killAllScrollTriggers = () => {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
};

/**
 * Refresh all ScrollTriggers (useful after layout changes)
 */
export const refreshScrollTriggers = () => {
  ScrollTrigger.refresh();
};

/**
 * Create a GSAP timeline with default settings
 * @param {Object} options - Timeline options
 */
export const createTimeline = (options = {}) => {
  const defaults = {
    paused: false,
    delay: 0,
  };
  const config = { ...defaults, ...options };

  return gsap.timeline(config);
};

// ============================================
// REACT HOOKS HELPERS
// ============================================

/**
 * Safe animation setup for React useEffect
 * Returns an object with animation and cleanup
 * @param {Function} animationFn - Function that returns GSAP animation
 */
export const createSafeAnimation = (animationFn) => {
  let animation = null;

  return {
    play: () => {
      animation = animationFn();
      return animation;
    },
    cleanup: () => {
      if (animation) {
        animation.kill();
      }
      killAllScrollTriggers();
    },
  };
};

// Export GSAP and ScrollTrigger for direct use
export { gsap, ScrollTrigger };
