package com.textrecognizer;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;
import com.google.mlkit.vision.common.InputImage;
import com.google.mlkit.vision.text.Text;
import com.google.mlkit.vision.text.TextRecognition;
import com.google.mlkit.vision.text.TextRecognizer;
import com.google.mlkit.vision.text.latin.TextRecognizerOptions;

import java.io.IOException;

@ReactModule(name = TextRecognizerModule.NAME)
public class TextRecognizerModule extends ReactContextBaseJavaModule {
  public static final String NAME = "TextRecognizer";
  public TextRecognizerModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  @NonNull
  public String getName() {
    return NAME;
  }


  @ReactMethod
  public void recognizeText(String imgPath, final Promise promise) {
    try {
      final Bitmap bitmap = getBitmap(imgPath);
      if (bitmap != null) {
        InputImage image = InputImage.fromBitmap(bitmap, 0);

        TextRecognizer textRecognizer = TextRecognition.getClient(TextRecognizerOptions.DEFAULT_OPTIONS);
        Task<Text> result = textRecognizer.process(image)
          .addOnSuccessListener(new OnSuccessListener<Text>() {
            @Override
            public void onSuccess(Text text) {
              WritableArray linesArray = Arguments.createArray();
              for (Text.TextBlock block : text.getTextBlocks()) {
                for (Text.Line line : block.getLines()) {
                  linesArray.pushString(line.getText());
                }
              }
              WritableMap resultMap = Arguments.createMap();
              resultMap.putArray("lines", linesArray);
              promise.resolve(resultMap);
            }
          })
          .addOnFailureListener(new OnFailureListener() {
            @Override
            public void onFailure(@NonNull Exception e) {
              promise.reject("TEXT_RECOGNITION_ERROR", "Text recognition failed", e);
            }
          });
      } else {
        throw new IOException("Could not decode a file path into a bitmap.");
      }
    }
    catch(Exception e) {
      promise.reject("Something went wrong", e.getMessage());
    }
  }
  private Bitmap getBitmap(String imageSource) throws Exception {
    String path = imageSource.startsWith("file://") ? imageSource.replace("file://", "") : imageSource;

    if (path.startsWith("http://") || path.startsWith("https://")) {
      throw new Exception("Cannot select remote files");
    }

    return BitmapFactory.decodeFile(path, new BitmapFactory.Options());
  }
}
