import { useEffect, useState } from 'react';
import { Keyboard, Platform } from 'react-native';

export function useKeyboardInset(bottomOffset = 0) {
  const [inset, setInset] = useState(0);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = Keyboard.addListener(showEvent, (event) => {
      const height = event.endCoordinates.height;
      setInset(Math.max(0, height - bottomOffset));
    });

    const onHide = Keyboard.addListener(hideEvent, () => {
      setInset(0);
    });

    return () => {
      onShow.remove();
      onHide.remove();
    };
  }, [bottomOffset]);

  return inset;
}
