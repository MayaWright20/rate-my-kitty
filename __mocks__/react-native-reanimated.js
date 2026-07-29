// Mock for react-native-reanimated
// Reanimated uses native modules that can't run in Jest's Node.js environment
// This mock provides JavaScript-only replacements for testing

const Reanimated = {
  // Shared value - returns a simple object with a value property
  useSharedValue: (initialValue) => ({
    value: initialValue
  }),

  // Animated style - returns the style object directly (no animation in tests)
  useAnimatedStyle: (styleCallback) => styleCallback(),

  // Spring animation - returns the value directly (no animation in tests)
  withSpring: (value) => value,

  // Timing animation
  withTiming: (value) => value,

  // Decay animation
  withDecay: (value) => value,

  // Sequence of animations
  withSequence: (...animations) => animations[animations.length - 1],

  // Delay animation
  withDelay: (delayMs, delayedAnimation) => delayedAnimation,

  // Repeat animation
  withRepeat: (animation) => animation,

  // Easing functions
  Easing: {
    linear: (t) => t,
    ease: (t) => t,
    in: (fn) => fn,
    out: (fn) => fn,
    inOut: (fn) => fn,
    bezier: () => (t) => t,
    circle: (t) => t,
    sin: (t) => t,
    exp: (t) => t
  },

  // Interpolation
  interpolate: (value, inputRange, outputRange) => {
    const index = inputRange.indexOf(value);
    return index >= 0 ? outputRange[index] : outputRange[0];
  },

  // Interpolate color
  interpolateColor: (value, inputRange, outputRange) => outputRange[0],

  // Derived value
  useDerivedValue: (fn) => ({ value: fn() }),

  // Worklet
  runOnJS: (fn) => fn,
  runOnUI: (fn) => fn,

  // Default export - the Animated namespace
  default: {
    View: "Animated.View",
    Text: "Animated.Text",
    ScrollView: "Animated.ScrollView",
    Image: "Animated.Image",
    FlatList: "Animated.FlatList",
    SectionList: "Animated.SectionList"
  },

  // View types
  View: "Animated.View",
  Text: "Animated.Text",
  ScrollView: "Animated.ScrollView",
  Image: "Animated.Image",

  // Hooks
  useAnimatedProps: (callback) => callback(),

  // Layout animations
  Layout: {
    springify: () => ({}),
    damping: () => ({}),
    stiffness: () => ({})
  },

  // Transition
  Transition: {
    Together: "Transition.Together",
    Out: "Transition.Out",
    In: "Transition.In"
  },

  // createAnimatedComponent
  createAnimatedComponent: (Component) => Component
};

module.exports = Reanimated;
