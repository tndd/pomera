# Tiltfile

# ./docker-compose.yml のみを読み込むように変更
docker_compose(["./docker-compose.yml"])

# 他のComposeファイルやfirecrawl関連のリソースはコメントアウトしたまま
# docker_compose([
#  "./docker-compose.yml",
#  "./firecrawl/firecrawl/docker-compose.yaml",
#  "./firecrawl/docker-compose.override.yml",
# ])
# k8s_resource('api', port_forwards=3002)
# k8s_resource('worker')
# k8s_resource('playwright-service')
# k8s_resource('redis')


# store と analytics の k8s_resource定義をファイルの最後に配置
# (docker_composeの評価が終わった後に参照されることを期待)
k8s_resource('store')
k8s_resource('analytics')
