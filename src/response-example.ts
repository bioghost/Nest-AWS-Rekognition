import { ApiProperty } from '@nestjs/swagger';

class BoundingBox {
    @ApiProperty({ example: 0.25568243861198425 })
    Width: number;

    @ApiProperty({ example: 0.369062602519989 })
    Height: number;

    @ApiProperty({ example: 0.2875533401966095 })
    Left: number;

    @ApiProperty({ example: 0.1126464456319809 })
    Top: number;
}

class Landmark {
    @ApiProperty({ example: 'eyeLeft' })
    Type: string;

    @ApiProperty({ example: 0.3476639688014984 })
    X: number;

    @ApiProperty({ example: 0.2629237174987793 })
    Y: number;
}

class Pose {
    @ApiProperty({ example: -8.92915153503418 })
    Roll: number;

    @ApiProperty({ example: -4.05068302154541 })
    Yaw: number;

    @ApiProperty({ example: -3.202788829803467 })
    Pitch: number;
}

class Quality {
    @ApiProperty({ example: 71.20711517333984 })
    Brightness: number;

    @ApiProperty({ example: 99.54999542236328 })
    Sharpness: number;
}

class Face {
    @ApiProperty({ type: BoundingBox })
    BoundingBox: BoundingBox;

    @ApiProperty({ example: 99.99906921386719 })
    Confidence: number;

    @ApiProperty({ type: [Landmark] })
    Landmarks: Landmark[];

    @ApiProperty({ type: Pose })
    Pose: Pose;

    @ApiProperty({ type: Quality })
    Quality: Quality;
}

class FaceDetail {
    @ApiProperty({ type: BoundingBox })
    BoundingBox: BoundingBox;

    @ApiProperty({ type: [Landmark] })
    Landmarks: Landmark[];

    @ApiProperty({ type: Pose })
    Pose: Pose;

    @ApiProperty({ type: Quality })
    Quality: Quality;

    @ApiProperty({ example: 99.99906921386719 })
    Confidence: number;
}

class FaceMatch {
  @ApiProperty({ example: 97.78005981445312 })
  Similarity: number;

  @ApiProperty({ type: Face })
  Face: Face;
}

class SourceImageFace {
  @ApiProperty({ type: BoundingBox })
  BoundingBox: BoundingBox;

  @ApiProperty({ example: 99.99906921386719 })
  Confidence: number;
}

export class DetectFaceApiResponse {
    @ApiProperty({ type: [FaceDetail] })
    FaceDetails: FaceDetail[];
}

export class CompareFaceApiResponse {
    @ApiProperty({ type: SourceImageFace })
    SourceImageFace: SourceImageFace;

    @ApiProperty({ type: [FaceMatch] })
    FaceMatches: FaceMatch[];

    @ApiProperty({ type: [Face] })
    UnmatchedFaces: Face[];
}