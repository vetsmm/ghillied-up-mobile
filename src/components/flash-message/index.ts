import FlashMessageManager from "./flash-message-manager";
import FlashMessageWrapper, { getFlashMessageStatusBarHeight, styleWithInset } from "./flash-message-wrapper";
import FlashMessage, {
  DefaultFlash,
  positionStyle,
  showMessage,
  hideMessage,
  FlashMessageTransition,
  renderFlashMessageIcon,
} from "./flash-message";

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
