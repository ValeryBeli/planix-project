import { useEffect } from "react";
import LandingHeader from "../components/LandingHeader";
import LandingHero from "../components/LandingHero";
import LandingFeatures from "../components/LandingFeatures";
import KnituSection from "../components/KnituSection";
import LandingFooter from "../components/LandingFooter";

export default function Landing() {
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      window.location.pathname = "/dashboard";
    }
  }, []);

  return (
    <>
      <LandingHeader />

      <LandingHero />

      <LandingFeatures />

      <KnituSection />

      <LandingFooter />
    </>
  );
}