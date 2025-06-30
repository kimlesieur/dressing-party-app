/* eslint-disable prettier/prettier */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
    BaseToastProps,
    default as RNToast,
    ToastProps,
} from 'react-native-toast-message';
import { ToastShowParams } from 'react-native-toast-message/lib/src/types';

import { theme } from '@/config/theme';

type CustomToastProps = Omit<ToastProps, 'config'>;

const CustomToast = (
  toastProps: BaseToastProps,
  backgroundColor: string = theme.colors.success,
) => (
  <View style={styles.container}>
    <View style={[styles.innerContainer, { backgroundColor }]}>
      <Text style={styles.text1}>{toastProps.text1}</Text>
    </View>
  </View>
);

const Toast = ({
  type = 'success',
  visibilityTime = 5000,
  ...props
}: CustomToastProps) => {
  return (
    <RNToast
      config={{
        success: CustomToast,
        error: (toastProps) => CustomToast(toastProps, theme.colors.secondary),
      }}
      type={type}
      visibilityTime={visibilityTime}
      position="bottom"
      bottomOffset={props.bottomOffset ?? 0}
      {...props}
    />
  );
};

export const ShowToast = (config: ToastShowParams = {}) => {
  RNToast.show({
    ...config,
    visibilityTime: config.visibilityTime ?? 5000,
    position: 'bottom',
    bottomOffset: config.bottomOffset ?? undefined,
  });
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  innerContainer: {
    marginHorizontal: 32,
    padding: 16,
    borderRadius: 4,
  },
  text1: {
    fontSize: 14,
    color: theme.colors.white,
  },
});

export default {
  Component: Toast,
  show: ShowToast,
};
