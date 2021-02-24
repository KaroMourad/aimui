import './ControlsSidebar.less';

import React from 'react';
import ContentLoader from 'react-content-loader';

import UI from '../../../../../ui';
import ControlsSidebarToggleOutliers from './components/ControlsSidebarToggleOutliers/ControlsSidebarToggleOutliers';
import GroupByColor from './components/GroupByColor/GroupByColor';
import GroupByStyle from './components/GroupByStyle/GroupByStyle';
import GroupByChart from './components/GroupByChart/GroupByChart';
import Aggregate from './components/Aggregate/Aggregate';
import ControlsSidebarZoom from './components/ControlsSidebarZoom/ControlsSidebarZoom';
import ToggleParPlotIndicator from './components/ToggleParPlotIndicator/ToggleParPlotIndicator';
import ControlsSidebarToggleInterpolation from './components/ControlsSidebarToggleInterpolation/ControlsSidebarToggleInterpolation';
import ControlsSidebarExport from './components/ControlsSidebarExport/ControlsSidebarExport';
import ControlsSidebarHighlightMode from './components/ControlsSidebarHighlightMode/ControlsSidebarHighlightMode';
import { HubMainScreenModel } from '../../models/HubMainScreenModel';
import ControlsSidebarXAlignment from './components/ControlsSidebarXAlignment/ControlsSidebarXAlignment';

function ControlsSidebar() {
  let {
    runs,
    chart,
    contextFilter,
    colorPalette,
  } = HubMainScreenModel.useHubMainScreenState([
    HubMainScreenModel.events.SET_RUNS_STATE,
    HubMainScreenModel.events.SET_CHART_SETTINGS_STATE,
    HubMainScreenModel.events.SET_CHART_POINTS_COUNT,
    HubMainScreenModel.events.SET_CONTEXT_FILTER,
    HubMainScreenModel.events.SET_SEED,
    HubMainScreenModel.events.TOGGLE_PERSISTENCE,
    HubMainScreenModel.events.SET_COLOR_PALETTE,
  ]);

  let {
    isExploreMetricsModeEnabled,
    isExploreParamsModeEnabled,
  } = HubMainScreenModel.helpers;

  const {
    groupByColor,
    groupByStyle,
    groupByChart,
    aggregated,
    seed,
    persist,
  } = contextFilter;

  return (
    <div className='ControlsSidebar'>
      {runs.isLoading ? (
        <ContentLoader
          height={280}
          width={65}
          backgroundColor='#F3F3F3'
          foregroundColor='#ECEBEB'
        >
          <rect x='10' y='10' rx='4' ry='4' width='45' height='45' />
          <rect x='10' y='65' rx='4' ry='4' width='45' height='45' />
          <rect x='10' y='120' rx='4' ry='4' width='45' height='45' />
          <rect x='10' y='175' rx='4' ry='4' width='45' height='45' />
          <rect x='10' y='230' rx='4' ry='4' width='45' height='45' />
        </ContentLoader>
      ) : (
        <div className='ControlsSidebar__items'>
          <GroupByColor
            groupByColor={groupByColor}
            seed={seed.color}
            persist={persist.color}
            colorPalette={colorPalette}
          />
          <GroupByStyle
            groupByStyle={groupByStyle}
            seed={seed.style}
            persist={persist.style}
          />
          <GroupByChart groupByChart={groupByChart} />
          {isExploreMetricsModeEnabled() && (
            <>
              <Aggregate
                aggregated={aggregated}
                disabled={
                  groupByColor.length === 0 &&
                  groupByStyle.length === 0 &&
                  groupByChart.length === 0
                }
              />
              <UI.Line />
              <ControlsSidebarToggleOutliers
                disabled={runs.isLoading || runs.isEmpty}
                settings={chart.settings}
              />
              <ControlsSidebarToggleInterpolation
                disabled={runs.isLoading || runs.isEmpty || aggregated}
                settings={chart.settings}
              />
              <ControlsSidebarXAlignment
                disabled={runs.isLoading || runs.isEmpty}
                settings={chart.settings}
              />
              <ControlsSidebarHighlightMode settings={chart.settings} />
              <UI.Line />
              <ControlsSidebarZoom settings={chart.settings} />
            </>
          )}
          {isExploreParamsModeEnabled() && (
            <>
              <UI.Line />
              <ControlsSidebarToggleInterpolation
                disabled={runs.isLoading || runs.isEmpty}
                settings={chart.settings}
              />
              <ToggleParPlotIndicator
                disabled={
                  runs.params.length + Object.keys(runs.aggMetrics).length <= 1
                }
                settings={chart.settings}
              />
            </>
          )}

          {/* <ControlsSidebarExport
                disabled={runs.isLoading || runs.isEmpty}
              /> */}
        </div>
      )}
    </div>
  );
}

ControlsSidebar.propTypes = {};

export default React.memo(ControlsSidebar);
