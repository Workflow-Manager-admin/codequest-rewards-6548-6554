#!/bin/bash
cd /home/kavia/workspace/code-generation/codequest-rewards-6548-6554/main_container_for_codequest_rewards
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

