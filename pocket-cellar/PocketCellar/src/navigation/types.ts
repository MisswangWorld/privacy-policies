import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Position } from '../types';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Main: undefined;
  CreateCellar: { isFirstCellar?: boolean } | undefined;
  EditCellar: { cellarId: string };
  CellarGrid: { highlightedPosition?: Position } | undefined;
  WineDetail: {
    wineId?: string;
    cellarId: string;
    position: Position;
    mode: 'add' | 'edit' | 'view';
  };
  ListView: undefined;
  Archive: undefined;
  Settings: undefined;
  SelectPosition: {
    cellarId?: string;
    archivedWineId?: string;
    sourceWineId?: string;
    mode: 'restore' | 'copy' | 'move';
  };
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
