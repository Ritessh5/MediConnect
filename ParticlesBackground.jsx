import Particles from "react-particles";
import { loadSlim } from "tsparticles-slim"; // Load the slim version for performance
import { useMemo, useCallback } from "react";

const ParticlesBackground = () => {
  const options = useMemo(() => {
    return {
      background: {
        color: "#f8f9fa", // A very light gray that complements your theme
      },
      particles: {
        number: {
          value: 80, // Number of particles
        },
        links: {
          enable: true,
          distance: 150,
          color: "#0d6efd", // A light blue that matches your theme
          opacity: 0.4,
          width: 1,
        },
        move: {
          enable: true,
          speed: 1,
        },
        opacity: {
          value: { min: 0.3, max: 0.6 },
        },
        size: {
          value: { min: 1, max: 3 },
        },
      },
    };
  }, []);

  const particlesInit = useCallback((engine) => {
    loadSlim(engine);
  }, []);

  return <Particles init={particlesInit} options={options} />;
};

export default ParticlesBackground;