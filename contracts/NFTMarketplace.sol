//SPDX-License-Identifier:MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTMarketplace is ERC721URIStorage, Ownable {
    struct ListedItems {
        uint256 tokenId;
        address payable owner;
        address payable seller;
        uint256 price;
        bool isListed;
        uint256 totalSell;
        bool isPaid;
    }
    uint256 listingPrice = 0.01 ether;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenId;
    address payable admin;
    mapping(uint256 => ListedItems) private itemDetails;

    constructor() ERC721("SPACE", "SR") {
        admin = payable(msg.sender);
    }

    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }

    function updateListingPrice(uint256 _updatePrice) public onlyOwner {
        listingPrice = _updatePrice;
    }

    function currentTokenId() public view returns (ListedItems memory) {
        uint256 _currentTokenId = _tokenId.current();
        return itemDetails[_currentTokenId];
    }

    function isPaidAlready(uint256 tokenId) public view returns (bool) {
        ListedItems memory listItem = itemDetails[tokenId];
        return listItem.isPaid;
    }

    function createToken(
        string memory _tokenURI,
        uint256 price,
        bool _isListing
    ) public payable returns (uint256) {
        require(listingPrice == msg.value, "listing price must be 0.01");
        require(price > 0, "Price must be Positive");
        _tokenId.increment();
        uint256 tokenId = _tokenId.current();
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, _tokenURI);
        createListedToken(tokenId, price, _isListing);
        return tokenId;
    }

    function createListedToken(
        uint256 tokenId,
        uint256 _price,
        bool _islisting
    ) private {
        itemDetails[tokenId] = ListedItems(
            tokenId,
            payable(address(this)),
            payable(msg.sender),
            _price,
            _islisting,
            0,
            true
        );
        _transfer(msg.sender, address(this), tokenId);
    }

    function getAllNfts() public view returns (ListedItems[] memory) {
        uint256 totalnfts = _tokenId.current();
        uint256 itemCount = 0;
        for (uint256 i = 0; i < totalnfts; i++) {
            if (itemDetails[i + 1].isListed == true) {
                itemCount += 1;
            }
        }
        ListedItems[] memory tokens = new ListedItems[](itemCount);
        uint256 currentToken = 0;
        for (uint256 i = 0; i < totalnfts; i++) {
            if (itemDetails[i + 1].isListed == true) {
                uint256 currentId = i + 1;
                ListedItems storage item = itemDetails[currentId];
                tokens[currentToken] = item;
                currentToken += 1;
            }
        }
        return tokens;
    }

    function getMyNfts() public view returns (ListedItems[] memory) {
        uint256 totalnfts = _tokenId.current();
        uint256 currentIndex = 0;
        uint256 itemCount = 0;
        for (uint256 i = 0; i < totalnfts; i++) {
            if (
                itemDetails[i + 1].owner == msg.sender ||
                itemDetails[i + 1].seller == msg.sender
            ) {
                itemCount += 1;
            }
        }
        ListedItems[] memory tokens = new ListedItems[](itemCount);
        for (uint256 i = 0; i < totalnfts; i++) {
            if (
                itemDetails[i + 1].owner == msg.sender ||
                itemDetails[i + 1].seller == msg.sender
            ) {
                uint256 currentId = i + 1;
                ListedItems storage item = itemDetails[currentId];
                tokens[currentIndex] = item;
                currentIndex += 1;
            }
        }
        return tokens;
    }

    function executeSell(uint256 tokenId) public payable {
        uint256 _price = itemDetails[tokenId].price;
        address _seller = itemDetails[tokenId].seller;
        require(_price == msg.value, "Amount is not enough to Buy");
        itemDetails[tokenId].isListed = false;
        itemDetails[tokenId].seller = payable(msg.sender);
        itemDetails[tokenId].totalSell += 1;
        itemDetails[tokenId].isPaid = false;
        payable(admin).transfer(listingPrice);
        payable(_seller).transfer(msg.value);
        _transfer(address(this), msg.sender, tokenId);
        approve(address(this), tokenId);
    }

    function relisiting(uint256 tokenId, bool _isListed) public payable {
        ListedItems storage listItem = itemDetails[tokenId];
        require(
            listItem.owner == msg.sender || listItem.seller == msg.sender,
            "You are not an Owner"
        );
        if (_isListed) {
            if (listItem.totalSell > 0 && listItem.isPaid == false)
                require(listingPrice == msg.value, "required amount");
            listItem.isListed = true;
            listItem.isPaid = true;
        } else listItem.isListed = false;   
    }

    function updateTokenPrice(uint256 tokenId, uint256 _newPrice) public {
        ListedItems storage listItem = itemDetails[tokenId];
        require(
            listItem.owner == msg.sender || listItem.seller == msg.sender,
            "You are not an Owner"
        );
        listItem.price = _newPrice;
    }
}
