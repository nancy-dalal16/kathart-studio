"use client";

import { useEffect, useRef, useCallback } from "react";
import {
  gsap,
  ScrollTrigger,
  fadeInUp,
  fadeInDown,
  fadeInLeft,
  fadeInRight,
  scrollFadeInUp,
  scrollStagger,
  parallax,
  scaleIn,
  applyTilt,
  magneticHover,
  killAllScrollTriggers,
} from "./index";

/**
 * Hook for scroll-triggered fade in animation
 * @param {Object} options - Animation options
 * @returns {React.RefObject} - Ref to attach to element
 */
export const useScrollFadeIn = (options = {}) => {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const defaults = {
      y: 40,
      opacity: 0,
      duration: 1,
      ease: "power2.out",
      start: "top 80%",
      once: true,
    };
    const config = { ...defaults, ...options };

    const animation = gsap.from(element, {
      y: config.y,
      opacity: config.opacity,
      duration: config.duration,
      ease: config.ease,
      scrollTrigger: {
        trigger: element,
        start: config.start,
        once: config.once,
      },
    });

    return () => {
      animation.kill();
      ScrollTrigger.getAll()
        .filter((t) => t.trigger === element)
        .forEach((t) => t.kill());
    };
  }, [options]);

  return ref;
};

/**
 * Hook for staggered children animation on scroll
 * @param {string} childSelector - CSS selector for children
 * @param {Object} options - Animation options
 * @returns {React.RefObject} - Ref to attach to parent element
 */
export const useScrollStagger = (childSelector = "> *", options = {}) => {
  const ref = useRef(null);

  useEffect(() => {
    const parent = ref.current;
    if (!parent) return;

    const children = parent.querySelectorAll(childSelector);
    if (children.length === 0) return;

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

    const animation = gsap.from(children, {
      y: config.y,
      opacity: config.opacity,
      duration: config.duration,
      ease: config.ease,
      stagger: config.stagger,
      scrollTrigger: {
        trigger: parent,
        start: config.start,
        once: config.once,
      },
    });

    return () => {
      animation.kill();
      ScrollTrigger.getAll()
        .filter((t) => t.trigger === parent)
        .forEach((t) => t.kill());
    };
  }, [childSelector, options]);

  return ref;
};

/**
 * Hook for parallax effect on scroll
 * @param {Object} options - Parallax options
 * @returns {React.RefObject} - Ref to attach to element
 */
export const useParallax = (options = {}) => {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const defaults = {
      yPercent: -20,
      ease: "none",
      scrub: 1,
      start: "top bottom",
      end: "bottom top",
    };
    const config = { ...defaults, ...options };

    const animation = gsap.to(element, {
      yPercent: config.yPercent,
      ease: config.ease,
      scrollTrigger: {
        trigger: element,
        start: config.start,
        end: config.end,
        scrub: config.scrub,
      },
    });

    return () => {
      animation.kill();
      ScrollTrigger.getAll()
        .filter((t) => t.trigger === element)
        .forEach((t) => t.kill());
    };
  }, [options]);

  return ref;
};

/**
 * Hook for 3D tilt effect on hover
 * @param {Object} options - Tilt options
 * @returns {React.RefObject} - Ref to attach to element
 */
export const useTilt = (options = {}) => {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const cleanup = applyTilt(element, options);
    return cleanup;
  }, [options]);

  return ref;
};

/**
 * Hook for magnetic hover effect
 * @param {Object} options - Effect options
 * @returns {React.RefObject} - Ref to attach to element
 */
export const useMagnetic = (options = {}) => {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const cleanup = magneticHover(element, options);
    return cleanup;
  }, [options]);

  return ref;
};

/**
 * Hook for entrance animation on mount
 * @param {Object} options - Animation options
 * @returns {React.RefObject} - Ref to attach to element
 */
export const useEntranceAnimation = (options = {}) => {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const defaults = {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      delay: 0.2,
    };
    const config = { ...defaults, ...options };

    const animation = gsap.from(element, {
      y: config.y,
      opacity: config.opacity,
      duration: config.duration,
      ease: config.ease,
      delay: config.delay,
    });

    return () => {
      animation.kill();
    };
  }, [options]);

  return ref;
};

/**
 * Hook for timeline-based animations
 * @param {Function} timelineBuilder - Function that receives timeline and refs
 * @param {Array} deps - Dependencies array
 * @returns {Object} - Object with refs
 */
export const useTimeline = (timelineBuilder, deps = []) => {
  const refs = useRef({});
  const timelineRef = useRef(null);
  const setRef = useCallback((name) => (el) => {
    refs.current[name] = el;
  }, []);

  useEffect(() => {
    timelineRef.current = gsap.timeline();

    if (timelineBuilder) {
      timelineBuilder(timelineRef.current, refs.current);
    }

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
      killAllScrollTriggers();
    };
  }, deps);

  return { setRef, refs, timeline: timelineRef };
};

/**
 * Hook for managing GSAP context (auto cleanup)
 * @param {Function} callback - Animation setup callback
 * @param {Array} deps - Dependencies array
 * @returns {React.RefObject} - Ref for scope
 */
export const useGSAP = (callback, deps = []) => {
  const scopeRef = useRef(null);

  useEffect(() => {
    if (!scopeRef.current) return;

    const ctx = gsap.context(() => {
      callback(gsap, ScrollTrigger);
    }, scopeRef);

    return () => {
      ctx.revert();
    };
  }, [callback, ...deps]);

  return scopeRef;
};

// Export direct utilities for advanced use cases
export {
  gsap,
  ScrollTrigger,
  fadeInUp,
  fadeInDown,
  fadeInLeft,
  fadeInRight,
  scrollFadeInUp,
  scrollStagger,
  parallax,
  scaleIn,
  applyTilt,
  magneticHover,
  killAllScrollTriggers,
};
