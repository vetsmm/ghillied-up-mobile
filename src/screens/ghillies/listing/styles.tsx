import {StyleSheet} from 'react-native';
import {getStatusBarHeight, isIphoneX} from 'react-native-iphone-x-helper';

export default StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    paddingTop: isIphoneX() ? getStatusBarHeight() + 20 : 30,
  },
  internalGhillieContainer: {
    flex: 1,
    flexGrow: 2,
    paddingVertical: 8,
  },
  popularContainer: {
    flex: 1,
    flexGrow: 2,
    paddingVertical: 8,
  },
  listContainer: {
    flex: 1,
    flexGrow: 2,
    paddingVertical: 8,
  },
  myGhilliesContainer: {
    flex: 1,
    flexGrow: 1,
    marginBottom: 10,
    marginTop: 10,
  }
});
