import React from 'react'

import {StyleProp, StyleSheet, TouchableOpacity, ViewStyle} from 'react-native'

import {Color} from '../themes'

import {Spacer} from './Spacer'
import {Text} from './Text'

interface ButtonT {
  children: string
  style?: StyleProp<ViewStyle>
  disabled?: boolean
  fullWidth?: boolean
  variant?: 'outline' | 'filled' | 'secondaryFilled'
  rightIcon?: JSX.Element
  onPress?: () => void
}

export const Button = ({
  children,
  variant = 'filled',
  style,
  fullWidth,
  onPress,
  rightIcon,
  disabled,
}: ButtonT) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.6}
      disabled={disabled}
      style={[
        styles.container,
        styles[variant],
        fullWidth ? styles.widthFull : styles.flexOne,
        style,
      ]}>
      <Text
        p1
        center
        numberOfLines={2}
        color={
          variant === 'outline'
            ? Color.primaryBlack
            : variant === 'secondaryFilled'
            ? Color.primaryBlack
            : Color.white
        }>
        {children}
      </Text>
      {rightIcon ? (
        <>
          <Spacer width={8} />
          {rightIcon}
        </>
      ) : (
        <></>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 55,
    borderRadius: 10,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  widthFull: {
    width: '100%',
  },
  flexOne: {
    flex: 1,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  secondaryFilled: {
    backgroundColor: Color.secondaryGray,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  filled: {
    backgroundColor: Color.primary,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  outline: {
    borderColor: Color.primary,
    borderWidth: 1,
  },
})
