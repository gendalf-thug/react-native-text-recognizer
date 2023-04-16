import * as React from 'react'

import {ScrollView, StyleSheet} from 'react-native'
import {Text} from './components/Text'
import {Button} from './components/Button'
import {Spacer} from './components/Spacer'
import {
  useCameraPermissions,
  useGalleryPermissions,
} from './hooks/usePermissions'
// @ts-ignore
import {recognizeTextFromLocalImage} from 'react-native-text-recognizer'
import ImagePicker from 'react-native-image-crop-picker'
import {imagePickerConfig} from './variables'
import {Color} from './themes'
import {findCardNumberInArray} from './helper'

const App = () => {
  const [result, setResult] = React.useState<string>('')
  const {isAllowed: isAllowedCamera, requestCameraPermission} =
    useCameraPermissions()
  const {isAllowed: isAllowedGallery, requestGalleryPermission} =
    useGalleryPermissions()

  const handleRecognize = async (localPath: string) => {
    const res = await recognizeTextFromLocalImage(localPath)
    console.log('🚀 - res:', res)

    const cardNumber = findCardNumberInArray(res)
    setResult(cardNumber ?? 'Card number not recognized')
  }

  const takePhoto = async () => {
    try {
      const canTakePhoto = isAllowedCamera
        ? true
        : await requestCameraPermission()
      if (canTakePhoto) {
        const img = await ImagePicker.openCamera(imagePickerConfig)
        handleRecognize(img.path)
      }
    } catch (error) {
      console.log('🚀 - error:', error)
    }
  }
  const pickFromGallery = async () => {
    try {
      const canChoicePhoto = isAllowedGallery
        ? true
        : await requestGalleryPermission()

      if (canChoicePhoto) {
        const img = await ImagePicker.openPicker(imagePickerConfig)
        handleRecognize(img.path)
      }
    } catch (error) {
      console.log('🚀 - error:', error)
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Spacer height={80} />
      <Button onPress={pickFromGallery}>Pick image from gallery</Button>
      <Spacer height={20} />
      <Button onPress={takePhoto}>Take a photo</Button>
      <Spacer height={40} />
      <Text>Result: {result}</Text>
      <Spacer height={120} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: Color.bg,
  },
})

export default App
