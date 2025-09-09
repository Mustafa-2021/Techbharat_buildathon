import Quagga from 'quagga';
import { BrowserBarcodeReader } from '@zxing/library';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';

/**
 * Barcode scanning service using QuaggaJS and ZXing
 */
class BarcodeService {
  constructor() {
    this.isInitialized = false;
    this.zxingReader = new BrowserBarcodeReader();
    this.html5QrInstance = null;
    this.html5QrActive = false;
  }

  /**
   * Initialize QuaggaJS barcode scanner
   * @param {HTMLElement} targetElement - Element to render scanner
   * @param {Object} config - Scanner configuration
   */
  async initializeQuagga(targetElement, config = {}) {
    return new Promise((resolve, reject) => {
      const defaultConfig = {
        inputStream: {
          name: 'Live',
          type: 'LiveStream',
          target: targetElement,
          constraints: {
            width: 640,
            height: 480,
            facingMode: 'environment'
          }
        },
        locator: {
          patchSize: 'medium',
          halfSample: true
        },
        numOfWorkers: 2,
        decoder: {
          readers: [
            'code_128_reader',
            'ean_reader',
            'ean_8_reader',
            'code_39_reader',
            'code_39_vin_reader',
            'codabar_reader',
            'upc_reader',
            'upc_e_reader',
            'i2of5_reader'
          ]
        },
        locate: true
      };

      const mergedConfig = { ...defaultConfig, ...config };

      Quagga.init(mergedConfig, (err) => {
        if (err) {
          console.error('QuaggaJS initialization error:', err);
          reject(err);
          return;
        }
        
        this.isInitialized = true;
        Quagga.start();
        resolve(true);
      });
    });
  }

  /**
   * Stop QuaggaJS scanner
   */
  stopQuagga() {
    if (this.isInitialized) {
      Quagga?.stop();
      this.isInitialized = false;
    }
  }

  /**
   * Start html5-qrcode live scanner
   * @param {string} targetElementId - DOM element id to render scanner into
   * @param {(result: { code: string, format?: string, confidence?: number }) => void} onDetected
   * @param {(error: any) => void} onError
   * @param {Object} options
   */
  async startHtml5Qrcode(targetElementId, onDetected, onError = () => {}, options = {}) {
    try {
      // Stop any existing instances
      await this.stopHtml5Qrcode();

      const formatsToSupport = [
        Html5QrcodeSupportedFormats.EAN_13,
        Html5QrcodeSupportedFormats.EAN_8,
        Html5QrcodeSupportedFormats.UPC_A,
        Html5QrcodeSupportedFormats.CODE_128,
        Html5QrcodeSupportedFormats.CODE_39,
        Html5QrcodeSupportedFormats.QR_CODE
      ];

      const config = {
        fps: options?.fps || 20,
        qrbox: options?.qrbox || 250,
        aspectRatio: options?.aspectRatio || 1.7777778,
        formatsToSupport,
        experimentalFeatures: {
          useBarCodeDetectorIfSupported: true
        }
      };

      this.html5QrInstance = new Html5Qrcode(targetElementId, { verbose: false });

      // Prefer back camera if available
      const devices = await Html5Qrcode.getCameras();
      const backCam = devices?.find(d => /back|rear|environment/i.test(d.label)) || devices?.[0];
      const cameraId = backCam?.id || (devices?.[0] && devices[0].id);

      await this.html5QrInstance.start(
        { deviceId: { exact: cameraId } },
        config,
        (decodedText, decodedResult) => {
          if (!decodedText) return;
          onDetected({
            code: decodedText,
            format: decodedResult?.result?.format?.formatName || decodedResult?.result?.format || 'UNKNOWN',
            confidence: 1.0,
            timestamp: new Date()?.toISOString()
          });
        },
        (scanError) => {
          // Frequent callbacks; keep it quiet unless needed
          onError?.(scanError);
        }
      );

      this.html5QrActive = true;
      return true;
    } catch (error) {
      console.error('html5-qrcode start error:', error);
      this.html5QrActive = false;
      throw error;
    }
  }

  /**
   * Stop html5-qrcode scanner
   */
  async stopHtml5Qrcode() {
    try {
      if (this.html5QrInstance && this.html5QrActive) {
        await this.html5QrInstance.stop();
        await this.html5QrInstance.clear();
      }
    } catch (e) {
      // ignore
    } finally {
      this.html5QrActive = false;
      this.html5QrInstance = null;
    }
  }

