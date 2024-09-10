import React, { ComponentType, ReactNode } from 'react';

type WithChildren = { children?: ReactNode };

export type Provider<PROPS extends WithChildren = WithChildren> = {
  Comp: ComponentType<PROPS>;
  props?: Omit<PROPS, 'children'>;
};

export function provide<COMP extends ComponentType<any>>(
  comp: COMP,
  props?: Omit<React.ComponentProps<COMP>, 'children'>,
): Provider<React.ComponentProps<COMP>> {
  return {
    Comp: comp,
    props,
  };
}

export function BatchProvider({ providers, children }: { providers: Provider<any>[]; children?: ReactNode }) {
  return providers.reduceRight(
    (accumulatedChildren, Provider) => <Provider.Comp {...Provider.props}>{accumulatedChildren}</Provider.Comp>,
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>{children}</>,
  );
}
