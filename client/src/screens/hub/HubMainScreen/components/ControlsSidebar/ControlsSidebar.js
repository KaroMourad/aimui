import './ControlsSidebar.less';

import React from 'react';
import ContentLoader from 'react-content-loader';

import UI from '../../../../../ui';
import ControlsSidebarToggleOutliers from './components/ControlsSidebarToggleOutliers/ControlsSidebarToggleOutliers';
import Aggregate from './components/Aggregate/Aggregate';
import ControlsSidebarZoom from './components/ControlsSidebarZoom/ControlsSidebarZoom';
import ToggleParPlotIndicator from './components/ToggleParPlotIndicator/ToggleParPlotIndicator';
import ControlsSidebarSmoothingOptions from './components/ControlsSidebarSmoothingOptions/ControlsSidebarSmoothingOptions';
import ControlsSidebarExport from './components/ControlsSidebarExport/ControlsSidebarExport';
import ControlsSidebarHighlightMode from './components/ControlsSidebarHighlightMode/ControlsSidebarHighlightMode';
import { HubMainScreenModel } from '../../models/HubMainScreenModel';
import ControlsSidebarAxesProperties from './components/ControlsSidebarAxesProperties/ControlsSidebarAxesProperties';
import ControlsSidebarGrouping from './components/ControlsSidebarGrouping/ControlsSidebarGrouping';

function ControlsSidebar() {
  let { runs, chart, contextFilter, colorPalette } =
    HubMainScreenModel.useHubMainScreenState([
      HubMainScreenModel.events.SET_RUNS_STATE,
      HubMainScreenModel.events.SET_CHART_SETTINGS_STATE,
      HubMainScreenModel.events.SET_CHART_POINTS_COUNT,
      HubMainScreenModel.events.SET_CONTEXT_FILTER,
      HubMainScreenModel.events.SET_SEED,
      HubMainScreenModel.events.TOGGLE_PERSISTENCE,
      HubMainScreenModel.events.SET_COLOR_PALETTE,
    ]);

  let { isExploreMetricsModeEnabled, isExploreParamsModeEnabled } =
    HubMainScreenModel.helpers;

  const {
    groupBy,
    groupAgainst,
    aggregatedArea,
    aggregatedLine,
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
          <ControlsSidebarGrouping
            key='color'
            type='color'
            groupByItem={groupBy.color}
            seed={seed.color}
            persist={persist.color}
            colorPalette={colorPalette}
            against={groupAgainst?.color ?? false}
          />
          <ControlsSidebarGrouping
            key='style'
            type='style'
            groupByItem={groupBy.style}
            seed={seed.style}
            persist={persist.style}
            against={groupAgainst?.style ?? false}
          />
          <ControlsSidebarGrouping
            key='chart'
            type='chart'
            groupByItem={groupBy.chart}
            against={groupAgainst?.chart ?? false}
          />
          {isExploreMetricsModeEnabled() && (
            <>
              <Aggregate
                settings={chart.settings}
                aggregatedArea={aggregatedArea}
                aggregatedLine={aggregatedLine}
                disabled={
                  groupBy.color.length === 0 &&
                  groupBy.style.length === 0 &&
                  groupBy.chart.length === 0
                }
              />
              <UI.Line />
              <ControlsSidebarAxesProperties
                disabled={runs.isLoading || runs.isEmpty}
                settings={chart.settings}
              />
              <ControlsSidebarSmoothingOptions
                settings={chart.settings}
                interpolationDisabled={
                  runs.isLoading ||
                  runs.isEmpty ||
                  chart.settings.persistent.aggregated
                }
                smoothingDisabled={false}
              />
              <ControlsSidebarToggleOutliers
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
              <ControlsSidebarSmoothingOptions
                settings={chart.settings}
                interpolationDisabled={
                  runs.isLoading ||
                  runs.isEmpty ||
                  chart.settings.persistent.aggregated
                }
                smoothingDisabled
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
