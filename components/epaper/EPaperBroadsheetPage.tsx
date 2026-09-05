'use client';

import React from 'react';
import { EPaperPageData, BroadsheetArticle, formatGujaratiDate, getCleanText } from './types';
import { FrontPageTemplate } from './templates/FrontPageTemplate';
import { LocalCityTemplate } from './templates/LocalCityTemplate';
import { GujaratTemplate } from './templates/GujaratTemplate';
import { NationalTemplate } from './templates/NationalTemplate';
import { WorldTemplate } from './templates/WorldTemplate';
import { BusinessTemplate } from './templates/BusinessTemplate';
import { SportsTemplate } from './templates/SportsTemplate';
import { TechnologyTemplate } from './templates/TechnologyTemplate';
import { EntertainmentTemplate } from './templates/EntertainmentTemplate';
import { LifestyleTemplate } from './templates/LifestyleTemplate';
import { EducationTemplate } from './templates/EducationTemplate';
import { JobsTemplate } from './templates/JobsTemplate';
import { EditorialTemplate } from './templates/EditorialTemplate';
import { PhotoTemplate } from './templates/PhotoTemplate';

export type { BroadsheetArticle, EPaperPageData };
export { formatGujaratiDate, getCleanText };

interface EPaperBroadsheetPageProps {
  data: EPaperPageData;
  scale?: number;
  isPrintPreview?: boolean;
}

export const EPaperBroadsheetPage: React.FC<EPaperBroadsheetPageProps> = ({
  data,
  scale = 1,
  isPrintPreview = false,
}) => {
  const pageNum = data?.pageNumber || 1;
  const templateId = data?.templateId;

  // Delegate to specific template component
  const renderTemplate = () => {
    if (templateId === 'FrontPageTemplate' || pageNum === 1) {
      return <FrontPageTemplate data={data} />;
    }
    if (templateId === 'LocalCityTemplate' || pageNum === 2) {
      return <LocalCityTemplate data={data} />;
    }
    if (templateId === 'GujaratTemplate' || pageNum === 3) {
      return <GujaratTemplate data={data} />;
    }
    if (templateId === 'NationalTemplate' || pageNum === 4) {
      return <NationalTemplate data={data} />;
    }
    if (templateId === 'WorldTemplate' || pageNum === 5) {
      return <WorldTemplate data={data} />;
    }
    if (templateId === 'BusinessTemplate' || pageNum === 6) {
      return <BusinessTemplate data={data} />;
    }
    if (templateId === 'SportsTemplate' || pageNum === 7) {
      return <SportsTemplate data={data} />;
    }
    if (templateId === 'TechnologyTemplate' || pageNum === 8) {
      return <TechnologyTemplate data={data} />;
    }
    if (templateId === 'EntertainmentTemplate' || pageNum === 9) {
      return <EntertainmentTemplate data={data} />;
    }
    if (templateId === 'LifestyleTemplate' || pageNum === 10) {
      return <LifestyleTemplate data={data} />;
    }
    if (templateId === 'EducationTemplate' || pageNum === 11) {
      return <EducationTemplate data={data} />;
    }
    if (templateId === 'JobsTemplate' || pageNum === 12) {
      return <JobsTemplate data={data} />;
    }
    if (templateId === 'EditorialTemplate' || pageNum === 13) {
      return <EditorialTemplate data={data} />;
    }
    if (templateId === 'PhotoTemplate' || pageNum === 14) {
      return <PhotoTemplate data={data} />;
    }

    // Default fallback
    return <FrontPageTemplate data={data} />;
  };

  return (
    <div
      className="bg-white text-slate-900 font-sans mx-auto overflow-hidden shadow-2xl relative select-none"
      style={{
        width: '794px',
        minHeight: '1123px',
        height: '1123px',
        boxSizing: 'border-box',
        transform: scale !== 1 ? `scale(${scale})` : undefined,
        transformOrigin: 'top center',
        fontFamily: "'Noto Sans Gujarati', 'Hind Vadodara', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {renderTemplate()}
    </div>
  );
};

export default EPaperBroadsheetPage;
