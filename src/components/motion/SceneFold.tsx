import React, { useRef } from 'react';
import { useSceneFold } from '../../hooks/useSceneFold.ts';

export interface SceneFoldProps {
  sceneId: 'H1' | 'H2' | 'H3' | 'A1' | 'A2' | 'U1' | 'U2';
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export const SceneFold: React.FC<SceneFoldProps> = ({
  sceneId,
  children,
  className = '',
  disabled = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isReady, isComplete } = useSceneFold(containerRef, { sceneId, disabled });

  return (
    <div
      ref={containerRef}
      className={`scene-fold ${isReady ? 'js-fold-ready' : ''} ${isComplete ? 'is-complete' : ''} ${className}`}
      data-scene={sceneId}
      data-scene-fold={sceneId}
      data-testid={`scene-fold-${sceneId}`}
      data-fold-complete={isComplete ? 'true' : 'false'}
    >
      {/* Decorative architectural fold panels overlay (aria-hidden="true", pointer-events: none) */}
      {!isComplete && (
        <div className="scene-fold__panels" aria-hidden="true">
          <div className="scene-fold__band" data-band-index="0" />
          <div className="scene-fold__band" data-band-index="1" />
          <div className="scene-fold__band d-none d-md-block" data-band-index="2" />
        </div>
      )}

      {/* Actual scene content in normal flow underneath */}
      <div className="scene-fold__content">
        {children}
      </div>
    </div>
  );
};
