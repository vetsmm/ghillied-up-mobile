import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 120,
  },
  image: {
    height: 500,
    width: '100%',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 30,
    zIndex: 9,
  },
  updateButton: {
    position: 'absolute',
    top: 20,
    right: 30,
    zIndex: 9,
  },
  cross: {
    height: 34,
    width: 34,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 30,
    paddingHorizontal: 24,
    marginVertical: 18,
    color: '#fff',
  },
  content: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 22,
    paddingHorizontal: 24,
    marginTop: 10
  },
  readMoreContainer: {
    position: 'absolute',
    paddingTop: 14,
    paddingBottom: 28,
    paddingHorizontal: 24,
    bottom: 0,
    width: '100%',
  },
  readMoreText: {
    fontSize: 13,
    fontWeight: '300',
    lineHeight: 22,
  },
  link: {
    color: '#00beff',
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    textDecorationColor: '#00beff',
  },
});
