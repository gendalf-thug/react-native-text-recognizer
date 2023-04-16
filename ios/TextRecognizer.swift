import Vision
import UIKit
import Foundation

extension String {
  func stripPrefix(_ prefix: String) -> String {
    guard hasPrefix(prefix) else { return self }
    return String(dropFirst(prefix.count))
  }
}


@objc(TextRecognizer)
class TextRecognizer: NSObject {

    @available(iOS 13.0, *)
    @objc(recognizeText:withResolver:withRejecter:)
    func recognizeText(imgPath: String, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        guard !imgPath.isEmpty else { rejecter("ERR", "You must include the image path", nil); return }
        
        let formattedImgPath = imgPath.stripPrefix("file://")
        
        do {
            let imgData = try Data(contentsOf: URL(fileURLWithPath: formattedImgPath))
            let image = UIImage(data: imgData)
                
            guard let cgImage = image?.cgImage else { return }
            let requestHandler = VNImageRequestHandler(cgImage: cgImage)
                
            let textRecognitionRequest = VNRecognizeTextRequest { (request, error) in
                if let error = error {
                    rejecter("RECOGNITION_ERROR", "Text recognition request failed", error)
                    return
                }
                guard let observations = request.results as? [VNRecognizedTextObservation] else {
                    rejecter("RECOGNITION_ERROR", "Failed to get text recognition observations", nil)
                    return
                }
                    
                var recognizedTextBlocks: [String] = []
                for observation in observations {
                    guard let recognizedText = observation.topCandidates(1).first else {
                        continue
                    }
                    recognizedTextBlocks.append(recognizedText.string)
                }
                resolver(recognizedTextBlocks)
            }
            
            textRecognitionRequest.recognitionLevel = .accurate
            textRecognitionRequest.usesLanguageCorrection = false
            do {
              try requestHandler.perform([textRecognitionRequest])
            } catch {
              rejecter("RECOGNITION_ERROR", "Failed to perform text recognition", error)
            }
        } catch {
          rejecter("IMAGE", "Failed to process image from uri", error)
        }
  }
}
