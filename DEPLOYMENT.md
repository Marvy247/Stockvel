# Deployment Guide

## Smart Contract (Celo Mainnet)

```bash
cd contracts
cp .env.example .env
# Add your private key (with 0x prefix) to .env
forge script script/DeployStokvel.s.sol --rpc-url https://forno.celo.org --broadcast
```

Update `STOKVEL_ADDRESS` in `frontend/src/contract.ts` with the deployed address.

**Deployed contract:** `0xd8b4875b61130D651409d26C47D49f57BEbC1780`  
**Explorer:** https://explorer.celo.org/mainnet/address/0xd8b4875b61130D651409d26C47D49f57BEbC1780

## Frontend (Vercel)

```bash
cd frontend
npm install
npm run build
vercel --prod
```

## MiniPay Compatibility

The app uses the injected wallet connector and the `useMiniPay` hook to detect MiniPay.  
Test in MiniPay by loading the deployed URL inside the MiniPay browser.
