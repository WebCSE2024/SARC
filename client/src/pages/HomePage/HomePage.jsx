import React, { useEffect, useRef, Suspense } from "react";
import "./HomePage.scss";
import { animate, createScope, createSpring, stagger } from "animejs";
import { NavLink } from "react-router-dom";
import NetworkScene from "../../components/Three/NetworkScene";

const HomePage = () => {
  const root = useRef(null);
  const scope = useRef(null);

  useEffect(() => {
    // Respect reduced motion
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    scope.current = createScope({ root }).add(() => {
      if (prefersReduced) return;

      // Intro fade-up for hero content
      animate(".hero h1, .hero p, .hero .cta", {
        y: [20, 0],
        opacity: [0, 1],
        ease: "out(3)",
        duration: 700,
        delay: stagger(90),
      });

      // Subtle floating parallax for cards in 3D container
      animate(".threeD .card", {
        translateZ: [0, 20],
        rotateX: [-2, 2],
        rotateY: [-2, 2],
        ease: createSpring({ stiffness: 70, damping: 12 }),
        loop: true,
        alternate: true,
        duration: 3000,
        delay: stagger(200),
      });

      // Note: pseudo-elements can't be targeted; the glow is done via CSS only
    });

    return () => scope.current?.revert();
  }, []);

  return (
    <div className="HomePage" ref={root}>
      <section className="hero container" aria-label="SARC mission">
        <h1 className="tagline">
          Where Legacy Meets Opportunity
          <br />
          Connect with the CSES Network.
        </h1>
        <p className="subtitle">
          Collaborate with alumni, professors, and peers. Access research,
          referrals, and opportunities to grow.
        </p>
        <div className="cta" role="group" aria-label="Primary actions">
          <NavLink to="/referrals" className="btn primary">
            Explore Referrals
          </NavLink>
          <NavLink to="/sig" className="btn ghost">
            Explore SIGs
          </NavLink>
        </div>
      </section>
      <Suspense
        fallback={
          <div
            className="DisplayImg threeD loading"
            role="region"
            aria-label="Loading network visualization"
          >
            <div className="loading-text">Loading SARC Network...</div>
          </div>
        }
      >
        <NetworkScene />
      </Suspense>
    </div>
  );
};

export default HomePage;
