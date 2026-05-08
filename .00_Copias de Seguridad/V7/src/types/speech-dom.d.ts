interface DocumentPictureInPicture extends EventTarget {
  readonly window: Window | null;
  requestWindow(options?: DocumentPictureInPictureOptions): Promise<Window>;
  addEventListener(
    type: "enter",
    listener: (event: Event) => void,
    options?: boolean | AddEventListenerOptions,
  ): void;
}

interface DocumentPictureInPictureOptions {
  width?: number;
  height?: number;
  disallowReturnToOpener?: boolean;
}

interface Window {
  documentPictureInPicture?: DocumentPictureInPicture;
  SpeechRecognition?: typeof SpeechRecognition;
  webkitSpeechRecognition?: typeof SpeechRecognition;
}
