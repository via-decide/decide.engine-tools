export type CapturedFrame = { width: number; height: number; data: Uint8ClampedArray };

export class GifExporter {
  private frames: CapturedFrame[] = [];

  captureFrame(frame: CapturedFrame) {
    this.frames.push(frame);
  }

  exportGif() {
    return {
      format: 'gif-stub',
      frameCount: this.frames.length,
      frames: this.frames
    };
  }
}
