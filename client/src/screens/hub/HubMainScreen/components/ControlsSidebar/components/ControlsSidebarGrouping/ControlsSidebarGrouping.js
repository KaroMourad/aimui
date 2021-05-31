import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import { HubMainScreenModel } from '../../../../models/HubMainScreenModel';
import { getGroupingOptions } from '../../helpers';

// TODO
// const GroupByColor = React.lazy(() => import('./GroupByColor/GroupByColor'));
// const GroupByStyle = React.lazy(() => import('./GroupByStyle/GroupByStyle'));
// const SelectFieldsByGroupType = React.lazy(() => import('./SelectFieldsByGroupType'));

import SelectFieldsByGroupType from './SelectFieldsByGroupType';
import GroupByColor from './GroupByColor/GroupByColor';
import GroupByStyle from './GroupByStyle/GroupByStyle';

function ControlsSidebarGrouping({
  against,
  colorPalette,
  seed,
  persist,
  type,
  groupByItem,
}) {
  let [opened, setOpened] = useState(false);
  let [advanceOpened, setAdvanceOpened] = useState(false);

  let popupRef = useRef();
  let dropdownRef = useRef();

  let {
    getAllParamsPaths,
    getAllContextKeys,
    isExploreMetricsModeEnabled,
    isExploreParamsModeEnabled,
  } = HubMainScreenModel.helpers;

  const getGroupComponent = useCallback(
    (component) => {
      switch (component) {
        case 'chart':
          return {
            props: {
              headerTooltip: {
                title:
                  groupByItem.length > 0
                    ? `Divided into charts by ${groupByItem.length} field${
                        groupByItem.length > 1 ? 's' : ''
                      }`
                    : 'Divide into charts',
                icon: 'dashboard',
              },
              popup: {
                headingText: 'Select fields to divide into charts',
                groupAgainst: {
                  headingText: 'Select dividing mode',
                  tooltipLeft: {
                    title: 'Divide by selected',
                    child: 'Divide',
                  },
                  tooltipRight: {
                    title: 'Divide by all except selected',
                    child: 'Reverse',
                  },
                },
              },
            },
            Component: SelectFieldsByGroupType,
          };
        case 'color':
          return {
            props: {
              setAdvanceOpened,
              advanceOpened,
              colorPalette,
              seed,
              persist,
              headerTooltip: {
                title:
                  groupByItem.length > 0
                    ? `Colored by ${groupByItem.length} field${
                        groupByItem.length > 1 ? 's' : ''
                      }`
                    : 'Run color settings',
                icon: 'palette',
              },
              popup: {
                headingText: 'Select fields for grouping by color',
                groupAgainst: {
                  headingText: 'Select grouping mode',
                  tooltipLeft: {
                    title: 'Group by selected',
                    child: 'Group',
                  },
                  tooltipRight: {
                    title: 'Group by all except selected',
                    child: 'Reverse',
                  },
                },
              },
            },
            Component: GroupByColor,
          };
        case 'style':
          return {
            props: {
              setAdvanceOpened,
              advanceOpened,
              seed,
              persist,
              headerTooltip: {
                title:
                  groupByItem.length > 0
                    ? `Styled by ${groupByItem.length} field${
                        groupByItem.length > 1 ? 's' : ''
                      }`
                    : 'Group by stroke style',
                icon: 'line_style',
              },
              popup: {
                headingText: 'Select fields for grouping by stroke style',
                groupAgainst: {
                  headingText: 'Select grouping mode',
                  tooltipLeft: {
                    title: 'Group by selected',
                    child: 'Group',
                  },
                  tooltipRight: {
                    title: 'Group by all except selected',
                    child: 'Reverse',
                  },
                },
              },
            },
            Component: GroupByStyle,
          };
        default:
          return null;
      }
    },
    [type, advanceOpened, seed, colorPalette, persist],
  );

  useEffect(() => {
    if (opened) {
      if (popupRef.current) {
        popupRef.current.focus();
        const { top } = popupRef.current.getBoundingClientRect();
        popupRef.current.style.maxHeight = `${window.innerHeight - top - 10}px`;
      }
      dropdownRef.current?.selectRef?.current?.focus();
    }
  }, [opened]);

  const options = against
    ? getGroupingOptions(getAllParamsPaths(), [], false, false)
    : getGroupingOptions(
      getAllParamsPaths(),
      getAllContextKeys(),
      isExploreMetricsModeEnabled(),
      isExploreParamsModeEnabled(),
    );

  const { Component, props: groupComponentProps } = getGroupComponent(type);

  return (
    Component && (
      <Component
        key={type}
        type={type}
        groupByItem={groupByItem}
        popupRef={popupRef}
        dropdownRef={dropdownRef}
        options={options}
        opened={opened}
        setOpened={setOpened}
        against={against}
        {...groupComponentProps}
      />
    )
  );
}

ControlsSidebarGrouping.propTypes = {
  groupByItem: PropTypes.arrayOf(PropTypes.string).isRequired,
  seed: PropTypes.number,
  persist: PropTypes.bool,
  colorPalette: PropTypes.number,
  against: PropTypes.bool,
};

export default React.memo(ControlsSidebarGrouping);
