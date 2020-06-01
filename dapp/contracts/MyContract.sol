pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;
import "./Ownable.sol";

contract MyContract is Ownable {
    
    struct AppInfo{
        string name;
        string[] requiredData;
        string availableData;
    }

    mapping (string => AppInfo) private appInfos;
    string[] public appPublicKeys;
    
    string public privateData;
    
    constructor() 
    Ownable() 
    public {
        
    }

    function appInfo(string memory appPublicKey) public view
        returns(
            string memory,
            string[] memory,
            string memory
        ) {
            require(findAppPublicKey(appPublicKey) != -1, "App public key does not exist");

            AppInfo memory ai = appInfos[appPublicKey];
            
            return (
                ai.name,
                ai.requiredData,
                ai.availableData
            );
    }

    function getAppInfos() public view returns(string[] memory, string[] memory, string[][] memory, string[] memory) {
        string[] memory pks = appPublicKeys;

        string[] memory names = new string[](pks.length);
        string[][] memory requiredDatas = new string[][](pks.length);
        string[] memory availableDatas = new string[](pks.length);

        for (uint i = 0; i < pks.length; i++) {
            (names[i], requiredDatas[i], availableDatas[i]) = appInfo(pks[i]);
        }

        return (pks, names, requiredDatas, availableDatas);
    }

    function getPrivateData() public view onlyOwner returns (string memory) {
        return privateData;
    }

    function eraseDataTo(string memory appPublicKey) public onlyOwner {
        require(findAppPublicKey(appPublicKey) != -1, "App public key does not exist");
        delete appInfos[appPublicKey];
        removeAppPublicKey(appPublicKey);
    }
    
    function setAppInfo(string memory appPublicKey, string memory name, string[] memory arrRequiredData) public onlyOwner {
        require(bytes(appPublicKey).length > 0, "Public key is empty");
        require(arrRequiredData.length > 0, "Required data is empty");
        appInfos[appPublicKey] = AppInfo(name, arrRequiredData, "");
        if(findAppPublicKey(appPublicKey) == -1){
            appPublicKeys.push(appPublicKey);
        }
    }
    
    function updatePrivateData(string memory newPrivateData) public onlyOwner {
        privateData = newPrivateData;
    }
    
    function setAvailableDataTo(string memory appPublicKey, string memory encryptedData) public onlyOwner {
        require(findAppPublicKey(appPublicKey) != -1, "App public key does not exist");
        AppInfo storage ai = appInfos[appPublicKey];
        ai.availableData = encryptedData;
    }

    function setAvailableDateToAll(string[] memory _appPublicKeys, string[] memory encryptedDatas) public onlyOwner {
        require(_appPublicKeys.length == encryptedDatas.length, "Encrypted datas array with wrong length");
        for (uint i = 0; i < _appPublicKeys.length; i++){
            AppInfo storage ai = appInfos[_appPublicKeys[i]];
            ai.availableData = encryptedDatas[i];
        }
    }
    
    function findAppPublicKey(string memory appPublicKey) private view returns (int256){
        for (uint i = 0; i < appPublicKeys.length; i++){
            if(equal(appPublicKeys[i], appPublicKey)){
                return int(i);
            }
        }
        return -1;
    }
    
    function removeAppPublicKey(string memory appPublicKey) private {
        for (uint i=0; i< appPublicKeys.length; i++){
            if(equal(appPublicKeys[i], appPublicKey)){
                appPublicKeys[i] = appPublicKeys[appPublicKeys.length-1];
                delete appPublicKeys[appPublicKeys.length-1];
                appPublicKeys.length--;
            }
        }
    }
    
    // StringUtils
    function compare(string memory _a, string memory _b) private pure returns (int) {
        bytes memory a = bytes(_a);
        bytes memory b = bytes(_b);
        uint minLength = a.length;
        if (b.length < minLength) minLength = b.length;
        //@todo unroll the loop into increments of 32 and do full 32 byte comparisons
        for (uint i = 0; i < minLength; i ++)
            if (a[i] < b[i])
                return -1;
            else if (a[i] > b[i])
                return 1;
        if (a.length < b.length)
            return -1;
        else if (a.length > b.length)
            return 1;
        else
            return 0;
    }
    /// @dev Compares two strings and returns true iff they are equal.
    function equal(string memory _a, string memory _b) public pure returns (bool) {
        return compare(_a, _b) == 0;
    }
    /// @dev Finds the index of the first occurrence of _needle in _haystack
    function indexOf(string memory _haystack, string memory _needle) private pure returns (int)
    {
    	bytes memory h = bytes(_haystack);
    	bytes memory n = bytes(_needle);
    	if(h.length < 1 || n.length < 1 || (n.length > h.length)) 
    		return -1;
    	else if(h.length > (2**128 -1)) // since we have to be able to return -1 (if the char isn't found or input error), this function must return an "int" type with a max length of (2^128 - 1)
    		return -1;									
    	else
    	{
    		uint subindex = 0;
    		for (uint i = 0; i < h.length; i ++)
    		{
    			if (h[i] == n[0]) // found the first char of b
    			{
    				subindex = 1;
    				while(subindex < n.length && (i + subindex) < h.length && h[i + subindex] == n[subindex]) // search until the chars don't match or until we reach the end of a or b
    				{
    					subindex++;
    				}	
    				if(subindex == n.length)
    					return int(i);
    			}
    		}
    		return -1;
    	}	
    }
}