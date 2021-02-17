pragma solidity ^0.4.26;
pragma experimental ABIEncoderV2;

contract Tweets {
    uint256 timestamp;
    string text;
    address sender;
    string location;

    function Tweets(string _text, string _location) {
        sender = msg.sender;
        timestamp = block.timestamp;
        text = _text;
        location = _location;
    }

    function get_text() returns (string) {
        return text;
    }

    function get_timestamp() returns (uint256) {
        return timestamp;
    }

    function get_sender() returns (address) {
        return sender;
    }

    function get_location() returns (string) {
        return location;
    }
}

contract App {
    address[] Tweets_list;
    uint256 Tweets_list_length;
    event NewJobs(address creater); //todo loop and fill out fields

    struct UserInfo {
        address owner;
        bool exists;
        address[] Tweets_list;
        uint256 Tweets_list_length;
    }
    mapping(address => UserInfo) public user_map;
    address[] UserInfoList;
    uint256 UserInfoListLength;

    function new_Tweets(string text, string location) returns (address) {
        address mynew = address(new Tweets({_text: text, _location: location}));
        if (!user_map[msg.sender].exists) {
            user_map[msg.sender] = create_user_on_new_Tweets(mynew);
        }
        user_map[msg.sender].Tweets_list.push(mynew);

        Tweets_list.push(mynew);
        Tweets_list_length += 1;
        // emit NewPublicMessage(message, message_text,msg.sender);

        return mynew;
    }

    function create_user_on_new_Tweets(address addr)
        private
        returns (UserInfo)
    {
        address[] storage Tweets_list;
        UserInfoList.push(addr);
        return
            UserInfo({
                exists: true,
                owner: addr,
                Tweets_list: Tweets_list,
                Tweets_list_length: 1
            });
    }
}
