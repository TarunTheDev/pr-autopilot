import React from 'react';
import { Preset } from '../data/demoData';
import { useConfig } from '../context/ConfigContext';
import { RetroNavbar } from './retro/RetroNavbar';
import { RetroHero } from './retro/RetroHero';
import { RetroMockup } from './retro/RetroMockup';
import { RetroAnalyzer } from './retro/RetroAnalyzer';
import { RetroPresets } from './retro/RetroPresets';
import { RetroFeatures } from './retro/RetroFeatures';
import { RetroTestimonials } from './retro/RetroTestimonials';
import { RetroCompare } from './retro/RetroCompare';
import { RetroPricing } from './retro/RetroPricing';
import { RetroFAQ } from './retro/RetroFAQ';
import { RetroFooter } from './retro/RetroFooter';

interface LandingProps {
  jiraInput: string;
  setJiraInput: (val: string) => void;
  prInput: string;
  setPrInput: (val: string) => void;
  onRun: () => void;
  onSelectPreset: (preset: Preset) => void;
}

export const Landing: React.FC<LandingProps> = ({
  jiraInput,
  setJiraInput,
  prInput,
  setPrInput,
  onRun,
  onSelectPreset,
}) => {
  const { setShowSettings } = useConfig();

  return (
    <div className="retro-scope retro-paper-bg retro-grain min-h-screen overflow-x-clip">
      <RetroNavbar onOpenSettings={() => setShowSettings(true)} />
      <main>
        <RetroHero />
        <RetroMockup />
        <RetroAnalyzer
          jiraInput={jiraInput}
          setJiraInput={setJiraInput}
          prInput={prInput}
          setPrInput={setPrInput}
          onRun={onRun}
        />
        <RetroPresets onSelect={onSelectPreset} />
        <RetroFeatures />
        <RetroTestimonials />
        <RetroCompare />
        <RetroPricing />
        <RetroFAQ />
      </main>
      <RetroFooter />
    </div>
  );
};
