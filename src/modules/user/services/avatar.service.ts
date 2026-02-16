import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import sharp from 'sharp'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { PrismaService } from '../../../prisma/prisma.service'

@Injectable()
export class AvatarService {
  private readonly S3_BUCKET: string
  private readonly AWS_S3_REGION: string
  private readonly s3Client: S3Client

  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {
    this.S3_BUCKET = configService.getOrThrow('S3_BUCKET')
    this.AWS_S3_REGION = configService.getOrThrow('AWS_S3_REGION')
    this.s3Client = new S3Client({
      region: this.AWS_S3_REGION,
      endpoint: 'https://storage.yandexcloud.net',
    })
  }

  async upload(id: string, file: Buffer, cropData: { x: number, y: number, size: number }) {
    const compressedImage: Buffer = await sharp(file)
      .extract({
        top: cropData.y,
        left: cropData.x,
        width: cropData.size,
        height: cropData.size
      })
      .resize(512, 512, { fit: 'inside' })
      .webp({ quality: 70 })
      .toBuffer()

    const command = new PutObjectCommand({
      Bucket: this.S3_BUCKET,
      Key: `avatars/${id}.webp`,
      Body: compressedImage,
      ContentType: 'image/webp',
    })

    await this.s3Client.send(command)
  }

  async getAvatarUrl(id: string) {
    const headCommand = new HeadObjectCommand({
      Bucket: this.S3_BUCKET,
      Key: `avatars/${id}.webp`,
    })

    try {
      await this.s3Client.send(headCommand)
    } catch (e) {
      if (e.$metadata?.httpStatusCode === 404) {
        return undefined
      }
      throw e
    }

    const command = new GetObjectCommand({
      Bucket: this.S3_BUCKET,
      Key: `avatars/${id}.webp`,
    })

    return await getSignedUrl(this.s3Client, command, { expiresIn: 60 })
  }
}
