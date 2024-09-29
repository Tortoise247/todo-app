# ベースイメージとして公式のMongoDBイメージを使用
FROM mongo:latest

# メタデータを追加
LABEL maintainer="your-email@example.com"
LABEL description="Dockerfile for MongoDB"

# ポート番号27017を公開

EXPOSE 27017




# コンテナ起動時にMongoDBを実行
CMD ["mongod"]