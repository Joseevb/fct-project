rm -rf ./src/api
openapi-generator-cli generate -i ./api-spec/openapi.yaml -g typescript-axios -o ./src/api -c ./openapi-generator-config.json
