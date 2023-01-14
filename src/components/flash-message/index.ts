import FlashMessageManager from "./flash-message-manager";
import { getFlashMessageStatusBarHeight, styleWithInset } from "./flash-message-wrapper";
import FlashMessage, {
  DefaultFlash,
  positionStyle,
  showMessage,
  hideMessage,
  FlashMessageTransition,
  renderFlashMessageIcon,
} from "./flash-message";
import React from "react";

export {
  FlashMessageManager,
  DefaultFlash,
  styleWithInset,
  getFlashMessageStatusBarHeight,
  positionStyle,
  showMessage,
  hideMessage,
  FlashMessageTransition,
  renderFlashMessageIcon,
};

export default FlashMessage;

export const FlashMessageRef = React.createRef<FlashMessage>();
