const xrpl = require('xrpl')

const client = new xrpl.Client("wss://testnet.xrpl-labs.com/");

async function main(){

    await client.connect()

    const hot_wallet = xrpl.Wallet.fromSeed('sEdToVagQdtYYjMzwnSAQD1crBMqHBE') // rL1hZDZ3fdNTkYH2s8Nrx5d4xgf5nNyH99
    const ss = await client.request({"command": "server_state"})
    const amm_fee_drops = ss.result.state.validated_ledger.reserve_inc.toString()
    ammCreate = {
        "TransactionType": "AMMCreate",
        "Account": hot_wallet.address,
        "Amount": {
          "currency": "524C555344000000000000000000000000000000", // RLUSD
          "issuer": "rQhWct2fv4Vc4KRjRgMrxa8xPN9Zx9iLKV",
          "value": '1'
        },
        "Amount2": {
          "currency": "5849444542540000000000000000000000000000", // XIDEBT
          "issuer": "rDPSgbrVQcBgVRC2o5yp8b4ACFJFEFeobb",
          "value": '1'
        },
        "TradingFee": 250, // 0.25%
        "Fee": amm_fee_drops
    }
    const prepared_tx = await client.autofill(ammCreate)
    const signed_create = hot_wallet.sign(prepared_tx)
    console.log(signed_create)
    const amm_create = await client.submitAndWait(signed_create.tx_blob)
    console.log(amm_create)
}

main()