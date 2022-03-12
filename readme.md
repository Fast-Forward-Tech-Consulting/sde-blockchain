# Work in Progress
- [x] Transaction Pools
- [x] Blockchain
    - [x] Genesis Block
    - [ ] Validate Blocks before adding to blockchain and send result to miner
        - [ ] sufficient funds
        - [x] Other miner was faster
- [x] Transactions
    - [ ] Add Cryptographic signatures to Transactions
- [x] Miner
    - [x] Implement Proof of Work

## Infrastructure
- [x] Separate Blockchain, Miner and Transactionpool in individual Express servers and let them communicate via HTTP requests and subscriptions
    - [x] docker setup 
    - [ ] Setup docker-compose with network

# Blockchain Application
## System Overview
This is a simple Blockchain application playing with the concepts of Proof of Work, Transaction Pools and Cryptographic signatures. On the infrastructure side it leverages containers to scale up certain components (mining). 
![System Overview](system_overview.png?raw=true "System Overview")

### Proof-of-Work Consensus
The system uses a Proof-of-Work Consensus. That means that the Miners need to do some (useless) work in order to commit a block to the blockchain. As long as the majority of miners follow the rules of the system, the system will stay in a valid state. If a malicious participitiant wants to manipulate the system, it is not enough to create many miners. He will have to equip them with more CPU resources than the sum of the correct nodes.

## Model

### Transaction (Trx)
A Transaction resembles the record a money flow from one user to another. Therefore it contains a creation timestamp, sender, receiver and an amount. Furthermore, it contains a signature of the sender confirming that the transaction is created by him. This signature is not validated. Derived from these values a hash of the transaction is created which can identify the transaction.
```json
{
    "sender": "john",
    "receiver": "alice",
    "amount": 10,
    "signature": "asd23wea",
    "createdAt": 1646927117243,
    "hash": "73c9f1aedfd0bbbcf57410312b01e55da0a4d3f2d306f360ca12fa567de4143a"
}
```

### Block
A block in the Blockchain contains a timestamp of the creation time of the block (start of mining), an array of transactions, the ID of the Miner that mined the block. Additionally it contains the hash of the previous block and a nonce. Derived from these values a hash of the block is created. 

The process of mining is defined as the continous effort of the miner to change the nonce so that the newly calculated hash of the block begins with a number (target) of zeros ("0"). If the blockchain has a target of 6 it will only accept new Block with a hash with 6 leading zeros (e.g. "000000b10640a0ae5c4...").
```jsonc
{
    "nonce": 128,
    "timestamp": 1646927117243,
    "trxs": [
      {
        "sender": "john",
        "receiver": "alice",
        "amount": 10,
        "signature": "asd23wea",
        "createdAt": 1646927117243,
        "hash": "73c9f1aedfd0bbbcf57410312b01e55da0a4d3f2d306f360ca12fa567de4143a"
      },
      // ...
    ],
    "prevHash": "000000de177b684a3ce6c202c5703fead8894fc35a8df43792b10640a0ae5c4",
    "minedBy": "987",
    "hash": "000000b10640a0ae5c46465ed4de177b684a3ce6c202c5703fead8894fc35a8"
}
```
The Genesisblock of the Blockchain is a special block. It does not contain a "prevHash" value, since it is the first block.

#### Immutability of the Blockchain
Due to the fact that the hash of the previous block is part of a block it is very hard for an attacker to change something in the blockchain. A change in a block (or in a trasanction within a block) would result in a changed hash. First it requires resources to compute this. Furthermore, the following block contains the hash of the changed block. Therefore, the hash of the following block need to be recomputed aswell. This continues to the last commited block. The more blocks are appended to a block, the harder it gets to change it. 

## API

### Blockchain

#### GET /target
Retrieve the target for the blockchain. The target is defined as the number of leading zeros of the hash of a new block in order to be accepted by the blockchain. This endpoint is queried by the miners so they can mine new blocks meeting the target.
```json
{
    "target": 6
}
```

#### GET /chain/blocks
Retrieve all Blocks from the Blockchain
```jsonc
[
  {
    "nonce": 0,
    "timestamp": 1646927117243,
    "trxs": [
      {
        "sender": "john",
        "receiver": "alice",
        "amount": 10,
        "signature": "asd23wea",
        "createdAt": 1646927117243,
        "hash": "73c9f1aedfd0bbbcf57410312b01e55da0a4d3f2d306f360ca12fa567de4143a"
      },
      // ...
    ],
    "prevHash": "000000b10640a0ae5c46465ed4de177b684a3ce6c202c5703fead8894fc35a8",
    "minedBy": "876",
    "hash": "000000de177b684a3ce6c202c5703fead8894fc35a8df43792b10640a0ae5c4"
  },
  // ...
]
```

