## Collage of Myself

# Smart Contract

This smart contract is using the ERC721 standard

# Additional public function:

- setPublicUsername() Allow holders to register a name or username with their wallet address
- walletOfOwner() List all nfts that a given address hold
- publicUsernameOfOwner() Display the name or username of a given address
- isWhitelisted() true/false if the address is whitelisted for transfer fee
- validateTransfer() Confirm if the transfer between two address is subject to transfer fee

# More about the transfer fee function

Currently the transfer fees are not activated on this contract, the main marketplace for Collage of Myself collection is OpenSea at the moment. 
However we added the possibility to add and activate transfer fees as a contingency in case a lot of OTC deals take place or OpenSea becomes less popular.

