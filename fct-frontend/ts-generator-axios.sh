rm -rf ./src/api

SPEC_URL="${OPENAPI_URL:-./api-spec/openapi.yaml}"
echo "Generating API client from $SPEC_URL"

openapi-generator-cli generate \
  -i "$SPEC_URL" \
  -g typescript-axios \
  -o ./src/api \
  -c ./openapi-generator-config.json
