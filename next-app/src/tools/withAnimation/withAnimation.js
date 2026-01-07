import React from 'react';
import PropTypes from 'prop-types';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { withTheme } from 'react-jss';

import { Animation } from '../../components/Animation';
import { AnimationContext } from '../../components/AnimationContext';

function withAnimation(providedOptions) {
  const options = {
    flow: true,
    ...providedOptions
  };

  return Inner => {
    class InsideAnimation extends React.PureComponent {
      static propTypes = {
        forwardedRef: PropTypes.any
      };

      static contextType = AnimationContext;

      constructor() {
        super(...arguments);

        this.prevContext = this.context;
      }

      componentDidMount() {
        this.flow(true);
      }

      componentDidUpdate() {
        const prevStatus = this.prevContext.status;
        const currentStatus = this.context.status;

        if (prevStatus !== currentStatus) {
          this.flow();
        }

        this.prevContext = this.context;
      }

      flow(isInitialMount = false) {
        const energy = this.context;

        if (!options.flow) {
          return;
        }

        if (!this.inner.enter || !this.inner.exit) {
          throw new Error('Provided animated component needs to have methods "enter" and "exit".');
        }

        if (energy.entering) {
          this.inner.enter();
        } else if (energy.exiting) {
          this.inner.exit();
        } else if (isInitialMount && energy.entered) {
          // When component mounts and parent is already entered (e.g., client-side navigation),
          // we need to trigger the enter animation
          this.inner.enter();
        }
      }

      onRef = ref => {
        const { forwardedRef } = this.props;

        this.inner = ref;

        if (forwardedRef) {
          if (typeof forwardedRef === 'function') {
            forwardedRef(ref);
          } else if (typeof forwardedRef === 'object') {
            forwardedRef.current = ref;
          }
        }
      }

      render() {
        const energy = this.context;
        const { forwardedRef, ...etc } = this.props;
        return (
          <Inner
            {...etc}
            ref={this.onRef}
            energy={energy}
          />
        );
      }
    }

    class WithAnimationInside extends React.PureComponent {
      static displayName =
        'Animation(' +
        (Inner.displayName || Inner.name || 'Component') +
        ')';

      static propTypes = {
        animation: PropTypes.any,
        theme: PropTypes.object.isRequired
      };

      render() {
        // Fix: Destructure theme but ALSO pass it to ...etc property for child
        // or explicitly pass it down.
        const { animation, theme, ...etc } = this.props;

        return (
          <Animation {...animation} theme={theme}>
            <InsideAnimation {...etc} theme={theme} />
          </Animation>
        );
      }
    }

    // Wrap withTheme to inject theme prop
    const WithAnimationAndTheme = withTheme(WithAnimationInside);

    const WithAnimation = React.forwardRef((props, ref) => {
      return <WithAnimationAndTheme {...props} forwardedRef={ref} />;
    });

    return hoistNonReactStatics(WithAnimation, Inner);
  };
}

export { withAnimation };
