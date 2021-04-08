pragma solidity ^0.4.26;
pragma experimental ABIEncoderV2;

contract Tweets {
    uint256 timestamp;
    string text;
    address sender;

    function Tweets(string _text) {
        sender = tx.origin;
        timestamp = block.timestamp;
        text = _text;
    }

    function getall()
        returns (
            string,
            uint256,
            address
        )
    {
        return (text, timestamp, sender);
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
}

contract App {
    address[] Tweets_list;
    uint256 Tweets_list_length;

    function get_Tweets_list_length() returns (uint256) {
        return Tweets_list_length;
    }

    function get_Tweets_N(uint256 index)
        returns (
            string,
            uint256,
            address
        )
    {
        return Tweets(Tweets_list[index]).getall();
    }

    function get_last_Tweets_N(uint256 count, uint256 offset)
        returns (
            string[],
            uint256[],
            address[]
        )
    {
        string[] memory text = new string[](count);
        uint256[] memory timestamp = new uint256[](count);
        address[] memory sender = new address[](count);
        for (uint256 i = offset; i < count; i++) {
            Tweets myTweets = Tweets(Tweets_list[i + offset]);
            text[i + offset] = myTweets.get_text();
            timestamp[i + offset] = myTweets.get_timestamp();
            sender[i + offset] = myTweets.get_sender();
        }
        return (text, timestamp, sender);
    }

    struct UserInfo {
        address owner;
        bool exists;
        address[] Tweets_list;
        uint256 Tweets_list_length;
    }
    mapping(address => UserInfo) public user_map;
    address[] UserInfoList;
    uint256 UserInfoListLength;

    event NewTweets(address sender);

    function new_Tweets(string text) returns (address) {
        address mynew = address(new Tweets({_text: text}));
        if (!user_map[tx.origin].exists) {
            user_map[tx.origin] = create_user_on_new_Tweets(mynew);
        }
        user_map[tx.origin].Tweets_list.push(mynew);

        Tweets_list.push(mynew);
        Tweets_list_length += 1;

        emit NewTweets(tx.origin);

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
                Tweets_list_length: 0
            });
    }
}
