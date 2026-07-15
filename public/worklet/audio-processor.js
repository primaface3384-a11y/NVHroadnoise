class AudioProcessor extends AudioWorkletProcessor {
  constructor() {
    super()
    this.bufferSize = 4096
    this.buffer = new Float32Array(this.bufferSize)
    this.bufferIndex = 0
    this.isRecording = false
    this.recordChunks = []

    this.port.onmessage = (event) => {
      if (event.data.type === 'start-recording') {
        this.isRecording = true
        this.recordChunks = []
      } else if (event.data.type === 'stop-recording') {
        this.isRecording = false
        this.port.postMessage({
          type: 'recording-complete',
          chunks: this.recordChunks,
        })
        this.recordChunks = []
      } else if (event.data.type === 'set-buffer-size') {
        this.bufferSize = event.data.size
        this.buffer = new Float32Array(this.bufferSize)
        this.bufferIndex = 0
      }
    }
  }

  process(inputs) {
    const input = inputs[0]
    if (!input || !input[0]) return true

    const channelData = input[0]

    if (this.isRecording) {
      this.recordChunks.push(new Float32Array(channelData))
    }

    for (let i = 0; i < channelData.length; i++) {
      this.buffer[this.bufferIndex++] = channelData[i]
      if (this.bufferIndex >= this.bufferSize) {
        this.port.postMessage({
          type: 'analysis-buffer',
          buffer: this.buffer.slice(),
          timestamp: currentTime,
        })
        this.bufferIndex = 0
      }
    }

    return true
  }
}

registerProcessor('audio-processor', AudioProcessor)
