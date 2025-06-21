import { router } from 'expo-router';
import { Clock, Plus, X } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, {
  // eslint-disable-next-line prettier/prettier
useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

interface AnimatedPressableProps {
  children: React.ReactNode;
  style: any;
  onPress: () => void;
  delay: number;
}

const AnimatedPressable: React.FC<AnimatedPressableProps> = ({
  children,
  style,
  onPress,
  delay,
}) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 300 }));
    translateY.value = withDelay(delay, withSpring(0, { damping: 15 }));
  }, [delay, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable style={style} onPress={onPress}>
        {children}
      </Pressable>
    </Animated.View>
  );
};

interface AddButtonMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddButtonMenu: React.FC<AddButtonMenuProps> = ({ isOpen, onClose }) => {
  const translateY = useSharedValue(100);
  const opacity = useSharedValue(0);

  const menuStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  useEffect(() => {
    if (isOpen) {
      translateY.value = withSpring(0, { damping: 15 });
      opacity.value = withTiming(1, { duration: 300 });
    } else {
      translateY.value = withTiming(100, { duration: 200 });
      opacity.value = withTiming(0, { duration: 200 });
    }
  }, [isOpen, opacity, translateY]);

  if (!isOpen) {
    return null;
  }

  return (
    <Pressable style={styles.overlay} onPress={onClose}>
      <Animated.View style={[styles.container, menuStyle]}>
        <AnimatedPressable
          style={styles.button}
          onPress={() => {
            onClose();
            router.push('/outfits/create');
          }}
          delay={100}
        >
          <Clock size={24} color="#FFFFFF" />
          <Text style={styles.label}>Tenue</Text>
        </AnimatedPressable>
        <AnimatedPressable
          style={styles.button}
          onPress={() => {
            onClose();
            router.push('/(tabs)/add');
          }}
          delay={200}
        >
          <Plus size={24} color="#FFFFFF" />
          <Text style={styles.label}>Vêtement</Text>
        </AnimatedPressable>
        <Pressable style={styles.closeButton} onPress={onClose}>
          <X size={28} color="#FFFFFF" />
        </Pressable>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  container: {
    paddingBottom: 90,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#8B5CF6',
    borderRadius: 20,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    color: '#FFFFFF',
    marginLeft: 10,
    fontWeight: '600',
  },
  closeButton: {
    backgroundColor: '#7C3AED',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
});

export default AddButtonMenu;
