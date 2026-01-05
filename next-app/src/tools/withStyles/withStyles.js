"use client";
import React from 'react';
import PropTypes from 'prop-types';
import injectStyles, { withTheme } from 'react-jss';
import hoistNonReactStatics from 'hoist-non-react-statics';

function withStyles(styles) {
  return Inner => {
    const displayName = Inner.displayName || Inner.name || 'Component';

    class InsideStyles extends React.PureComponent {
      static displayName = `InsideStyles(${displayName})`;
      static propTypes = {
        forwardedRef: PropTypes.any,
        theme: PropTypes.object
      };

      render() {
        const { forwardedRef, ...etc } = this.props;
        return <Inner {...etc} ref={forwardedRef} />;
      }
    }

    const WithStylesInside = injectStyles(styles, { name: displayName })(InsideStyles);
    const WithThemeInside = withTheme(WithStylesInside);

    const WithStyles = React.forwardRef((props, ref) => (
      <WithThemeInside {...props} forwardedRef={ref} />
    ));

    return hoistNonReactStatics(WithStyles, Inner);
  };
}

export { withStyles };
