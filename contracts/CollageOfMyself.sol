// SPDX-License-Identifier: MIT

pragma solidity 0.8.3;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CollageOfMyself is ERC721Enumerable, Ownable {
    using Strings for uint256;

    string baseURI;
    string public baseExtension = ".json";
    uint256 public mintCost = 1 ether; // 1 MATIC
    uint256 public transferCost = 1 ether; // 1 MATIC to transfer a token to another account without using a approved exchange
    address public wmatic = 0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270; // W-MATIC contract address to be used for token transfers
    uint256 public maxSupply = 500;
    uint256 public maxMintAmount = 20;
    bool public paused = true;
    bool public revealed = false;
    bool public applyTransferFee = false;
    string public notRevealedUri;
    mapping(address => bool) public whitelist;
    mapping(address => string) private publicUsername;

    constructor(
        string memory _initBaseURI,
        string memory _initNotRevealedUri
    ) ERC721("Collage of Myself", "MYSELF") {
        setBaseURI(_initBaseURI);
        setNotRevealedURI(_initNotRevealedUri);
    }

    // internal
    // Return the base URI for the given collection
    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    // public
    // Mint a new token
    function mint(uint256 _mintAmount) 
        public 
        payable {
        uint256 supply = totalSupply();
        require(!paused, "Minting is paused");
        require(_mintAmount > 0, "Mint amount must be greater than 0");
        require(_mintAmount <= maxMintAmount, "Mint amount must be less than or equal to 20");
        require(
            supply + _mintAmount <= maxSupply, 
            "Mint amount must be less than or equal to 500"
        );
        if (msg.sender != owner()) {
            require(
                msg.value >= mintCost * _mintAmount, 
                "Insufficient funds for minting"
            );
        }
        for (uint256 i = 1; i <= _mintAmount; i++) {
            _safeMint(msg.sender, supply + i);
        }
    }

    // Set your public username (example @twitter/username)
    function setPublicUsername(string calldata _publicUsername) 
        public
        returns (bool done){
        require(
            balanceOf(msg.sender) > 0, 
            "You must have a token to set your public username"
        );
        require(!paused, "The contract is paused");
        publicUsername[(msg.sender)] = _publicUsername;
        return true;
    }

    // Display token hold by an address
    function walletOfOwner(address _owner)
        public
        view
        returns (uint256[] memory) {
        uint256 ownerTokenCount = balanceOf(_owner);
        uint256[] memory tokenIds = new uint256[](ownerTokenCount);
        for (uint256 i; i < ownerTokenCount; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
        }
        return tokenIds;
    }

    // Display the token URI
    function tokenURI(uint256 _tokenId)
        public
        view
        virtual
        override
        returns (string memory) {
        require(
            _exists(_tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );
        
        if(revealed == false) {
            return notRevealedUri;
        }

        string memory currentBaseURI = _baseURI();
        return bytes(currentBaseURI).length > 0
            ? string(abi.encodePacked(currentBaseURI, _tokenId.toString(), baseExtension))
            : "";
    }

    // Display public username of token owner
    function publicUsernameOfOwner(address _owner)
        public
        view
        returns (string memory) {
        if(balanceOf(_owner) > 0) {
            return publicUsername[_owner];
        }
        return "";
    }

    // Is the address whitelisted?
    function isWhitelisted(address _addr) 
        public 
        view 
        returns (bool) {
        return whitelist[_addr];
    }

    // Add transfer fee to the transfer if activated and not whitelisted
    function validateTransfer(address _from, address _to) 
        public
        returns (bool isValid) {
        if(applyTransferFee && !isWhitelisted(_from) && !isWhitelisted(_to) && !isWhitelisted(msg.sender)) {
            require(
                IERC20(wmatic).allowance(_from, address(this)) >= transferCost, 
                "W-MATIC allowance too low for transfer fee"
            );
            require(
                IERC20(wmatic).balanceOf(_from) >= transferCost, 
                "Not enough W-MATIC to transfer token"
            );
            require(
                IERC20(wmatic).transfer(address(this), transferCost), 
                "Failed to transfer W-MATIC"
            );
        }
        if(balanceOf(_from) <= 1) {
            publicUsername[_from] = "";
        }
        return true;
    }

    // Add transfer fee to the transfer if activated and not whitelisted
    function transferFrom(address _from, address _to, uint256 _tokenId) 
        public 
        override {
        require(validateTransfer(_from, _to), "Transfer failed");
        _transfer(_from, _to, _tokenId);
    }

    // Add transfer fee to the transfer if activated and not whitelisted
    function safeTransferFrom(address _from, address _to, uint256 _tokenId) 
        public 
        override {
        require(validateTransfer(_from, _to), "Transfer failed");
        safeTransferFrom(_from, _to, _tokenId, "");
    }

    // Add transfer fee to the transfer if activated and not whitelisted
    function safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes memory _data) 
        public 
        override {
        require(validateTransfer(_from, _to), "Transfer failed");
        _safeTransfer(_from, _to, _tokenId, _data);
    }

    // only owner
    // Display the token URI
    function reveal() public onlyOwner() {
        revealed = true;
    }

    // Set the mint&transfer cost (transfer cost apply only for transfer from/to not whitelisted exchange)
    function setCost(uint256 _newMintCost, uint256 _newTransferCost) 
        public 
        onlyOwner() {
        mintCost = _newMintCost;
        transferCost = _newTransferCost;
    }

    // Set maxium mint amount per mint transaction
    function setmaxMintAmount(uint256 _newmaxMintAmount) 
        public 
        onlyOwner() {
        maxMintAmount = _newmaxMintAmount;
    }

    // Show the full URI or hidde it
    function setNotRevealedURI(string memory _notRevealedURI) 
        public 
        onlyOwner() {
        notRevealedUri = _notRevealedURI;
    }

    // Set if the token transfer fee should be applied
    function setApplyTransferFee(bool _eta) 
        public 
        onlyOwner() {
        applyTransferFee = _eta;
    }

    // Set baseURI folder address
    function setBaseURI(string memory _newBaseURI) 
        public 
        onlyOwner() {
        baseURI = _newBaseURI;
    }

    // Set WMATIC address if ever it need to be changed
    function setWmatic(address _newWmatic) 
        public 
        onlyOwner() {
        wmatic = _newWmatic;
    }

    // Set baseURI file extension
    function setBaseExtension(string memory _newBaseExtension) 
        public 
        onlyOwner() {
        baseExtension = _newBaseExtension;
    }

    // Add addrr to whitelist, example Opensea and other NFTs exchange
    function setWhitelist(address _whitelistedAddress, bool _whitelistState) 
        public 
        onlyOwner() {
        whitelist[_whitelistedAddress] = _whitelistState;
    }

    // Activate/Pause Minting
    function pause(bool _state)
        public 
        onlyOwner() {
        paused = _state;
    }

    // Withdraw minting/transfer fees
    function withdraw()
        public 
        onlyOwner() {
        (bool success, ) = payable(msg.sender).call{value: address(this).balance}("");
        require(success, "Failed to withdraw");
    }

    // Withdraw airdrop or other tokens
    function withdrawERC20(address _tokenAddress) 
        public 
        onlyOwner() {
        bool success = 
            IERC20(_tokenAddress)
                .transfer(
                    msg.sender, 
                    IERC20(_tokenAddress)
                        .balanceOf(address(this)));
        require(success, "Failed to withdraw");
    }
}