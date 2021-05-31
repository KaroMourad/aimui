import React from 'react';
import PropTypes from 'prop-types';

import * as analytics from '../../../../../../../services/analytics';
import UI from '../../../../../../../ui';
import { HubMainScreenModel } from '../../../../models/HubMainScreenModel';
import { classNames } from '../../../../../../../utils';

function SelectFieldsByGroupType({
  type,
  setOpened,
  opened,
  popupRef,
  dropdownRef,
  options,
  groupByItem,
  against,
  headerTooltip,
  popup,
  children,
}) {
  const { getState, emitters } = HubMainScreenModel;
  const { setContextFilter } = emitters;

  function onBlurPopup(evt) {
    const currentTarget = evt.currentTarget;
    if (opened) {
      window.setTimeout(() => {
        if (!currentTarget.contains(document.activeElement)) {
          setOpened(false);
        }
      }, 100);
    }
  }

  function onChangeDropdown(data) {
    const selectedItems = !!data ? data : [];
    const values = selectedItems
      .filter((i) => !!i.value)
      .map((i) => i.value.trim());
    setContextFilter(
      {
        groupBy: {
          ...getState().contextFilter.groupBy,
          [type]: values,
        },
      },
      null,
      true,
    );
    analytics.trackEvent(
      type === 'chart'
        ? '[Explore] Divide into charts'
        : `[Explore] Group by ${type}`,
    );
  }

  function onClickGroupAgainst() {
    setContextFilter({
      groupBy: {
        ...getState().contextFilter.groupBy,
        [type]: [],
      },
      groupAgainst: {
        ...getState().contextFilter.groupAgainst,
        [type]: !against,
      },
    });
    analytics.trackEvent(
      `[Explore] ${
        against ? 'Disable' : 'Enable'
      } grouping by ${type} reverse mode`,
    );
  }

  return (
    <div className='ControlsSidebar__item__wrapper'>
      <UI.Tooltip tooltip={headerTooltip.title}>
        <div
          className={classNames({
            ControlsSidebar__item: true,
            active: opened || groupByItem.length > 0,
          })}
          onClick={(evt) => setOpened(!opened)}
        >
          <UI.Icon i={headerTooltip.icon} scale={1.7} />
        </div>
      </UI.Tooltip>
      {opened && (
        <div
          className='ControlsSidebar__item__popup'
          tabIndex={0}
          ref={popupRef}
          onBlur={onBlurPopup}
        >
          <div className='ControlsSidebar__item__popup__header'>
            <UI.Text overline bold>
              {popup.headingText}
            </UI.Text>
          </div>
          <div className='ControlsSidebar__item__popup__body'>
            <UI.Dropdown
              key={`${against}`}
              className='ControlsSidebar__groupingDropdown'
              options={options}
              inline={false}
              formatGroupLabel={(data) => (
                <div>
                  <span>{data.label}</span>
                  <span>{data.options.length}</span>
                </div>
              )}
              defaultValue={groupByItem.map((field) => ({
                value: field,
                label: field.startsWith('params.') ? field.substring(7) : field,
              }))}
              ref={dropdownRef}
              onChange={onChangeDropdown}
              isOpen
              multi
            />
            <div className='ControlsSidebar__item__popup__body__actionContainer'>
              <div className='ControlsSidebar__item__popup__body__action ControlsSidebar__item__popup__body__groupAgainst'>
                <UI.Text overline bold center type='primary'>
                  {popup.groupAgainst.headingText}
                </UI.Text>
                <div
                  className='ControlsSidebar__item__popup__body__groupAgainst__switch'
                  onClick={onClickGroupAgainst}
                >
                  <UI.Text type={!against ? 'primary' : 'grey-dark'} small>
                    <UI.Tooltip tooltip={popup.groupAgainst.tooltipLeft.title}>
                      {popup.groupAgainst.tooltipLeft.child}
                    </UI.Tooltip>
                  </UI.Text>
                  <span
                    className={classNames({
                      ControlsSidebar__item__popup__toggle: true,
                      on: against,
                    })}
                  >
                    <UI.Icon
                      i={`toggle_${against ? 'on' : 'off'}`}
                      scale={1.5}
                    />
                  </span>
                  <UI.Text type={against ? 'primary' : 'grey-dark'} small>
                    <UI.Tooltip tooltip={popup.groupAgainst.tooltipRight.title}>
                      {popup.groupAgainst.tooltipRight.child}
                    </UI.Tooltip>
                  </UI.Text>
                </div>
              </div>
            </div>
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

SelectFieldsByGroupType.propTypes = {
  groupByItem: PropTypes.arrayOf(PropTypes.string).isRequired,
  setOpened: PropTypes.func,
  opened: PropTypes.bool,
  popupRef: PropTypes.object,
  dropdownRef: PropTypes.object,
  options: PropTypes.any,
  against: PropTypes.bool,
  type: PropTypes.string.isRequired,
  headerTooltip: PropTypes.object,
  popup: PropTypes.object,
};

export default SelectFieldsByGroupType;
