# Work in Progress
- [ ] Separate Blockchain, Miner and Transactionpool in individual Express servers and let them communicate via HTTP requests and subscriptions
    - [ ] Setup docker-compose with network
- [ ] Implement Proof of Work
- [ ] Validate Blocks before adding to blockchain and send result to miner
    - [ ] sufficient funds
    - [ ] Other miner was faster
- [ ] Add Cryptographic signatures to Transactions

# Blockchain Application
This is a simple Blockchain application playing with the concepts of Proof of Work, Transaction Pools and Cryptographic signatures. On the infrastructure side it leverages containers to scale up certain components (mining). 

# Useful Commands

## Create Docker Image
```
/workspaces/sde-blockchain/blockchain (main ✗) $ docker build . -t martin/blockchain-app
```

## Remove Docker image
```
docker rmi martin/blockchain-app --force
```

## Run
docker run -p 3000:3000 -d martin/blockchain-app

## Logs
```
# Get Container ID
$ docker ps

# Print app output
$ docker logs <container id>
```
