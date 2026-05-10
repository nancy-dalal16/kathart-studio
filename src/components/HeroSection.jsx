"use client";
import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CircleArrowRight } from "lucide-react";
import Image from "next/image";
import Button from "./ui/button";
import styles from "./HeroSection.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ limitCallbacks: true, ignoreMobileResize: true });
}

export default function HeroSection() {
  // Master pin container
  const masterRef = useRef(null);

  // Scene 1 — Hero
  const scene1Ref = useRef(null);
  const yourBrandRef = useRef(null);
  const maskElevatedRef = useRef(null);
  const whiteFlashRef = useRef(null);
  const scrollCueRef = useRef(null);

  // Scene 2 — We Are
  const aboutSceneRef = useRef(null);

  // ── Scroll-driven pin + transition ───────────────────────
  useLayoutEffect(() => {
    if (!masterRef.current) return;

    const scene1El = scene1Ref.current;
    const aboutSceneEl = aboutSceneRef.current;
    const whiteFlashEl = whiteFlashRef.current;
    const scrollCueEl = scrollCueRef.current;
    const yourBrandEl = yourBrandRef.current;
    const maskElevatedEl = maskElevatedRef.current;

    const ctx = gsap.context(() => {
      const totalScroll = 5500;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: masterRef.current,
          start: "top top",
          end: `+=${totalScroll}`,
          pin: true,
          anticipatePin: 1,
          scrub: 1.5,
        },
      });

      // ── ACT 1: Hero departs ──────────────────────────────
      tl.to(scrollCueEl, { opacity: 0, duration: 0.1 }, 0)
        .to(yourBrandEl, { opacity: 0, y: -50, duration: 0.07 }, 0)
        .to(
          maskElevatedEl,
          {
            scale: 30,
            opacity: 0,
            duration: 0.25,
            transformOrigin: "53% 53%",
          },
          0,
        );

      // ── ACT 2: White flash burst ──────────────────────────
      tl.to(scene1El, { opacity: 0, duration: 0.1 }, 0.15).fromTo(
        whiteFlashEl,
        { opacity: 0 },
        { opacity: 1, duration: 0.08 },
        0.2,
      );

      // ── ACT 3: We Are scene materialises ─────────────────
      tl.to(whiteFlashEl, { opacity: 0, duration: 0.1 }, 0.28).fromTo(
        aboutSceneEl,
        { scale: 1.1, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.25 },
        0.28,
      );
    }, masterRef);

    return () => {
      ctx.revert();
      gsap.killTweensOf([
        scene1El,
        aboutSceneEl,
        whiteFlashEl,
        scrollCueEl,
        yourBrandEl,
        maskElevatedEl,
      ]);
      gsap.set(
        [
          scene1El,
          aboutSceneEl,
          whiteFlashEl,
          scrollCueEl,
          yourBrandEl,
          maskElevatedEl,
        ],
        {
          opacity: "",
          scale: "",
          y: "",
          transform: "",
        },
      );
    };
  }, []);

  // ── Scroll-driven pin + transition (rest of code below) ─────────────────

  return (
    <div ref={masterRef} className={styles.masterContainer}>
      {/* ════ SCENE 1: HERO ════ */}
      <div ref={scene1Ref} className={`${styles.scene} ${styles.scene1}`}>
        {/* Video */}
        <video className={styles.video} autoPlay muted loop playsInline>
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>

        <div className={styles.heroGrain} aria-hidden="true" />
        <div className={styles.heroSpotlight} aria-hidden="true" />

        <div className={styles.heroTopScrim} aria-hidden="true" />
        <div className={styles.heroVignette} aria-hidden="true" />

        {/* Mask layer — video visible through "Elevated" letterform via blend mode */}
        <div className={styles.maskLayer}>
          <div className={styles.titleWrap}>
            <h1 className={styles.title}>
              <span ref={maskElevatedRef} className={styles.elevatedWrapper}>
                <span className={styles.elevatedTextMask}>ELEVATED</span>
              </span>
            </h1>
          </div>
        </div>

        {/* Overlay — "Your Brand" solid text + transparent layout spacer */}
        <div className={styles.overlayLayer}>
          <div className={styles.titleWrap}>
            <h1 className={styles.title}>
              <span ref={yourBrandRef} className={styles.yourBrandSolid}>
                Your Brand
              </span>
              <span className={styles.elevatedWrapper}>
                <span className={styles.elevatedTextSolid}>ELEVATED</span>
              </span>
            </h1>
          </div>
        </div>

        <div ref={scrollCueRef} className={styles.scrollCue} aria-hidden="true">
          <span className={styles.scrollLabel}>Scroll</span>
          <span className={styles.scrollLine} />
        </div>
      </div>

      {/* ════ FLASH TRANSITION ════ */}
      <div ref={whiteFlashRef} className={styles.whiteFlash} />

      {/* ════ SCENE 2: WE ARE ════ */}
      <div
        ref={aboutSceneRef}
        className={`${styles.scene} ${styles.aboutScene} ${styles.scene2}`}
      >
        {/* Content */}
        <div className="flex flex-col items-center w-full relative px-4 sm:px-8 md:px-20 pb-16 pt-24">
          <div className="flex flex-col items-center gap-8 md:gap-12 relative max-w-4xl w-full">
            <div className="flex flex-col items-center gap-6 sm:gap-8 w-full">
              <Image
                alt="Kathart logo icon"
                width={100}
                height={100}
                className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32"
                src="/images/Kathart_logo-light.svg"
              />
              <div className="flex flex-col items-center gap-4 w-full">
                <h2 className="font-semibold text-3xl sm:text-4xl md:text-6xl text-center leading-tight">
                  We are
                </h2>
                <h2 className="font-semibold text-3xl sm:text-4xl md:text-6xl text-center leading-1">
                  Kathart Studios
                </h2>
              </div>
              <p className="text-center text-base sm:text-lg md:text-xl max-w-2xl leading-relaxed mt-3">
                At Kathart Studios, we believe every story deserves to be seen,
                felt, and remembered. We combine creativity, strategy, and craft
                across design, marketing, and film to create experiences that
                engage audiences, inspire action, and build brands that last.
              </p>
            </div>
            <div>
              <Button className="primary-btn">
                <span className="text-base font-medium text-white">
                  Know more About us
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
