import React from 'react';
import { FlatList } from 'native-base';
import {IFlatListProps} from "native-base/src/components/basic/FlatList/types";

interface VirtualizedViewProps extends IFlatListProps<any> {
  hideData?: boolean;
}

export default function VirtualizedView(props: VirtualizedViewProps) {
  return (
    <FlatList
      {...props}
      data={props.hideData ? [] : props.data}
      ListHeaderComponent={() => (
        <React.Fragment>{props.children}</React.Fragment>
      )}
    />
  );
}
