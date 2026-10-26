import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { WallStage, WallTabId } from '../../components/walls/WallStage.tsx';
import '../../styles/walls.css';

export const CollectionWallsLayout: React.FC = () => {
  const location = useLocation();
  const isLivingInheritance = location.pathname.includes('/the-living-inheritance');
  const activeTab: WallTabId = isLivingInheritance ? 'living-inheritance' : 'contemporary';

  // Synchronize document title per Stage 05 §2
  useEffect(() => {
    if (activeTab === 'living-inheritance') {
      document.title = 'The Living Inheritance · EverThread';
    } else {
      document.title = 'Contemporary Collection · EverThread';
    }
  }, [activeTab]);

  return (
    <div className="collection-walls-layout" data-testid="collection-walls-layout">
      {/* Shared Wall Stage with Tabs, Native Scroll Track & Thread Continuity */}
      <WallStage activeTab={activeTab} />

      {/* Routed Wall Products Viewport with Tabpanel Semantics */}
      <div 
        id="wall-products" 
        role="tabpanel" 
        aria-labelledby={activeTab === 'contemporary' ? 'tab-contemporary' : 'tab-living-inheritance'}
        tabIndex={0}
        className="wall-products-viewport"
        data-testid="wall-products-viewport"
      >
        <Outlet />
      </div>
    </div>
  );
};
