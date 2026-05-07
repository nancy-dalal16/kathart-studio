import Head from "next/head";
import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import styles from "@/styles/Home.module.css";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ limitCallbacks: true, ignoreMobileResize: true });

export default function Home() {
  // Master pin container
  const masterRef = useRef(null);

  // Hero scene refs
  const scene1Ref = useRef(null);
  const yourBrandRef = useRef(null);
  const maskElevatedRef = useRef(null);
  const maskLayerRef = useRef(null);
  const whiteFlashRef = useRef(null);
  const accentLineRef = useRef(null);
  const heroBgKRef = useRef(null);
  const heroArcRef = useRef(null);
  const heroRulesRef = useRef(null);

  // About scene refs
  const aboutSceneRef = useRef(null);
  const aboutRightRef = useRef(null);
  const aboutLeftRef = useRef(null);

  // Capabilities scene refs
  const capaSceneRef = useRef(null);
  const capaTrackRef = useRef(null);

  // Non-pinned sections
  const workRef = useRef(null);
  const col1Ref = useRef(null);
  const col2Ref = useRef(null);
  const col3Ref = useRef(null);
  const col4Ref = useRef(null);
  const clientsRef = useRef(null);
  const marqueeRef = useRef(null);
  const contactRef = useRef(null);

  useLayoutEffect(() => {
    // Set initial states BEFORE context/timeline takes ownership
    if (aboutSceneRef.current)
      gsap.set(aboutSceneRef.current, { scale: 1.08, opacity: 0 });
    if (capaSceneRef.current) gsap.set(capaSceneRef.current, { xPercent: 100 });

    let ctx = gsap.context(() => {
      // Total scroll length for the pinned master container
      const totalScroll = 9000;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: masterRef.current,
          start: "top top",
          end: `+=${totalScroll}`,
          scrub: true,
          pin: true,
          anticipatePin: 1,
          lazy: false,
        },
      });

      // Lock initial off-screen state inside the timeline too
      tl.set(aboutSceneRef.current, { scale: 1.08, opacity: 0 }, 0);
      tl.set(whiteFlashRef.current, { opacity: 0 }, 0);
      tl.set(capaSceneRef.current, { xPercent: 100 }, 0);

      // ╔══════════════════════════════════════════╗
      // ║  ACT 1 — HERO DEPARTURE  (0 → 0.22)     ║
      // ╚══════════════════════════════════════════╝
      // "Your Brand" + accent line lift off together
      tl.to(
        yourBrandRef.current,
        {
          opacity: 0,
          y: -50,
          ease: "power3.inOut",
          duration: 0.13,
        },
        0,
      ).to(
        accentLineRef.current,
        { opacity: 0, ease: "power3.inOut", duration: 0.13 },
        0,
      )
        // "Elevated" zooms into the viewer — acceleration curve makes it feel heavy
        .to(
          maskElevatedRef.current,
          {
            scale: 30,
            ease: "power3.in",
            duration: 0.22,
          },
          0,
        );

      // ╔══════════════════════════════════════════╗
      // ║  ACT 2 — WHITE FLASH BURST  (0.16 → 0.28)║
      // ╚══════════════════════════════════════════╝
      // As zoom reaches critical mass, a pure-white lens burst fills the frame.
      // The hero video dissolves beneath it simultaneously.
      tl.to(
        scene1Ref.current,
        {
          opacity: 0,
          ease: "power2.in",
          duration: 0.08,
        },
        0.13,
      ).fromTo(
        whiteFlashRef.current,
        { opacity: 0 },
        { opacity: 1, ease: "power2.in", duration: 0.06 },
        0.17,
      );

      // ╔══════════════════════════════════════════╗
      // ║  ACT 3 — NEW WORLD MATERIALIZES (0.24+) ║
      // ╚══════════════════════════════════════════╝
      // Flash fades. About scene scales INTO existence from the center.
      // Scale 1.08 → 1.0 + opacity 0→1 = the "camera focus" feeling.
      tl.to(
        whiteFlashRef.current,
        {
          opacity: 0,
          ease: "power2.out",
          duration: 0.14,
        },
        0.24,
      ).to(
        aboutSceneRef.current,
        {
          scale: 1,
          opacity: 1,
          ease: "expo.out",
          duration: 0.22,
        },
        0.24,
      );

      // About LEFT content: words stagger up into place after the scene settles
      if (aboutLeftRef.current) {
        const leftEls = aboutLeftRef.current.querySelectorAll("h2, p, a");
        tl.fromTo(
          leftEls,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.04,
            ease: "power3.out",
            duration: 0.1,
          },
          0.35,
        );
      }

      // About RIGHT image stack reveals
      const images = aboutRightRef.current
        ? Array.from(aboutRightRef.current.querySelectorAll(".stack-image"))
        : [];
      images.forEach((img, i) => {
        if (i === 0) return;
        tl.fromTo(
          img,
          { yPercent: 100 },
          { yPercent: 0, ease: "power2.out", duration: 0.08 },
          0.4 + i * 0.07,
        );
      });

      // === SCENE 3: CAPABILITIES PANEL (0.62 → 1.0) ===
      // Elevate scene 3 z-index to cover scene 2
      tl.call(
        () => {
          if (capaSceneRef.current) capaSceneRef.current.style.zIndex = "3";
        },
        null,
        0.6,
      )
        .to(
          aboutSceneRef.current,
          { yPercent: -100, ease: "power2.in", duration: 0.08 },
          0.6,
        )
        .to(
          capaSceneRef.current,
          { xPercent: 0, ease: "power2.out", duration: 0.1 },
          0.63,
        );

      // Horizontal scroll of capa cards within the pinned scene
      const capaScrollAmount = () =>
        capaTrackRef.current
          ? capaTrackRef.current.scrollWidth - window.innerWidth
          : 0;

      tl.to(
        capaTrackRef.current,
        { x: () => -capaScrollAmount(), ease: "none", duration: 0.38 },
        0.62,
      );

      // ─── NON-PINNED SECTIONS ───

      // Parallax work columns
      [
        { ref: col1Ref.current, y: -60 },
        { ref: col2Ref.current, y: -180 },
        { ref: col3Ref.current, y: -100 },
        { ref: col4Ref.current, y: -220 },
      ].forEach((col) => {
        if (!col.ref) return;
        gsap.to(col.ref, {
          y: col.y,
          ease: "none",
          scrollTrigger: {
            trigger: workRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            lazy: false,
          },
        });
      });

      // Velocity marquee
      if (marqueeRef.current) {
        const ticker = gsap.to(marqueeRef.current, {
          xPercent: -50,
          ease: "none",
          duration: 18,
          repeat: -1,
        });
        ScrollTrigger.create({
          trigger: clientsRef.current,
          start: "top bottom",
          end: "bottom top",
          lazy: false,
          onUpdate: (self) => {
            const speed = 1 + Math.abs(self.getVelocity() / 300);
            gsap.to(ticker, {
              timeScale: self.direction * speed,
              duration: 0.4,
              overwrite: true,
              onComplete: () =>
                gsap.to(ticker, {
                  timeScale: self.direction,
                  duration: 1,
                  overwrite: true,
                }),
            });
          },
        });
      }

      // Fade-up reveals on non-pinned sections
      [workRef, clientsRef, contactRef].forEach((ref) => {
        if (!ref.current) return;
        const els = ref.current.querySelectorAll(".gsap-reveal");
        if (!els.length) return;
        gsap.fromTo(
          els,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ref.current,
              start: "top 85%",
              lazy: false,
            },
          },
        );
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill(true));
      ctx.revert();
      // Reset positions set before the context
      if (aboutSceneRef.current) {
        gsap.set(aboutSceneRef.current, { clearProps: "transform,opacity" });
        aboutSceneRef.current.style.zIndex = "";
      }
      if (whiteFlashRef.current) {
        gsap.set(whiteFlashRef.current, { clearProps: "opacity" });
      }
      if (capaSceneRef.current) {
        gsap.set(capaSceneRef.current, { clearProps: "transform" });
        capaSceneRef.current.style.zIndex = "";
      }
    };
  }, []);

  // ── Cursor-driven parallax on hero background layers ─────────────────────
  useEffect(() => {
    const onMouseMove = (e) => {
      if (window.scrollY > 1400) return;
      const nx = (e.clientX / window.innerWidth  - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      if (heroBgKRef.current)
        gsap.to(heroBgKRef.current,   { x: nx * 22,  y: ny * 14,  duration: 1.0, ease: "power2.out", overwrite: "auto" });
      if (heroArcRef.current)
        gsap.to(heroArcRef.current,   { x: nx * -26, y: ny * -18, duration: 1.2, ease: "power2.out", overwrite: "auto" });
      if (heroRulesRef.current)
        gsap.to(heroRulesRef.current, { x: nx * 10,  y: ny * 6,   duration: 1.4, ease: "power2.out", overwrite: "auto" });
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  return (
    <>
      <Head>
        <title>Kathart Studios | Your Brand Elevated.</title>
        <meta
          name="description"
          content="Kathart Studios — Creative agency elevating brands"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* ════ SINGLE PINNED MASTER CONTAINER ════ */}
      <div ref={masterRef} className={styles.masterContainer}>
        {/* ── SCENE 1: HERO ── */}
        <div ref={scene1Ref} className={`${styles.scene} ${styles.scene1}`}>
          {/* Video — plays only through the "Elevated" text letterform via maskLayer screen blend */}
          <video className={styles.video} autoPlay muted loop playsInline>
            <source src="/6472_Drone_Landscape_Beach_1920x1080.mp4" type="video/mp4" />
          </video>
          {/* Film grain — adds tactility, prevents digital-flat look */}
          <div className={styles.heroGrain} aria-hidden="true" />
          {/* Theatrical amber spotlight rising from stage floor */}
          <div className={styles.heroSpotlight} aria-hidden="true" />
          {/* Precision diagonal rule lines — implies craft and systems */}
          <div ref={heroRulesRef} className={styles.heroRules} aria-hidden="true" />
          {/* Large K letterform — stroke color flips per theme via CSS currentColor */}
          <svg ref={heroBgKRef} className={styles.heroBgK} viewBox="0 0 500 620"
            xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <text x="52%" y="68%" textAnchor="middle" fill="none"
              stroke="currentColor" strokeWidth="1"
              fontFamily="Helvetica Neue, Helvetica, Arial, sans-serif"
              fontWeight="900" fontSize="500" letterSpacing="-20">K</text>
          </svg>
          {/* Compass arc — geometric accent, bottom-left. Implies precision, studio craft. */}
          <svg ref={heroArcRef} className={styles.heroArc} viewBox="0 0 500 500"
            xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <circle cx="250" cy="250" r="222" fill="none"
              stroke="rgba(124,92,191,0.22)" strokeWidth="0.8"/>
            <circle cx="250" cy="250" r="158" fill="none"
              stroke="rgba(255,255,255,0.05)" strokeWidth="0.5"/>
            <line x1="250" y1="26" x2="250" y2="474"
              stroke="rgba(255,255,255,0.04)" strokeWidth="0.5"/>
            <line x1="26" y1="250" x2="474" y2="250"
              stroke="rgba(255,255,255,0.04)" strokeWidth="0.5"/>
            <circle cx="250" cy="250" r="3.5" fill="none"
              stroke="rgba(124,92,191,0.45)" strokeWidth="1"/>
          </svg>
          {/* Top scrim — keeps nav readable */}
          <div className={styles.heroTopScrim} aria-hidden="true" />
          {/* Edge vignette — pulls focus to center */}
          <div className={styles.heroVignette} aria-hidden="true" />

          <div ref={maskLayerRef} className={styles.maskLayer}>
            <div className={styles.titleWrap}>
              <h1 className={styles.title}>
                <span ref={maskElevatedRef} className={styles.elevatedWrapper}>
                  <span className={styles.elevatedTextMask}>Elevated</span>
                </span>
              </h1>
            </div>
          </div>
          <div className={styles.overlayLayer}>
            <div className={styles.titleWrap}>
              <h1 className={styles.title}>
                <span ref={yourBrandRef} className={styles.yourBrandSolid}>
                  Your Brand
                </span>
                <span className={styles.elevatedWrapper}>
                  <span ref={accentLineRef} className={styles.heroAccentLine} aria-hidden="true" />
                  <span className={styles.elevatedTextSolid}>Elevated</span>
                </span>
              </h1>
            </div>
          </div>

          {/* Scroll cue — animated drip line */}
          <div className={styles.scrollCue} aria-hidden="true">
            <span className={styles.scrollLabel}>Scroll</span>
            <span className={styles.scrollLine} />
          </div>
        </div>

        {/* ── WHITE FLASH TRANSITION OVERLAY ── */}
        {/* Sits above all scenes. GSAP animates opacity 0→1→0 as a cinematic lens burst */}
        <div ref={whiteFlashRef} className={styles.whiteFlash} />

        {/* ── SCENE 2: ABOUT ── */}
        <div
          ref={aboutSceneRef}
          className={`${styles.scene} ${styles.aboutScene} ${styles.scene2}`}
        >
          {/* Ghost "K" — brand letterform as typographic texture */}
          <svg
            className={styles.ghostK}
            aria-hidden="true"
            viewBox="0 0 500 600"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid meet"
          >
            <text
              x="50%"
              y="90%"
              textAnchor="middle"
              fill="none"
              stroke="rgba(0,0,0,0.13)"
              strokeWidth="1.5"
              fontFamily="Helvetica Neue, Helvetica, Arial, sans-serif"
              fontWeight="900"
              fontSize="520"
              letterSpacing="-20"
            >
              K
            </text>
          </svg>

          <div ref={aboutLeftRef} className={styles.aboutLeft}>
            <div className={styles.aboutContent}>
              <h2 className={styles.titleLarge}>We are Kathart Studios</h2>
              <p className={styles.textBody}>
                Some brands get noticed. Others get remembered.
                <br />
                <br />
                We work with founders and companies who know the difference. We
                bring together design, film, and marketing — not as separate
                services, but as one integrated creative force.
              </p>
              <a href="/about" className={styles.ctaLinkLight}>
                Our Story <span className={styles.arrow}>→</span>
              </a>
            </div>
          </div>
          <div ref={aboutRightRef} className={styles.aboutRight}>
            <div
              className={`${styles.imageWrapper} stack-image`}
              style={{ zIndex: 1 }}
            >
              <img src="/images/create_your_story.png" alt="Design" />
            </div>
            <div
              className={`${styles.imageWrapper} stack-image`}
              style={{ zIndex: 2 }}
            >
              <img src="/images/sketch_your_story.png" alt="Film" />
            </div>
            <div
              className={`${styles.imageWrapper} stack-image`}
              style={{ zIndex: 3 }}
            >
              <img src="/images/promote_your_story.png" alt="Marketing" />
            </div>
          </div>
        </div>

        {/* ── SCENE 3: CAPABILITIES ── */}
        <div
          ref={capaSceneRef}
          className={`${styles.scene} ${styles.capaScene} ${styles.scene3}`}
        >
          {/* Dot grid texture — signals precision, systems thinking */}
          <div className={styles.capaDotGrid} aria-hidden="true" />
          {/* Cool teal + slate gradient field — different palette from About */}
          <div className={styles.capaColorField} aria-hidden="true" />
          <div className={styles.capaHeaderSection}>
            <p className={styles.eyebrowLight}>Our Capabilities</p>
            <h2 className={styles.titleLarge}>What we do.</h2>
            <p className={styles.textBody}>
              We think in systems — brand identity, film, content, marketing —
              so every touchpoint says the exact same true thing about your
              business.
            </p>
          </div>
          <div className={styles.capaCardsSection}>
            <div ref={capaTrackRef} className={styles.capaCardsWrapper}>
              <div className={styles.capaPanelImageWrapper}>
                <div className={styles.capaPanelImage}>
                  <img src="/images/films.png" alt="Films" />
                </div>
              </div>
              <div className={styles.capaPanelImageWrapper}>
                <div className={styles.capaPanelImage}>
                  <img src="/images/design.png" alt="Design" />
                </div>
              </div>
              <div className={styles.capaPanelImageWrapper}>
                <div className={styles.capaPanelImage}>
                  <img src="/images/marketing.png" alt="Marketing" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ════ END MASTER CONTAINER ════ */}

      {/* ─── OUR WORK (non-pinned) ─── */}
      <section ref={workRef} className={styles.workSectionLight}>
        {/* Warm editorial gradient — cream corners, pure white center */}
        <div className={styles.workColorField} aria-hidden="true" />
        <div className={styles.workHeader}>
          <h2 className={`gsap-reveal ${styles.titleLarge}`}>Our Work</h2>
          <p className={`gsap-reveal ${styles.textBody}`}>
            Stories we’ve shaped, identities we’ve built, and brands we’ve
            helped grow.
          </p>
        </div>
        <div className={styles.workGridParallax}>
          <div ref={col1Ref} className={styles.workCol}>
            <img
              src="https://images.unsplash.com/photo-1493723843671-1d655e66ac1c?auto=format&fit=crop&w=800&q=80"
              alt="Project 1"
            />
            <img
              src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80"
              alt="Project 2"
            />
          </div>
          <div
            ref={col2Ref}
            className={styles.workCol}
            style={{ marginTop: "80px" }}
          >
            <img
              src="https://images.unsplash.com/photo-1555421689-d68471e189f2?auto=format&fit=crop&w=800&q=80"
              alt="Project 3"
            />
            <img
              src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80"
              alt="Project 4"
            />
          </div>
          <div ref={col3Ref} className={styles.workCol}>
            <img
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
              alt="Project 5"
            />
            <img
              src="https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80"
              alt="Project 6"
            />
          </div>
          <div
            ref={col4Ref}
            className={styles.workCol}
            style={{ marginTop: "120px" }}
          >
            <img
              src="https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80"
              alt="Project 7"
            />
            <img
              src="https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80"
              alt="Project 8"
            />
          </div>
        </div>
      </section>

      {/* ─── CLIENTS ─── */}
      <section ref={clientsRef} className={styles.clientsMarqueeSection}>
        {/* Fade-edge gradient frames the marquee — cinematic reveal/mask at sides */}
        <div className={styles.marqueeEdgeFade} aria-hidden="true" />
        <h2 className={`gsap-reveal ${styles.marqueeEyebrow}`}>Our Clients</h2>
        <div className={styles.marqueeOverflow}>
          <div ref={marqueeRef} className={styles.marqueeTrack}>
            {[
              "Global Brand",
              "•",
              "Startup X",
              "•",
              "Luxury Co.",
              "•",
              "Fintech Plus",
              "•",
              "Global Brand",
              "•",
              "Startup X",
              "•",
              "Luxury Co.",
              "•",
              "Fintech Plus",
              "•",
            ].map((item, i) => (
              <div key={i} className={styles.marqueeItem}>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CONTACT ─── */}
      <section ref={contactRef} className={styles.contactSubtle}>
        {/* Ghost arrow — directional CTA glyph as background typographic accent */}
        {/* <svg
          className={styles.contactGhostArrow}
          aria-hidden="true"
          viewBox="0 0 400 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <text
            x="50%"
            y="80%"
            textAnchor="middle"
            fill="none"
            stroke="rgba(0,0,0,0.06)"
            strokeWidth="1"
            fontFamily="Helvetica Neue, Helvetica, Arial, sans-serif"
            fontWeight="900"
            fontSize="200"
          >
            →
          </text>
        </svg> */}
        <div className={styles.contactContentSubtle}>
          <p className={`gsap-reveal ${styles.contactLabelSubtle}`}>
            Start a Project
          </p>
          <h2 className={`gsap-reveal ${styles.contactTitleSubtle}`}>
            Let’s create something impossible to ignore.
          </h2>
          <a
            href="/contact"
            className={`gsap-reveal ${styles.contactButtonSubtle}`}
          >
            <span>Get In Touch</span>
          </a>
        </div>
      </section>
    </>
  );
}
