#!/bin/bash

# 更新代码
echo "Updating code from git..."
git pull

npm run build

cp -r dist/* ../nginx/html
