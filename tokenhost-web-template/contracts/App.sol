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

contract Recipes {
    uint256 timestamp;
    string title;
    string description;
    address sender;

    function Recipes(string _title, string _description) {
        sender = tx.origin;
        timestamp = block.timestamp;
        title = _title;
        description = _description;
    }

    function getall()
        returns (
            string,
            string,
            uint256,
            address
        )
    {
        return (title, description, timestamp, sender);
    }

    function get_title() returns (string) {
        return title;
    }

    function get_description() returns (string) {
        return description;
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

    address[] Recipes_list;
    uint256 Recipes_list_length;

    function get_Recipes_list_length() returns (uint256) {
        return Recipes_list_length;
    }

    function get_Recipes_N(uint256 index)
        returns (
            string,
            string,
            uint256,
            address
        )
    {
        return Recipes(Recipes_list[index]).getall();
    }

    function get_last_Recipes_N(uint256 count, uint256 offset)
        returns (
            string[],
            string[],
            uint256[],
            address[]
        )
    {
        string[] memory title = new string[](count);
        string[] memory description = new string[](count);
        uint256[] memory timestamp = new uint256[](count);
        address[] memory sender = new address[](count);
        for (uint256 i = offset; i < count; i++) {
            Recipes myRecipes = Recipes(Recipes_list[i + offset]);
            title[i + offset] = myRecipes.get_title();
            description[i + offset] = myRecipes.get_description();
            timestamp[i + offset] = myRecipes.get_timestamp();
            sender[i + offset] = myRecipes.get_sender();
        }
        return (title, description, timestamp, sender);
    }

    struct UserInfo {
        address owner;
        bool exists;
        address[] Tweets_list;
        uint256 Tweets_list_length;
        address[] Recipes_list;
        uint256 Recipes_list_length;
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
                Tweets_list_length: 0,
                Recipes_list: Recipes_list,
                Recipes_list_length: 0
            });
    }

    event NewRecipes(address sender);

    function new_Recipes(string title, string description) returns (address) {
        address mynew =
            address(new Recipes({_title: title, _description: description}));
        if (!user_map[tx.origin].exists) {
            user_map[tx.origin] = create_user_on_new_Recipes(mynew);
        }
        user_map[tx.origin].Recipes_list.push(mynew);

        Recipes_list.push(mynew);
        Recipes_list_length += 1;

        emit NewRecipes(tx.origin);

        return mynew;
    }

    function create_user_on_new_Recipes(address addr)
        private
        returns (UserInfo)
    {
        address[] storage Recipes_list;
        UserInfoList.push(addr);
        return
            UserInfo({
                exists: true,
                owner: addr,
                Tweets_list: Tweets_list,
                Tweets_list_length: 0,
                Recipes_list: Recipes_list,
                Recipes_list_length: 0
            });
    }
}
