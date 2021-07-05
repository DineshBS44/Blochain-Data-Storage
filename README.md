# Private Blockchain - Persistent Data Storage

A Private Blockchain is implemented with all the basic functionalities for a blockchain to work and LevelDB is used to persist the data.

## How is the blockchain built?

The Private Blockchain is built using Javascript which uses some libraries to add functionalities to the chain.

## Features

- Creating a new Blockchain call the createGenesis() method which creates the first block
- Add a new Block to the blockchain by providing the data that the block has to hold
- Get the height of the blockchain i.e the number of blocks in the blockchain
- Get the block details by providing the height of the block
- Validate a block
- Validate the complete blockchain
- Test the blockchain using pre-built tests in the simpleChain.js file
- All the data of the blockchain is persistent and it is stored using LevelDB
- The functions to interact with the levelDB data is written in levelSandbox.js which is the file used by almost all the functions above to get or put data

## Libraries/services used

- **crypto-js** - Module containing some of the most important cryptographic methods and will help us create the block hash.
- **level** - To persist the blockchain data

## Developer

- **Dinesh B S** [(@DineshBS44)](https://github.com/DineshBS44)

## License

Licensed under MIT License : https://opensource.org/licenses/MIT

<br>
<br>