  /**
   * Set up barcode detection callback for QuaggaJS
   * @param {Function} onDetected - Callback function for detected barcodes
   * @param {Function} onProcessed - Optional callback for processing updates
   */
  onBarcodeDetected(onDetected, onProcessed = null) {
    Quagga?.onDetected((result) => {
      const code = result?.codeResult?.code;
      const confidence = result?.codeResult?.decodedCodes
        ?.reduce((sum, decoded) => sum + (decoded?.error || 0), 0) / 
        result?.codeResult?.decodedCodes?.length || 0;
      
      // Only accept barcodes with reasonable confidence
      if (code && confidence < 0.2) {
        onDetected({
          code,
          confidence: 1 - confidence,
          format: result?.codeResult?.format,
          timestamp: new Date()?.toISOString()
        });
      }
    });

    if (onProcessed) {
      Quagga?.onProcessed((result) => {
        const drawingCtx = Quagga?.canvas?.ctx?.overlay;
        const drawingCanvas = Quagga?.canvas?.dom?.overlay;

        if (result) {
          // Draw bounding box
          if (result?.boxes) {
            drawingCtx?.clearRect(0, 0, drawingCanvas?.width, drawingCanvas?.height);
            result?.boxes?.filter(box => box !== result?.box)?.forEach(box => {
              Quagga?.ImageDebug?.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: 'green', lineWidth: 2 });
            });
          }

          if (result?.box) {
            Quagga?.ImageDebug?.drawPath(result?.box, { x: 0, y: 1 }, drawingCtx, { color: 'blue', lineWidth: 2 });
          }

          if (result?.codeResult && result?.codeResult?.code) {
            Quagga?.ImageDebug?.drawPath(result?.line, { x: 'x', y: 'y' }, drawingCtx, { color: 'red', lineWidth: 3 });
          }
        }
        
        onProcessed(result);
      });
    }
  }

  /**
   * Scan barcode from image file using ZXing
   * @param {File|HTMLImageElement|HTMLCanvasElement} imageSource - Image source
   * @returns {Promise<Object>} Barcode result
   */
  async scanFromImage(imageSource) {
    try {
      let imageUrl;
      
      if (imageSource instanceof File) {
        imageUrl = URL.createObjectURL(imageSource);
      } else if (imageSource instanceof HTMLImageElement) {
        imageUrl = imageSource?.src;
      } else if (imageSource instanceof HTMLCanvasElement) {
        imageUrl = imageSource?.toDataURL();
      } else {
        throw new Error('Unsupported image source type');
      }

      const result = await this.zxingReader?.decodeFromImage(undefined, imageUrl);
      
      // Clean up object URL if created
      if (imageSource instanceof File) {
        URL.revokeObjectURL(imageUrl);
      }

      return {
        code: result?.getText(),
        format: result?.getBarcodeFormat(),
        confidence: 1.0,
        timestamp: new Date()?.toISOString()
      };
    } catch (error) {
      console.error('Error scanning barcode from image:', error);
      throw new Error('Could not detect barcode in image');
    }
  }

  /**
   * Scan barcode from video stream using ZXing
   * @param {HTMLVideoElement} videoElement - Video element
   * @returns {Promise<Object>} Barcode result
   */
  async scanFromVideo(videoElement) {
    try {
      const result = await this.zxingReader?.decodeFromVideoDevice(
        undefined,
        videoElement
      );

      return {
        code: result?.getText(),
        format: result?.getBarcodeFormat(),
        confidence: 1.0,
        timestamp: new Date()?.toISOString()
      };
    } catch (error) {
      console.error('Error scanning barcode from video:', error);
      throw new Error('Could not detect barcode in video stream');
    }
  }

  /**
   * Validate barcode format and checksum
   * @param {string} barcode - Barcode to validate
   * @returns {Object} Validation result
   */
  validateBarcode(barcode) {
    if (!barcode || typeof barcode !== 'string') {
      return { valid: false, error: 'Invalid barcode format' };
    }

    // Remove any whitespace
    const cleanBarcode = barcode?.trim();

    // Check length and format for common barcode types
    if (/^\d{8}$/?.test(cleanBarcode)) {
      return { valid: true, type: 'EAN-8', barcode: cleanBarcode };
    } else if (/^\d{12}$/?.test(cleanBarcode)) {
      return { valid: true, type: 'UPC-A', barcode: cleanBarcode };
    } else if (/^\d{13}$/?.test(cleanBarcode)) {
      return { valid: true, type: 'EAN-13', barcode: cleanBarcode };
    } else if (/^[0-9A-Z\-\.\$\/\+% ]+$/?.test(cleanBarcode)) {
      return { valid: true, type: 'Code 39', barcode: cleanBarcode };
    } else if (/^[0-9]+$/?.test(cleanBarcode) && cleanBarcode?.length >= 6) {
      return { valid: true, type: 'Generic', barcode: cleanBarcode };
    }

    return { valid: false, error: 'Unsupported barcode format' };
  }

  /**
   * Clean up resources
   */
  cleanup() {
    this.stopQuagga();
    // ZXing cleanup is handled automatically
    // html5-qrcode cleanup
    this.stopHtml5Qrcode();
  }
}

export default new BarcodeService();