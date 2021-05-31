import React from 'react';
import PropTypes from 'prop-types';

import * as analytics from '../../../../../../../../services/analytics';
import UI from '../../../../../../../../ui';
import { classNames } from '../../../../../../../../utils';
import { HubMainScreenModel } from '../../../../../models/HubMainScreenModel';
import SelectFieldsByGroupType from '../SelectFieldsByGroupType';

function GroupByStyle({
  type,
  setOpened,
  opened,
  popupRef,
  dropdownRef,
  options,
  groupByItem,
  seed,
  persist,
  against,
  advanceOpened,
  setAdvanceOpened,
  headerTooltip,
  popup,
}) {
  const { setSeed, togglePersistence } = HubMainScreenModel.emitters;

  return (
    <SelectFieldsByGroupType
      type={type}
      setOpened={setOpened}
      opened={opened}
      popupRef={popupRef}
      dropdownRef={dropdownRef}
      options={options}
      groupByItem={groupByItem}
      against={against}
      headerTooltip={headerTooltip}
      popup={popup}
    >
      <div className='ControlsSidebar__item__popup__body__actionContainer'>
        <UI.Tooltip
          tooltip={
            advanceOpened ? 'Hide advanced options' : 'Show advanced options'
          }
        >
          <div
            className={classNames({
              ControlsSidebar__item__popup__body__actionCollapse: true,
              collapsed: advanceOpened,
            })}
            onClick={() => setAdvanceOpened((opened) => !opened)}
          >
            <span className='ControlsSidebar__item__popup__body__toggle__action'>
              <UI.Icon
                i={advanceOpened ? 'unfold_less' : 'unfold_more'}
                scale={1}
              />
            </span>
            <UI.Text type='grey-dark' small>
              Advanced options
            </UI.Text>
          </div>
        </UI.Tooltip>
        {advanceOpened && (
          <div className='ControlsSidebar__item__popup__body__action'>
            <UI.Text overline bold type='primary'>
              Stroke style persistence:
            </UI.Text>
            <UI.Text small spacingTop spacing>
              Enable persistent mode for stroke styles so that each group always
              has the same stroke style regardless of its order.
            </UI.Text>
            <div className='ControlsSidebar__item__popup__body__action__row ControlsSidebar__item__popup__body__action__row--persistence'>
              <div
                className='ControlsSidebar__item__popup__body__action__row__persistenceSwitch'
                onClick={() => {
                  togglePersistence('style');
                  analytics.trackEvent('[Explore] Toggle style persistence', {
                    persist,
                  });
                }}
              >
                <span
                  className={classNames({
                    ControlsSidebar__item__popup__toggle: true,
                    on: persist,
                  })}
                >
                  <UI.Icon i={`toggle_${persist ? 'on' : 'off'}`} scale={1.5} />
                </span>
                <UI.Text type={persist ? 'primary' : 'grey-dark'} small>
                  {persist ? 'Enabled' : 'Disabled'}
                </UI.Text>
              </div>
              {persist && (
                <UI.Button
                  size='tiny'
                  disabled={groupByItem.length === 0}
                  onClick={(evt) => {
                    setSeed(seed + 1, 'style');
                    analytics.trackEvent(
                      '[Explore] Shuffle styles of groups items',
                    );
                  }}
                >
                  Shuffle
                </UI.Button>
              )}
            </div>
          </div>
        )}
      </div>
    </SelectFieldsByGroupType>
  );
}

GroupByStyle.propTypes = {
  groupByItem: PropTypes.arrayOf(PropTypes.string).isRequired,
  setOpened: PropTypes.func,
  opened: PropTypes.bool,
  popupRef: PropTypes.object,
  dropdownRef: PropTypes.object,
  options: PropTypes.any,
  seed: PropTypes.number,
  persist: PropTypes.bool,
  advanceOpened: PropTypes.bool,
  setAdvanceOpened: PropTypes.func,
};

export default GroupByStyle;
