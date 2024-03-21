ALICE=0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

.PHONY: deploy
deploy:
	forge create --from ${ALICE} --unlocked DummyToken
	forge create --from ${ALICE} --unlocked LPM
