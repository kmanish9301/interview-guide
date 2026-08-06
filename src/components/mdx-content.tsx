/* eslint-disable react-hooks/static-components */
import * as runtime from "react/jsx-runtime";

const sharedComponents = {
  // We can add Callouts, Sandpack, or custom Alerts here later
};

const getMDXComponent = (code: string) => {
  const fn = new Function(code);
  return fn({ ...runtime }).default;
};

import { useMemo } from "react";

interface MDXProps {
  code: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  components?: Record<string, React.ComponentType<any>>;
}

export function MDXContent({ code, components }: MDXProps) {
  const Component = useMemo(() => getMDXComponent(code), [code]);
  return <Component components={{ ...sharedComponents, ...components }} />;
}
