import React, { useLayoutEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import { Box } from '../Box';
import { getFocusableNodes, getFocusableNodesWithKeyboardNav } from '../helpers/getFocusableNodes';
import { KeyboardKeys } from '../helpers/keyboardKeys';

import { useTable } from './RawTableContext';

export const RawTh = (props) => <RawTd {...props} as="th" />;

export const RawTd = ({ coords, as, ...props }) => {
  const tdRef = useRef(null);
  const { rowIndex, colIndex, setTableValues } = useTable();
  const [isActive, setIsActive] = useState(false);

  /** @type {import("react").KeyboardEventHandler<HTMLTableCellElement> } */
  const handleKeyDown = (e) => {
    const focusableNodes = getFocusableNodes(tdRef.current, true);

    /**
     * If the cell does not have focusable children or if it has focusable children
     * without keyboard navigation, we should not run the handler.
     */
    if (
      focusableNodes.length === 0 ||
      (focusableNodes.length === 1 && getFocusableNodesWithKeyboardNav(focusableNodes).length === 0)
    ) {
      return;
    }

    if (e.key === KeyboardKeys.ENTER && !isActive) {
      setIsActive(true);
      /**
       * Cells should be "escapeable" with the escape key or enter key
       */
    } else if ((e.key === KeyboardKeys.ESCAPE || e.key === KeyboardKeys.ENTER) && isActive) {
      setIsActive(false);
      tdRef.current.focus();
    } else if (isActive) {
      /**
       * This stops the table navigation from working
       */
      e.stopPropagation();
    }
  };

  const isFocused = rowIndex === coords.row - 1 && colIndex === coords.col - 1;

  /**
   * Handles tabindex of the rendered cell element
   */
  useLayoutEffect(() => {
    const focusableNodes = getFocusableNodes(tdRef.current, true);

    /**
     * We should focus the cell if there are no focussable children inside
     * If there is only one focusable child and it has it's own keyboard navigation
     * Or if there is more than one focusable child.
     */
    if (
      focusableNodes.length === 0 ||
      (focusableNodes.length === 1 && getFocusableNodesWithKeyboardNav(focusableNodes).length !== 0) ||
      focusableNodes.length > 1
    ) {
      tdRef.current.setAttribute('tabIndex', !isActive && isFocused ? 0 : -1);
    } else {
      focusableNodes.forEach((node) => {
        node.setAttribute('tabIndex', isFocused ? 0 : -1);
      });
    }
  }, [isActive, isFocused]);

  /**
   * Handles focus of the element within the rendered cell
   */
  useLayoutEffect(() => {
    const focusableNodes = getFocusableNodes(tdRef.current, true);
    focusableNodes.forEach((node, index) => {
      node.setAttribute('tabIndex', isActive ? 0 : -1);
      /**
       * When a cell is active we want to focus the
       * first focusable element simulating a focus trap
       */
      if (isActive && index === 0) {
        node.focus();
      }
    });
  }, [isActive]);

  /**
   * This handles the case where you click on a focusable
   * node that has it's own keyboard nav (e.g. Input)
   */
  useLayoutEffect(() => {
    const focusableNodes = getFocusableNodes(tdRef.current, true);

    const handleFocusableNodeFocus = () => {
      /**
       * If there's 1 or more focusable children and at least one has keyboard navigation
       * the cell should be using the "active" system
       */
      if (focusableNodes.length >= 1 && getFocusableNodesWithKeyboardNav(focusableNodes).length !== 0) {
        setIsActive(true);
      }
      /**
       * This function is wrapped in `useCallback` so we can safely
       * assume that the reference will not change
       */
      setTableValues({ rowIndex: coords.row - 1, colIndex: coords.col - 1 });
    };

    focusableNodes.forEach((node) => {
      node.addEventListener('focus', handleFocusableNodeFocus);
    });

    return () => {
      const focusableNodes = getFocusableNodes(tdRef.current, true);
      focusableNodes.forEach((node) => {
        node.removeEventListener('focus', handleFocusableNodeFocus);
      });
    };
  }, []);

  return <Box as={as ? as : 'td'} ref={tdRef} onKeyDown={handleKeyDown} {...props} />;
};

RawTh.defaultProps = {
  coords: {},
};

RawTh.propTypes = {
  ['aria-colindex']: PropTypes.number.isRequired,
  /**
   * Position of the cell in the table
   */
  coords: PropTypes.shape({
    col: PropTypes.number,
    row: PropTypes.number,
  }),
};

RawTd.defaultProps = {
  coords: {},
};

RawTd.propTypes = {
  ['aria-colindex']: PropTypes.number.isRequired,
  as: PropTypes.oneOf(['td', 'th']),
  /**
   * Position of the cell in the table
   */
  coords: PropTypes.shape({
    col: PropTypes.number,
    row: PropTypes.number,
  }),
};
