import {
  NavigationActions,
  NavigationResetAction,
  StackActions,
  NavigationAction,
} from "react-navigation";

export const customNavBack = (): NavigationAction => ({
  type: "Navigation/BACK",
});

export const customNavigate = (
  routeName: string,
  params?: object = {},
): NavigationAction => ({
  type: "Navigation/NAVIGATE",
  routeName,
  params,
});

export const resetToScreen = (routeName: string): NavigationResetAction =>
  StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName })],
  });

export const resetWithStack = (
  index: number,
  routes: string[],
): NavigationResetAction =>
  StackActions.reset({
    index,
    actions: routes.map(routeName => NavigationActions.navigate({ routeName })),
  });