#### GET /chain/blocks/:index
Retrieve nth block from the blockchain.
```jsonc
{
    "nonce": 0,
    "timestamp": 1646927117243,
    "trxs": [
      {
        "sender": "john",
        "receiver": "alice",
        "amount": 10,
        "signature": "asd23wea",
        "createdAt": 1646927117243,
        "hash": "73c9f1aedfd0bbbcf57410312b01e55da0a4d3f2d306f360ca12fa567de4143a"
      },
      // ...
    ],
    "prevHash": "000000de177b684a3ce6c202c5703fead8894fc35a8df43792b10640a0ae5c4",
    "minedBy": "876",
    "hash": "000000b10640a0ae5c46465ed4de177b684a3ce6c202c5703fead8894fc35a8"
}
```

#### GET /chain/blocks/latest
Retrieve the last (most recently added) block from the Blockchain
```jsonc
{
    "nonce": 0,
    "timestamp": 1646927117243,
    "trxs": [
      {
        "sender": "john",
        "receiver": "alice",
        "amount": 10,
        "signature": "asd23wea",
        "createdAt": 1646927117243,
        "hash": "73c9f1aedfd0bbbcf57410312b01e55da0a4d3f2d306f360ca12fa567de4143a"
      },
      // ...
    ],
    "prevHash": "000000de177b684a3ce6c202c5703fead8894fc35a8df43792b10640a0ae5c4",
    "minedBy": "876",
    "hash": "000000b10640a0ae5c46465ed4de177b684a3ce6c202c5703fead8894fc35a8"
}
```

#### POST /chain/blocks
This endpoint is used by the Miners to send a new block to the blockchain. The blockchain service than validates that all the hashes are correctly calculated and that the proposed block refers to the latest block of the chain. If this is not the case, the block is rejected.
```jsonc
{
  "nonce": 78434,
  "timestamp": 1646918047703,
  "minedBy": "786",
  "trxs": [{
      "createdAt": 1646916914999,
      "sender": "Bernd",
      "receiver": "Sofie",
      "amount": "32",
      "signature": "asdwe",
      "hash": "d92a8f18f87c81cfd38f3008a9da3b934243ebe1759021a217541d7954d11b10"
    },
    // ...
  ],
  "prevHash": "a3513e1110acb9111579a8f9a49e3d6f5629d5248d314ba3a7f5643740137ab6",
  "hash": "00000e4b2469446305586c043663aaed50d1c7b826b2a44358264278471c5a7c"
}
```

### TransactionPool
The transaction pool service receives the transactions from the users of the system. Without the transaction pool the users would need to supply their transactions to all the miners individually. Before the beginning of the mining, the miner queries the transactionpool for all open transactions. 

#### POST /trxpool
Add a new transaction to the pool. The timestamp and hash a created by the pool. If a transaction with the same hash already exists, an HTTP error is returned.
```jsonc
{
    "sender": "Bernd",
    "receiver": "Sofie",
    "amount": 32,
    "signature": "sadjlsjdlakds"
}
```
The endpoint returns the created transaction (including the timestamp and the hash).

#### GET /trxpool 
Retrieve an array of all transactions in the pool
```jsonc
[
  {
    "createdAt": 1646930329740,
    "sender": "Bernd",
    "receiver": "Sofie",
    "amount": 32,
    "signature": "",
    "hash": "04ec8834e59f2be059982b65a8d5b3e5c770878db98153e193cf07e8e6945aff"
  },
  {
    "createdAt": 1646930330817,
    "sender": "Bernd",
    "receiver": "Sofie",
    "amount": 32,
    "signature": "",
    "hash": "60f528f7fb6ac5bb1e75267325c9b05e804ef1755e6ed6fdd3f538bbd929b96c"
  },
  // ...
]
```

#### DELETE /trxpool/:hash
Delete the transaction with the hash. Fails if no transaction with the hash is in the pool. If deleted successfully, the endpoint returns the transaction.

# Useful Commands

## Docker Compose

### Run
```
docker-compose up --scale miner=3
```

### Rebuild 
```
docker-compose build
```
Only single container
```
docker-compose build [CONTAINER_NAME]
```

## Create Docker Image
```
/workspaces/sde-blockchain/blockchain (main ✗) $ docker build . -t martin/blockchain-app
```

## Remove Docker image
```
docker rmi martin/blockchain-app --force
```

## Run
```
docker run -p 3000:3000 -d martin/blockchain-app
```

## Logs
```
# Get Container ID
$ docker ps

# Print app output
$ docker logs <container id>
```
