import './GroupByColor.less';

import React from 'react';
import PropTypes from 'prop-types';

import * as analytics from '../../../../../../../../services/analytics';
import UI from '../../../../../../../../ui';
import { HubMainScreenModel } from '../../../../../models/HubMainScreenModel';
import { classNames } from '../../../../../../../../utils';
import { COLORS } from '../../../../../../../../constants/colors';
import SelectFieldsByGroupType from '../SelectFieldsByGroupType';

function GroupByColor({
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
  colorPalette,
  advanceOpened,
  setAdvanceOpened,
  headerTooltip,
  popup,
}) {
  const { setSeed, togglePersistence, setColorPalette } =
    HubMainScreenModel.emitters;

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
          <>
            <div className='ControlsSidebar__item__popup__body__action'>
              <UI.Text overline bold type='primary'>
                Colors persistence:
              </UI.Text>
              <UI.Text small spacingTop spacing>
                Enable persistent coloring mode so that each item always has the
                same color regardless of its order.
              </UI.Text>
              <div className='ControlsSidebar__item__popup__body__action__row ControlsSidebar__item__popup__body__action__row--persistence'>
                <div
                  className='ControlsSidebar__item__popup__body__action__row__persistenceSwitch'
                  onClick={() => {
                    togglePersistence('color');
                    analytics.trackEvent('[Explore] Toggle color persistence', {
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
                    <UI.Icon
                      i={`toggle_${persist ? 'on' : 'off'}`}
                      scale={1.5}
                    />
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
                      setSeed(seed + 1, 'color');
                      analytics.trackEvent(
                        '[Explore] Shuffle colors of groups items',
                      );
                    }}
                  >
                    Shuffle colors
                  </UI.Button>
                )}
              </div>
            </div>
            <div className='ControlsSidebar__item__popup__body__action'>
              <UI.Text overline bold type='primary'>
                Preferred color palette:
              </UI.Text>
              {COLORS.map((palette, paletteIndex) => (
                <div
                  key={paletteIndex}
                  className='ColorPalette'
                  onClick={() => {
                    setColorPalette(paletteIndex);
                    analytics.trackEvent(
                      `[Explore] Set color palette to "${paletteIndex}"`,
                    );
                  }}
                >
                  <UI.Radio
                    name={paletteIndex}
                    checked={+paletteIndex === +colorPalette}
                  />
                  <div
                    className={`ColorPalette__colors ColorPalette__colors--${paletteIndex}`}
                  >
                    {palette.map((color) => (
                      <span
                        className='ColorPalette__colors__item'
                        style={{
                          backgroundColor: color,
                        }}
                        key={color}
                      />
                    ))}
                  </div>
                  <UI.Text
                    inline
                    small
                    type='grey-dark'
                    className='ColorPalette__colors__title'
                  >
                    {paletteIndex === 0 && ' 8 distinct colors'}
                    {paletteIndex === 1 && ' 24 colors'}
                  </UI.Text>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </SelectFieldsByGroupType>
  );
}

GroupByColor.propTypes = {
  groupByItem: PropTypes.arrayOf(PropTypes.string).isRequired,
  setOpened: PropTypes.func,
  opened: PropTypes.bool,
  popupRef: PropTypes.object,
  dropdownRef: PropTypes.object,
  options: PropTypes.any,
  seed: PropTypes.number,
  persist: PropTypes.bool,
  colorPalette: PropTypes.number,
  against: PropTypes.bool,
  advanceOpened: PropTypes.bool,
  setAdvanceOpened: PropTypes.func,
};

export default GroupByColor;
