#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(TextRecognizer, NSObject)

RCT_EXTERN_METHOD(recognizeText:(NSString *)imgPath
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
