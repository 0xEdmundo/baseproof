// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title WeightedReputation
 * @notice Onchain reputation protocol with weighted vouching and SBT identity
 * @dev Trust scores influence vouch power - higher score = more weight
 */
contract WeightedReputation is ERC721, ERC721URIStorage, Ownable {
    using Strings for uint256;

    // ============ Constants ============
    uint256 public constant MIN_SCORE = 0;
    uint256 public constant MAX_SCORE = 10000;
    uint256 public constant INITIAL_SCORE = 100;
    uint256 public constant POSITIVE_VOUCH_BASE = 10;
    uint256 public constant NEGATIVE_VOUCH_BASE = 25;
    uint256 public constant INFLUENCE_DIVISOR = 1000;

    // ============ Enums ============
    enum Role { Builder, Creator, Developer, CommunityLeader, Investor }

    // ============ Structs ============
    struct UserProfile {
        uint256 trustScore;
        uint256 totalVouchesReceived;
        uint256 totalVouchesGiven;
        uint256 positiveVouches;
        uint256 negativeVouches;
        uint256 sbtTokenId;
        bool hasSBT;
    }

    struct Vouch {
        address sender;
        address recipient;
        bool positive;
        Role[] roles;
        string comment;
        uint256 weightedPoints;
        uint256 timestamp;
    }

    // ============ State Variables ============
    uint256 private _tokenIdCounter;
    uint256 public mintPriceUSD = 30; // $0.30 in cents
    uint256 public refreshPriceUSD = 15; // $0.15 in cents
    
    mapping(address => UserProfile) public profiles;
    mapping(uint256 => Vouch) public vouches;
    mapping(address => uint256[]) public vouchesReceived;
    mapping(address => uint256[]) public vouchesGiven;
    mapping(address => mapping(address => bool)) public hasVouched;
    
    uint256 public totalVouches;
    
    // Chainlink price feed (to be set)
    address public priceFeed;

    // ============ Events ============
    event VouchCreated(
        uint256 indexed vouchId,
        address indexed sender,
        address indexed recipient,
        bool positive,
        Role[] roles,
        string comment,
        uint256 weightedPoints
    );
    
    event SBTMinted(address indexed user, uint256 indexed tokenId);
    event ProfileRefreshed(address indexed user, uint256 newScore);
    event TrustScoreUpdated(address indexed user, uint256 oldScore, uint256 newScore);

    // ============ Constructor ============
    constructor() ERC721("BaseProof Identity", "BPID") Ownable(msg.sender) {}

    // ============ External Functions ============

    /**
     * @notice Create a vouch for another user
     * @param recipient The address being vouched for
     * @param positive True for positive vouch, false for negative
     * @param roles Array of roles to tag the recipient with
     * @param comment 280-character comment about the recipient
     */
    function vouch(
        address recipient,
        bool positive,
        Role[] calldata roles,
        string calldata comment
    ) external {
        require(recipient != address(0), "Invalid recipient");
        require(recipient != msg.sender, "Cannot vouch for yourself");
        require(!hasVouched[msg.sender][recipient], "Already vouched for this user");
        require(roles.length > 0 && roles.length <= 5, "Must select 1-5 roles");
        require(bytes(comment).length <= 280, "Comment too long");

        // Initialize recipient if first interaction
        if (profiles[recipient].trustScore == 0) {
            profiles[recipient].trustScore = INITIAL_SCORE;
        }

        // Calculate weighted points based on sender's influence
        uint256 influence = getInfluenceMultiplier(msg.sender);
        uint256 basePoints = positive ? POSITIVE_VOUCH_BASE : NEGATIVE_VOUCH_BASE;
        uint256 weightedPoints = (basePoints * influence) / 100;

        // Update recipient's trust score
        uint256 oldScore = profiles[recipient].trustScore;
        uint256 newScore;

        if (positive) {
            newScore = oldScore + weightedPoints;
            if (newScore > MAX_SCORE) newScore = MAX_SCORE;
            profiles[recipient].positiveVouches++;
        } else {
            if (weightedPoints >= oldScore) {
                newScore = MIN_SCORE;
            } else {
                newScore = oldScore - weightedPoints;
            }
            profiles[recipient].negativeVouches++;
        }

        profiles[recipient].trustScore = newScore;
        profiles[recipient].totalVouchesReceived++;
        profiles[msg.sender].totalVouchesGiven++;

        // Store vouch
        uint256 vouchId = totalVouches++;
        vouches[vouchId] = Vouch({
            sender: msg.sender,
            recipient: recipient,
            positive: positive,
            roles: roles,
            comment: comment,
            weightedPoints: weightedPoints,
            timestamp: block.timestamp
        });

        vouchesReceived[recipient].push(vouchId);
        vouchesGiven[msg.sender].push(vouchId);
        hasVouched[msg.sender][recipient] = true;

        emit VouchCreated(vouchId, msg.sender, recipient, positive, roles, comment, weightedPoints);
        emit TrustScoreUpdated(recipient, oldScore, newScore);
    }

    /**
     * @notice Mint your identity SBT
     * @dev Requires payment of mintPriceUSD in ETH
     */
    function mintIdentitySBT() external payable {
        require(!profiles[msg.sender].hasSBT, "Already minted SBT");
        
        // TODO: Integrate Chainlink for ETH/USD conversion
        // For now, use a placeholder minimum
        require(msg.value >= 0.0001 ether, "Insufficient payment");

        // Initialize profile if needed
        if (profiles[msg.sender].trustScore == 0) {
            profiles[msg.sender].trustScore = INITIAL_SCORE;
        }

        uint256 tokenId = _tokenIdCounter++;
        _safeMint(msg.sender, tokenId);
        
        profiles[msg.sender].sbtTokenId = tokenId;
        profiles[msg.sender].hasSBT = true;

        emit SBTMinted(msg.sender, tokenId);
    }

    /**
     * @notice Refresh your SBT metadata with current score
     * @dev Requires payment of refreshPriceUSD in ETH
     */
    function refreshProfile() external payable {
        require(profiles[msg.sender].hasSBT, "No SBT to refresh");
        
        // TODO: Integrate Chainlink for ETH/USD conversion
        require(msg.value >= 0.00005 ether, "Insufficient payment");

        emit ProfileRefreshed(msg.sender, profiles[msg.sender].trustScore);
    }

    // ============ View Functions ============

    /**
     * @notice Get a user's trust score
     */
    function getTrustScore(address user) external view returns (uint256) {
        if (profiles[user].trustScore == 0) return INITIAL_SCORE;
        return profiles[user].trustScore;
    }

    /**
     * @notice Get a user's influence multiplier (0-100+)
     * @dev Based on trust score: score / INFLUENCE_DIVISOR * 10
     */
    function getInfluenceMultiplier(address user) public view returns (uint256) {
        uint256 score = profiles[user].trustScore;
        if (score == 0) score = INITIAL_SCORE;
        
        // Influence ranges from 1 (score 0) to 100+ (score 10000)
        // Formula: (score / 100) + 1, minimum 1
        uint256 influence = (score / 100) + 1;
        return influence;
    }

    /**
     * @notice Get user's full profile
     */
    function getProfile(address user) external view returns (UserProfile memory) {
        UserProfile memory profile = profiles[user];
        if (profile.trustScore == 0) {
            profile.trustScore = INITIAL_SCORE;
        }
        return profile;
    }

    /**
     * @notice Get vouches received by a user
     */
    function getVouchesReceived(address user) external view returns (uint256[] memory) {
        return vouchesReceived[user];
    }

    /**
     * @notice Get vouches given by a user
     */
    function getVouchesGiven(address user) external view returns (uint256[] memory) {
        return vouchesGiven[user];
    }

    /**
     * @notice Get vouch details by ID
     */
    function getVouch(uint256 vouchId) external view returns (Vouch memory) {
        return vouches[vouchId];
    }

    // ============ Admin Functions ============

    function setPriceFeed(address _priceFeed) external onlyOwner {
        priceFeed = _priceFeed;
    }

    function setMintPrice(uint256 _priceUSD) external onlyOwner {
        mintPriceUSD = _priceUSD;
    }

    function setRefreshPrice(uint256 _priceUSD) external onlyOwner {
        refreshPriceUSD = _priceUSD;
    }

    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    // ============ SBT Overrides (Non-transferable) ============

    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override returns (address) {
        address from = _ownerOf(tokenId);
        
        // Allow minting (from == address(0)) but block transfers
        if (from != address(0) && to != address(0)) {
            revert("SBT: Non-transferable");
        }
        
        return super._update(to, tokenId, auth);
    }

    // ============ Required Overrides ============

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
