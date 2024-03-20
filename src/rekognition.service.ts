import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class RekognitionService {
  private rekognition: AWS.Rekognition;

  constructor() {
    this.rekognition = new AWS.Rekognition();
  }

  async compareFaces(sourceImage: Buffer, targetImage: Buffer): Promise<AWS.Rekognition.CompareFacesResponse> {
    const params: AWS.Rekognition.CompareFacesRequest = {
      SourceImage: {
        Bytes: sourceImage,
      },
      TargetImage: {
        Bytes: targetImage,
      },
      SimilarityThreshold: 90, // Adjust as needed
    };
    return this.rekognition.compareFaces(params).promise();
  }

  async detectFaces(image: Buffer): Promise<AWS.Rekognition.DetectFacesResponse> {
    const params: AWS.Rekognition.DetectFacesRequest = {
      Image: {
        Bytes: image,
      },
    };
    return this.rekognition.detectFaces(params).promise();
  }
}
