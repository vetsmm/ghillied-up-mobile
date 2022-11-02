import {Platform, StyleSheet} from 'react-native';

const boxShadow: any = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  android: {elevation: 6},
});

export default StyleSheet.create({
  container: {
    height: 150,
    width: "75%",
    marginBottom: 18,
    backgroundColor: 'black',
    borderRadius: 24,
    marginHorizontal: 16,
    alignSelf: 'center',
    ...boxShadow,
  },
  imageContainer: {flex: 1},
  image: {
    flex: 1,
    borderRadius: 24,
    height: "100%",
    // make the size of the screen wdith
    width: '100%',
  },
  titleContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    height: 160,
    paddingLeft: 16,
    paddingRight: 10,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
    color: '#008583',
    paddingBottom: 24,
  },
  timestamp: {
    position: 'absolute',
    color: '#008583',
    fontSize: 12,
    fontWeight: '300',
    right: 16,
    bottom: 8,
  },
});
