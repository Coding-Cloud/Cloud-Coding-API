import { AssetEntity } from './asset.entity';
import { Asset } from '../../../../domain/asset/asset';

export default class AssetAdapter {
  static toAsset(asset: AssetEntity): Asset {
    const { id, name, s3URL, postId, commentId, createdAt } = asset;
    return {
      id,
      name,
      s3URL,
      postId,
      commentId,
      createdAt,
    };
  }

  static toAssetEntity(asset: Asset): AssetEntity {
    return {
      ...asset,
    };
  }
}
