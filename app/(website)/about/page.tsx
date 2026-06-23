import { Metadata } from 'next';
import AboutPageClient from '@/components/AboutPageClient';

export const metadata: Metadata = {
  title: "About PebblePlate | Our Story & Mission",
  description: "PebblePlate is a recipe destination built on one principle: every recipe must be worth making again. Learn about our editorial philosophy and what sets us apart.",
};

export default function AboutPage() {
  return <AboutPageClient />;
}
