pragma solidity ^0.4.26;
pragma experimental ABIEncoderV2;

contract Media {
    uint256 timestamp;
    string url;
    address sender;
    string media_type;

    function Media(string _url, string _media_type) {
        sender = msg.sender;
        timestamp = block.timestamp;
        url = _url;
        media_type = _media_type;
    }

    function get_url() returns (string) {
        return url;
    }

    function get_timestamp() returns (uint256) {
        return timestamp;
    }

    function get_sender() returns (address) {
        return sender;
    }

    function get_media_type() returns (string) {
        return media_type;
    }
}

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
    address[] Media_list;
    uint256 Media_list_length;
    //event NewJobs(address creater); //todo loop and fill out fields

    address[] Tweets_list;
    uint256 Tweets_list_length;
    //event NewJobs(address creater); //todo loop and fill out fields

    struct UserInfo {
        address owner;
        bool exists;
        address[] Media_list;
        uint256 Media_list_length;
        address[] Tweets_list;
        uint256 Tweets_list_length;
    }
    mapping(address => UserInfo) public user_map;
    address[] UserInfoList;
    uint256 UserInfoListLength;

    function new_Media(string url, string media_type) returns (address) {
        address mynew =
            address(new Media({_url: url, _media_type: media_type}));
        if (!user_map[msg.sender].exists) {
            user_map[msg.sender] = create_user_on_new_Media(mynew);
        }
        user_map[msg.sender].Media_list.push(mynew);

        Media_list.push(mynew);
        Media_list_length += 1;
        // emit NewPublicMessage(message, message_text,msg.sender);

        return mynew;
    }

    function create_user_on_new_Media(address addr) private returns (UserInfo) {
        address[] storage Media_list;
        UserInfoList.push(addr);
        return
            UserInfo({
                exists: true,
                owner: addr,
                Media_list: Media_list,
                Media_list_length: 0,
                Tweets_list: Tweets_list,
                Tweets_list_length: 0
            });
    }

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
                Media_list: Media_list,
                Media_list_length: 0,
                Tweets_list: Tweets_list,
                Tweets_list_length: 0
            });
    }
}
