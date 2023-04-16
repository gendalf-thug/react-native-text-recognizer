import {useEffect, useState} from 'react'

import {Alert, Linking, PermissionsAndroid, Platform} from 'react-native'
import {PERMISSIONS, RESULTS, check, request} from 'react-native-permissions'

interface useCameraPermissionsParams {
  callWhenRender?: boolean
  onCancel?: () => void
}

export function useCameraPermissions(params?: useCameraPermissionsParams) {
  const {callWhenRender, onCancel} = params ?? {}
  const [isAllowed, setIsAllowed] = useState(false)

  const onPermissionsFail = () =>
    Alert.alert(
      'Error',
      'Камера заблокирована, но вы можете разрешить доступ в настройках приложения',
      [
        {
          text: 'Разрешить доступ',
          onPress: Linking.openSettings,
          style: 'default',
        },
        {
          text: 'Отмена',
          style: 'cancel',
          onPress: onCancel,
        },
      ],
    )

  async function requestCameraPermissionAndroid() {
    const isCameraAuthorized = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
    )
    if (isCameraAuthorized === PermissionsAndroid.RESULTS.GRANTED) {
      setIsAllowed(true)
      return true
    } else {
      onPermissionsFail()
      return false
    }
  }
  async function requestCameraPermissionIos() {
    const isCameraAuthorized =
      (await check(PERMISSIONS.IOS.CAMERA)) === RESULTS.GRANTED
    if (isCameraAuthorized) {
      setIsAllowed(true)
      return true
    } else {
      const CameraPermissionStatus = await request(PERMISSIONS.IOS.CAMERA)
      if (CameraPermissionStatus === RESULTS.GRANTED) {
        setIsAllowed(true)
        return true
      }
      onPermissionsFail()
      return false
    }
  }

  const requestCameraPermission =
    Platform.OS === 'android'
      ? requestCameraPermissionAndroid
      : requestCameraPermissionIos

  useEffect(() => {
    if (callWhenRender) {
      requestCameraPermission()
    }
  }, [])

  return {isAllowed, requestCameraPermission}
}

export function useGalleryPermissions(params?: useCameraPermissionsParams) {
  const {callWhenRender, onCancel} = params ?? {}
  const [isAllowed, setIsAllowed] = useState(false)

  const onPermissionsFail = () =>
    Alert.alert(
      'Error',
      'Галерея заблокирована, но вы можете разрешить доступ в настройках приложения',
      [
        {
          text: 'Разрешить доступ',
          onPress: Linking.openSettings,
          style: 'default',
        },
        {
          text: 'Отмена',
          style: 'cancel',
          onPress: onCancel,
        },
      ],
    )

  async function requestGalleryPermissionAndroid() {
    const galleryAuthorizedStatus = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
    ])
    if (
      galleryAuthorizedStatus['android.permission.READ_EXTERNAL_STORAGE'] ===
        PermissionsAndroid.RESULTS.GRANTED ||
      galleryAuthorizedStatus['android.permission.READ_MEDIA_IMAGES'] ===
        PermissionsAndroid.RESULTS.GRANTED
    ) {
      setIsAllowed(true)
      return true
    } else {
      onPermissionsFail()
      return false
    }
  }
  async function requestGalleryPermissionIos() {
    const isGalleryAuthorized =
      (await check(PERMISSIONS.IOS.PHOTO_LIBRARY)) === RESULTS.GRANTED
    if (isGalleryAuthorized) {
      setIsAllowed(true)
      return true
    } else {
      const GalleryPermissionStatus = await request(
        PERMISSIONS.IOS.PHOTO_LIBRARY,
      )
      if (GalleryPermissionStatus === RESULTS.GRANTED) {
        setIsAllowed(true)
        return true
      }
      onPermissionsFail()
      return false
    }
  }

  const requestGalleryPermission =
    Platform.OS === 'android'
      ? requestGalleryPermissionAndroid
      : requestGalleryPermissionIos

  useEffect(() => {
    if (callWhenRender) {
      requestGalleryPermission()
    }
  }, [])

  return {isAllowed, requestGalleryPermission}
}
