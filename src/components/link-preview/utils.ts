import { Image } from 'react-native'

import { Size } from './types'

export const getImageSize = (url: string) => {
  return new Promise<Size>((resolve, reject) => {
    Image.getSize(
      url,
      (width, height) => {
        resolve({ height, width })
      },
      // type-coverage:ignore-next-line
      (error) => reject(error)
    )
  })
}
