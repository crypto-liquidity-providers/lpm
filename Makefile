CANNON_CHAIN_ID=31337
CANNON_PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
DEPLOYMENTS_DIR=./deployments

.PHONY: deploy
deploy: deploy-lpm deploy-test-token

.PHONY: deploy-lpm
deploy-lpm:
	cannon build \
		--wipe \
		--chain-id "${CANNON_CHAIN_ID}" \
		--private-key "${CANNON_PRIVATE_KEY}" \
		cannonfile.lpm.toml
	cannon inspect \
		lpm:latest \
		--chain-id "${CANNON_CHAIN_ID}" \
		--write-deployments "${DEPLOYMENTS_DIR}"

.PHONY: deploy-test-token
deploy-test-token:
	cannon build \
		--wipe \
		--chain-id "${CANNON_CHAIN_ID}" \
		--private-key "${CANNON_PRIVATE_KEY}" \
		cannonfile.test-token.toml
	cannon inspect \
		test-token:latest \
		--chain-id "${CANNON_CHAIN_ID}" \
		--write-deployments "${DEPLOYMENTS_DIR}"
