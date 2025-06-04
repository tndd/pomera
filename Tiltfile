docker_compose([
  "./docker-compose.yml",
  "./firecrawl/firecrawl/docker-compose.yaml",
  "./firecrawl/docker-compose.override.yml",
])

# 個別にポートフォワードやリソース名で管理
k8s_resource('store')
k8s_resource('analytics')

# firecrawl系（外様）だけTiltで紐づけ、compose側は無編集
k8s_resource('api', port_forwards=3002)
k8s_resource('worker')
k8s_resource('playwright-service')
k8s_resource('redis')
